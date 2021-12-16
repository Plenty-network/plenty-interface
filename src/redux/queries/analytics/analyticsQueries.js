import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const analyticsQueries = createApi({
  reducerPath: 'tokens',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://indexer.plentydefi.com/',
  }),
  tagTypes: ['tokens', '7day-price', 'liquidity'],
  endpoints: (builder) => ({
    getTokens: builder.query({
      query: () => '/',
      providesTags: ['tokens'],
    }),
    get7DaysChange: builder.query({
      query: () => '/change',
      providesTags: ['7day-price'],
    }),
    getLiquidity: builder.query({
      query: () => '/liquidity',
      providesTags: ['liquidity'],
    }),
  }),
});

export const { useGetTokensQuery, useGet7DaysChangeQuery, useGetLiquidityQuery } = analyticsQueries;

export default analyticsQueries;
