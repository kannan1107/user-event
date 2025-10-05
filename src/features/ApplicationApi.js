import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const appApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl,
        prepareHeaders: (headers, {getState}) => {
            console.log("Prepared Headers :::::::: ", getState());
            // headers.set('Content-Type', 'application/json');
            const token = getState().auth.token;
            if(token){
                headers.set('Authorization', `Bearer ${token}`);
                headers.set('Content-Type', 'application/json')
                return headers;
            }
            console.log("getState", getState());
            return headers;
        }
     }),
    endpoints: (builder) => ({
        // Define your endpoints here
        register: builder.mutation(
            {
                query:(payload)=>({
                    url: '/auth/register',
                    method: 'POST',
                    body: payload,
                })
            }
        ),
        login: builder.mutation(
            {
                query:(payload)=>({
                    url: '/auth/login',
                    method: 'POST',
                    body: payload,
                })
            }
        ),
        fetchEvents: builder.query(
            {
                query:()=>({
                    url: '/events',
                    method: 'GET',
                })
            }
        ),

        createEvent: builder.mutation(
            {
                query:(payload)=>({
                    url: '/event',
                    method: 'POST',
                    body: payload,
                })
            }
        ),
        updateEvent: builder.mutation(

            {
                query:({id, payload})=>({
                    url: `/event/${id}`,
                    method: 'PUT',
                    body: payload,
                })
            }
        ),
        deleteEvent: builder.mutation(
            {
                query:(id)=>({
                    url: `/event/${id}`,
                    method: 'DELETE',
                })
            }
        ),
        bookEvent: builder.mutation(
            {
                query:({id, payload})=>({
                    url: `/event/book/${id}`,
                    method: 'POST',
                    body: payload,
                })
            }
        ),
        cancelEvent: builder.mutation(
            {
                query:(id)=>({
                    url: `/event/cancel/${id}`,
                    method: 'POST',
                })
            }
        ),



})
});




export const { useRegisterMutation, useLoginMutation, useCreateEventMutation, useFetchEventsQuery,
    useDeleteEventMutation, useUpdateEventMutation} = appApi;