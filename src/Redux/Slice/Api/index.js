import { useCallback } from "react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { propertyType } from "../../../tagTypes";
import { handleTokenRefresh } from "../../../utils/refreshToken";

const generateEndPoint = (endpoint, query) => {
  return `${endpoint}${
    query
      ? `?${Object.entries(query)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : ""
  }`;
};

const transformResponse = (response) => {
  if (response) {
    return {
      data: response,
      pages: response.pages,
      status: response.StatusCode,
    };
  } else {
    throw new Error(response.Error);
  }
};

const getErrorMessage = (error) => {
  const status = error?.error?.status;
  const message = error?.error?.data?.Error;

  if (status) {
    switch (status) {
      case 401:
        return "Unauthorized. Please log in again.";
      case 403:
        return "Forbidden. You don't have permission.";
      case 404:
        return "Not found. The resource doesn't exist.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service unavailable. Please try again soon.";
    }
  }

  return message || "Something went wrong. Please try again later.";
};

const tosifyMessage = async (queryFulfilled, toastify) => {
  try {
    const { data } = await queryFulfilled;
    if (data?.status === 200) {
      toast.success(toastify);
    }
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};

const getRefreshToken = async (token, getRefreshToken) => {
  const refreshToken = await axios.post(
    `${import.meta.env.VITE_REACT_API_URL}/user/refresh-token`,
    {
      accessToken: token,
      refreshToken: getRefreshToken,
    }
  );
  return refreshToken.data.Response;
};

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_API_URL || "http://localhost:3001",
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp <= currentTime) {
            const newAccessToken = await handleTokenRefresh(
              token,
              refreshToken,
              getRefreshToken
            );
            if (newAccessToken) {
              headers.set("Authorization", `Bearer ${newAccessToken}`);
            }
          } else {
            headers.set("Authorization", `Bearer ${token}`);
          }
        } catch (error) {}
      }
      return headers;
    },
  })(args, api, extraOptions);

  // Handle parsing errors (when backend returns plain text instead of JSON)
  if (result.error && result.error.status === 'PARSING_ERROR') {
    // If we have a parsing error but the original status was successful (2xx)
    if (result.error.originalStatus >= 200 && result.error.originalStatus < 300) {
      // Convert the plain text response to a successful response
      return {
        data: {
          message: result.error.data || 'Success',
          status: result.error.originalStatus,
        },
      };
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: Object.values(propertyType),
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    get: builder.query({
      query: ({ endpoint, query = null }) => generateEndPoint(endpoint, query),
      providesTags: (_, __, { tags = [] }) => tags,
      transformResponse,
      async onQueryStarted(
        { toastify, isToastify = true },
        { queryFulfilled }
      ) {
        try {
          if (isToastify) {
            await tosifyMessage(queryFulfilled, toastify);
          }
        } catch (error) {
          toast.error(getErrorMessage(error?.error ?? error));
        }
      },
    }),
    post: builder.mutation({
      query: ({ endpoint, payload, query = null }) => {

        const postEndpoint = generateEndPoint(endpoint, query);
        return {
          url: postEndpoint,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: (_, __, { tags = [] }) => tags,
      transformResponse,
      async onQueryStarted(
        { toastify, isToastify = true },
        { queryFulfilled }
      ) {
        try {
          if (isToastify) {
            await tosifyMessage(queryFulfilled, toastify);
          }
        } catch (error) {
          toast.error(getErrorMessage(error?.error ?? error));
        }
      },
    }),
    put: builder.mutation({
      query: ({ endpoint, payload, query = null }) => {
        const putEndpoint = generateEndPoint(endpoint, query);
        return {
          url: putEndpoint,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: (_, __, { tags = [] }) => tags,
      transformResponse,
      async onQueryStarted(
        { toastify, isToastify = true },
        { queryFulfilled }
      ) {
        try {
          if (isToastify) {
            await tosifyMessage(queryFulfilled, toastify);
          }
        } catch (error) {
          toast.error(getErrorMessage(error?.error ?? error));
        }
      },
    }),
    delete: builder.mutation({
      query: ({ endpoint, payload, query = null }) => {
        const deleteEndpoint = generateEndPoint(endpoint, query);
        return {
          url: deleteEndpoint,
          method: "DELETE",
          body: payload,
        };
      },
      invalidatesTags: (_, __, { tags = [] }) => tags,
      transformResponse,
      async onQueryStarted(
        { toastify, isToastify = true },
        { queryFulfilled }
      ) {
        try {
          if (isToastify) {
            await tosifyMessage(queryFulfilled, toastify);
          }
        } catch (error) {
          toast.error(getErrorMessage(error?.error ?? error));
        }
      },
    }),
    downloadExcel: builder.query({
      queryFn: async (
        {
          endpoint,
          sheetName = "",
          query = null,
          zipName = "",
          buildingName = "",
        },
        _,
        __,
        baseQuery
      ) => {
        const result = await baseQuery({
          url: generateEndPoint(endpoint, query),
          responseHandler: (response) => response.blob(),
        });
        const blob = URL.createObjectURL(result.data);
        const hiddenElement = document.createElement("a");
        hiddenElement.href = blob;
        hiddenElement.download = zipName
          ? zipName
          : `${sheetName}_${buildingName}_report.xlsx`;
        hiddenElement.click();
        return { data: null };
      },
    }),
  }),
});
export const {
  useLazyGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
  useLazyDownloadExcelQuery,
} = api;

export const useLazyCachedGetQuery = () => {
  const [get, metadata] = useLazyGetQuery();
  const cachedGet = useCallback((queryArg) => get(queryArg, true), [get]);
  return [cachedGet, metadata];
};
