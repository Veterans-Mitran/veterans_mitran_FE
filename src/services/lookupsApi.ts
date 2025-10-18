const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
  meta: any;
}

export interface Service {
  id: number;
  name: string;
  created_on: string;
  modified_on: string | null;
  is_deleted: boolean;
  is_archived: boolean;
}

export interface Rank {
  id: number;
  name: string;
  service_id: number;
  created_on: string;
  modified_on: string | null;
  is_deleted: boolean;
  is_archived: boolean;
}

export interface Status {
  id: number;
  name: string;
  created_on: string;
  modified_on: string | null;
  is_deleted: boolean;
  is_archived: boolean;
}

export interface State {
  id: number;
  name: string;
  created_on: string;
  modified_on: string | null;
  is_deleted: boolean;
  is_archived: boolean;
}

export interface District {
  id: number;
  name: string;
  state_id: number;
  created_on: string;
  modified_on: string | null;
  is_deleted: boolean;
  is_archived: boolean;
  state?: State;
}

export interface PaymentMode {
  id: number;
  mode_name: string;
  created_on: string;
  modified_on: string | null;
  is_deleted: boolean;
  is_archived: boolean;
}

const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const lookupsApi = {
  getServices: async (token: string) => {
    const queryParams = new URLSearchParams({
      skip: '0',
      limit: '100',
      sort_by: 'name',
      sort_order: 'asc',
      include_archived: 'false',
    });

    const response = await fetch(
      `${API_BASE_URL}/api/lookups/services/?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<Service[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch services');
    }

    return result.data;
  },

  getRanks: async (token: string, serviceId?: number) => {
    const queryParams = new URLSearchParams({
      skip: '0',
      limit: '100',
      sort_by: 'name',
      sort_order: 'asc',
      include_archived: 'false',
    });

    if (serviceId) {
      queryParams.append('service_id', String(serviceId));
    }

    const response = await fetch(
      `${API_BASE_URL}/api/lookups/ranks/?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<Rank[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch ranks');
    }

    return result.data;
  },

  getStatuses: async (token: string) => {
    const queryParams = new URLSearchParams({
      skip: '0',
      limit: '100',
      sort_by: 'name',
      sort_order: 'asc',
      include_archived: 'false',
    });

    const response = await fetch(
      `${API_BASE_URL}/api/lookups/statuses/?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<Status[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch statuses');
    }

    return result.data;
  },

  getStates: async (token: string) => {
    const queryParams = new URLSearchParams({
      skip: '0',
      limit: '100',
      sort_by: 'name',
      sort_order: 'asc',
      include_archived: 'false',
    });

    const response = await fetch(
      `${API_BASE_URL}/api/lookups/states/?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<State[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch states');
    }

    return result.data;
  },

  getDistricts: async (token: string, stateId?: number) => {
    const queryParams = new URLSearchParams({
      skip: '0',
      limit: '100',
      sort_by: 'name',
      sort_order: 'asc',
      include_archived: 'false',
    });

    if (stateId) {
      queryParams.append('state_id', String(stateId));
    }

    const response = await fetch(
      `${API_BASE_URL}/api/lookups/districts/?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<District[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch districts');
    }

    return result.data;
  },


  getPaymentModes: async (token: string) => {
    const queryParams = new URLSearchParams({
      skip: '0',
      limit: '100',
      sort_by: 'mode_name',
      sort_order: 'asc',
      include_archived: 'false',
    });

    const response = await fetch(
      `${API_BASE_URL}/api/lookups/payment_modes/?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<PaymentMode[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch payment modes');
    }

    return result.data;
  },


};


