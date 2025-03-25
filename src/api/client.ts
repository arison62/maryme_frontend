/* eslint-disable @typescript-eslint/no-explicit-any */
import { BACKEND_URL } from "@/lib/constants";

const API_CONFIG = {
  baseUrl: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  
    
  
  },
};

export interface APIResponse<T> {
  data: T;
  error?: string | boolean;
  message?: string;
}

export interface APIResponseWithStatus<T> extends APIResponse<T> {
  status: number;
}

function buildUrl(path: string): string {
  const url = new URL(path, API_CONFIG.baseUrl);
  return url.toString();
}

function getHeaders(): HeadersInit {
  const headers = new Headers(API_CONFIG.headers);
  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function get<T>(
  path: string,
  params?: Record<string, any>
): Promise<APIResponseWithStatus<T>> {
  try {
    const fullUrl = new URL(buildUrl(path));
    if (params) {
      Object.keys(params).forEach((key) => {
        fullUrl.searchParams.append(key, params[key]);
      });
    }
    const response = await fetch(fullUrl.toString(), {
      method: "GET",
      credentials: "include",
      headers: getHeaders(),
    
    });
    return handleResponse<T>(response);
  } catch (error: any) {
    return handleFetchError<T>(error);
  }
}

export async function post<T, D = any>(
  path: string,
  data?: D
): Promise<APIResponseWithStatus<T>> {
    
  try {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: getHeaders(),
     
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  } catch (error: any) {
    return handleFetchError<T>(error);
  }
}

export async function put<T, D = any>(
  path: string,
  data?: D
): Promise<APIResponseWithStatus<T>> {
  try {
    const response = await fetch(buildUrl(path), {
      method: "PUT",
      headers: getHeaders(),
     
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleFetchError<T>(response);
  } catch (error: any) {
    return handleFetchError<T>(error);
  }
}

export async function del<T, D = any>(
  path: string,
  data?: D
): Promise<APIResponseWithStatus<T>> {
  try {
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: getHeaders(),
    
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleFetchError<T>(response);
  } catch (error: any) {
    return handleFetchError<T>(error);
  }
}

async function handleResponse<T>(
  response: Response
): Promise<APIResponseWithStatus<T>> {
  let data: any = {};
  console.log("response", response)
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  } catch (error: any) {
    return {
      data: {} as T,
      error: true,
      status: response.status,
      message: `Erreur ${error.message}`,
    };
  }
  if (response.ok) {
    return {
      data: data.data as T,
      error: data.error,
      status: response.status,
      message: data.message,
    };
  } else {
 
    return {
      data: data.data as T,
      error: data.error,
      status: response.status,
      message: data.message,
    };
  }
}

function handleFetchError<T>(error: any): APIResponseWithStatus<T> {
  return {
    data: {} as T,
    status: 0,
    error: true,
    message: error.message || "Une erreur reseau est survenu",
  };
}

export default {
  get,
  post,
  put,
  delete: del,
};
