
// src/types/page-props.ts

/** 
 * Tipado genérico para páginas del App Router con parámetros dinámicos.
 */
export type RoutePageProps<T extends Record<string, string> = Record<string, string>> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
};
