import fs from 'node:fs/promises';
import path from 'node:path';

const GRAPH = 'https://graph.microsoft.com/v1.0';

async function expectJson(response, label) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${label} ${response.status}: ${text.slice(0, 1200)}`);
  }
  return response.json();
}

async function getGithubOidcToken() {
  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!requestUrl || !requestToken) return null;

  const join = requestUrl.includes('?') ? '&' : '?';
  const response = await fetch(`${requestUrl}${join}audience=${encodeURIComponent('api://AzureADTokenExchange')}`, {
    headers: { Authorization: `Bearer ${requestToken}` }
  });
  const json = await expectJson(response, 'GitHub OIDC');
  return json.value;
}

export async function getGraphAccessToken() {
  if (process.env.GRAPH_ACCESS_TOKEN) return process.env.GRAPH_ACCESS_TOKEN;

  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  if (!tenantId || !clientId) return null;

  const assertion = await getGithubOidcToken();
  if (!assertion) return null;

  const form = new URLSearchParams({
    client_id: clientId,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: assertion
  });

  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form
  });
  const json = await expectJson(response, 'Entra token exchange');
  return json.access_token;
}

async function graphFetch(token, url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
}

export async function resolveDrive(token, hostname, sitePath) {
  const site = await expectJson(
    await graphFetch(token, `${GRAPH}/sites/${hostname}:${sitePath}`),
    'Resolve site'
  );
  const drive = await expectJson(
    await graphFetch(token, `${GRAPH}/sites/${site.id}/drive`),
    'Resolve drive'
  );
  return { siteId: site.id, driveId: drive.id };
}

async function itemAtPath(token, driveId, itemPath) {
  const encoded = itemPath.split('/').map(encodeURIComponent).join('/');
  const response = await graphFetch(token, `${GRAPH}/drives/${driveId}/root:/${encoded}`);
  if (response.status === 404) return null;
  return expectJson(response, `Get ${itemPath}`);
}

export async function ensureFolderPath(token, driveId, folderPath) {
  let current = '';
  for (const part of folderPath.split('/').filter(Boolean)) {
    const next = current ? `${current}/${part}` : part;
    const exists = await itemAtPath(token, driveId, next);
    if (!exists) {
      const parentUrl = current
        ? `${GRAPH}/drives/${driveId}/root:/${current.split('/').map(encodeURIComponent).join('/')}:/children`
        : `${GRAPH}/drives/${driveId}/root/children`;
      await expectJson(await graphFetch(token, parentUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: part,
          folder: {},
          '@microsoft.graph.conflictBehavior': 'fail'
        })
      }), `Create folder ${next}`);
    }
    current = next;
  }
}

export async function uploadFile(token, driveId, localFile, remotePath) {
  const stat = await fs.stat(localFile);
  if (stat.size > 240 * 1024 * 1024) {
    throw new Error(`File too large for simple upload: ${localFile}`);
  }

  const parent = path.posix.dirname(remotePath);
  if (parent && parent !== '.') await ensureFolderPath(token, driveId, parent);

  const encoded = remotePath.split('/').map(encodeURIComponent).join('/');
  const response = await graphFetch(token, `${GRAPH}/drives/${driveId}/root:/${encoded}:/content`, {
    method: 'PUT',
    headers: { 'content-type': 'application/octet-stream' },
    body: await fs.readFile(localFile)
  });
  return expectJson(response, `Upload ${remotePath}`);
}
