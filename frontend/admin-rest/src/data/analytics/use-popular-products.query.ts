import { QueryParamsType } from "@ts-types/custom.types";
import { useQuery } from "react-query";
import Product from "@repositories/product";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { Product as TProduct } from "@ts-types/generated";

const fetchPopularProducts = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const { limit = 15 } = params as { limit: number };
  const url = `${API_ENDPOINTS.POPULAR_PRODUCTS}?limit=${limit}`;
  const { data } = await Product.popularProducts(url);
  return data;
};

const usePopularProductsQuery = (options: { limit: number }) => {
  return useQuery<TProduct[], Error>(
    [API_ENDPOINTS.POPULAR_PRODUCTS, options],
    fetchPopularProducts
  );
};

export { usePopularProductsQuery, fetchPopularProducts };
