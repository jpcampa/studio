// Props compatibles con Next 15 (App Router): params es síncrono.
// Este tipo genérico ha sido eliminado para favorecer el tipado explícito
// en cada componente de página, que es una práctica más segura y clara.
// export type RoutePageProps<
//   TParams extends Record<string, any> = {},
//   TSearchParams extends Record<string, any> = {}
// > = {
//   params: TParams;
//   searchParams?: TSearchParams;
// };
