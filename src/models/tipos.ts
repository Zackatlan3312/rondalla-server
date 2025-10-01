export const RANGOS_VOZ = ["aguda","segunda_aguda","media_aguda","media","media_grave","grave"] as const;
export type RangoVoz = typeof RANGOS_VOZ[number];

export const INSTRUMENTALES = ["guitarra_base","guitarra_requinto","bajo"] as const;
export type TipoInstrumental = typeof INSTRUMENTALES[number];

export const ORIGENES = ["telegram","local","otro"] as const;
export type Origen = typeof ORIGENES[number];
