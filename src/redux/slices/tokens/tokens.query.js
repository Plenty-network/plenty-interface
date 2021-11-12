import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tokensApi = createApi({
  reducerPath: 'tokens',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://indexer.plentydefi.com/',
  }),
  tagTypes: ['tokens', '7day-price'],
  endpoints: (builder) => ({
    getTokens: builder.query({
      query: () => '/',
      providesTags: ['tokens'],
    }),
    get7DaysChange: builder.query({
      query: () => '/change',
      providesTags: ['7day-price'],
    }),
  }),
});

export const { useGetTokensQuery, useGet7DaysChangeQuery } = tokensApi;

export default tokensApi;
