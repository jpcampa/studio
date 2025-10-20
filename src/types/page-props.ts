// src/types/page-props.ts

/** Params tipados para rutas del App Router (Next 15) */
export type RoutePageProps<T extends Record<string, string> = Record<string, string>> = {
  /** En Next 15 los params pueden ser async (Promise) durante el build */
  params: Promise<T>;
};
