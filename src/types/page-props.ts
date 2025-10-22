// src/types/page-props.ts

/** 
 * Tipado genérico para páginas del App Router con parámetros dinámicos.
 * params es un objeto síncrono.
 */
export type PageProps<TParams extends Record<string, string | undefined> = {}> = {
  params: TParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};
