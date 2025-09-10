// Props compatibles con Next 15 (App Router): params/searchParams SON Promise.
export type RoutePageProps<
  TParams extends Record<string, any> = {},
  TSearchParams extends Record<string, any> = {}
> = {
  params: Promise<TParams>;
  searchParams?: Promise<TSearchParams>;
};
