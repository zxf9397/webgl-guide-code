export type KeyofType<T extends Record<any, any> | undefined | null> = T extends object ? keyof T : never;

export type OmitFirstIndexType<T extends any[]> = T extends [any, ...infer U] ? U : never;
