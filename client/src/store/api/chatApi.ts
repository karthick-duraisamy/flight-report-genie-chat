
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ReportData {
  id: string;
  groupId: string;
  groupName: string;
  requestType: string;
  tripType: string;
  currency: string;
  requestedFare: number;
  status: string;
  sector?: string;
  departureDate?: string;
  returnDate?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: string[];
  category: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Reports', 'Templates'],
  endpoints: (builder) => ({
    getReportData: builder.query<ReportData[], { 
      filters?: { 
        dateRange?: [string, string];
        currency?: string;
        status?: string;
        sector?: string;
      } 
    }>({
      query: ({ filters }) => ({
        url: 'reports',
        params: filters,
      }),
      providesTags: ['Reports'],
    }),
    getReportTemplates: builder.query<ReportTemplate[], void>({
      query: () => 'templates',
      providesTags: ['Templates'],
    }),
    generateReport: builder.mutation<ReportData[], {
      templateId: string;
      filters: Record<string, any>;
    }>({
      query: ({ templateId, filters }) => ({
        url: 'generate-report',
        method: 'POST',
        body: { templateId, filters },
      }),
      invalidatesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetReportDataQuery,
  useGetReportTemplatesQuery,
  useGenerateReportMutation,
} = chatApi;
