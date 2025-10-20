// src/types/page-props.ts

/** Tipado genérico para páginas del App Router con parámetros dinámicos */
export type RoutePageProps<T extends Record<string, string> = Record<string, string>> = {
  /** En Next.js 15, durante el build, `params` puede ser un Promise */
  params: Promise<T>;
};
