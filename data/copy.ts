// Punto de entrada preparado para internacionalización. En una siguiente fase,
// este diccionario puede cargarse por locale sin cambiar los componentes.
export const locales = ["es", "en"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "es";
export const brandCopy = { es: { claim: "El jet privado, por fin a tu alcance.", modes: { charter: "Charter a medida", emptyLeg: "Empty legs", pooling: "Pooling" } } } as const;
