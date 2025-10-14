// Props compatibles con Next 15 (App Router): params es síncrono.
export type RoutePageProps<
  TParams extends Record<string, any> = {},
  TSearchParams extends Record<string, any> = {}
> = {
  params: TParams;
  searchParams?: TSearchParams;
};
