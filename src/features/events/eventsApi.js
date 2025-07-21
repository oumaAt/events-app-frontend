import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Event", "EventStats"],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (filters = {}) => ({
        url: "events/all",
        method: "POST",
        providesTags: ["Event"],
        body: filters,
      }),
    }),
    addEvent: builder.mutation({
      query: (newEvent) => ({
        url: "events",
        method: "POST",
        body: newEvent,
      }),
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: "dashboard/stats",
        method: "POST",
      }),
      providesTags: ["EventStats"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useAddEventMutation,
  useDeleteEventMutation,
  useGetDashboardStatsQuery,
} = eventsApi;
