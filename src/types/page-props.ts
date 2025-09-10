
// Tipo compatible con el App Router de Next 15
export type PageProps<
  TParams extends object = {},
  TSearchParams extends object = {}
> = {
  params: TParams | Promise<TParams>;
  searchParams?: TSearchParams | Promise<TSearchParams>;
};
