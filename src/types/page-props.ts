
// src/types/page-props.ts

/** 
 * Tipado genérico para páginas del App Router con parámetros dinámicos.
 * Este tipo ha sido actualizado para reflejar la forma correcta de acceder
 * a los params en Server Components, que no es a través de una Promise.
 */
export type RoutePageProps<T extends Record<string, string> = Record<string, string>> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
};
