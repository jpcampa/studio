
// Definiendo un tipo genérico para las propiedades de las páginas
// Esto ayuda a manejar tanto las propiedades estáticas como las dinámicas de Next.js
export type RoutePageProps<T = Record<string, string>> = {
  params: T; // Change this to be a direct object
  searchParams?: { [key: string]: string | string[] | undefined };
};
