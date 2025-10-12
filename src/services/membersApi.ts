const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
  meta: any;
}

export interface Address {
  address: string;
  city: string;
  district_id: number;
  state_id: number;
  postal_zip_code: string;
  address_id?: number;
  state?: {
    id: number;
    name: string;
  };
  district?: {
    id: number;
    name: string;
  };
}

export interface VMember {
  vm_id: string;
  service_no: string;
  service_id: number;
  rank_id: number;
  name: string;
  address_id?: number;
  mobile_no: string;
  date_of_birth: string;
  date_of_marriage?: string;
  old_rin_no: string;
  new_rin_no: string;
  member_status: number;
  description?: string;
  created_on: string;
  modified_on?: string;
  is_deleted: boolean;
  is_archived: boolean;
  service?: {
    id: number;
    name: string;
  };
  rank?: {
    id: number;
    name: string;
  };
  status?: {
    id: number;
    name: string;
  };
  primary_address?: Address;
  created_user?: {
    id: number;
    username: string;
  };
}

export interface VMemberCreate {
  service_no: string;
  service_id: number;
  rank_id: number;
  name: string;
  address_details: {
    address: string;
    city: string;
    district_id: number;
    state_id: number;
    postal_zip_code: string;
  };
  mobile_no: string;
  date_of_birth: string;
  date_of_marriage?: string;
  old_rin_no: string;
  member_status: number;
  description?: string;
  created_by: number;
}

export interface VMemberUpdate {
  service_no?: string;
  service_id?: number;
  rank_id?: number;
  name?: string;
  address_details?: {
    address: string;
    city: string;
    district_id: number;
    state_id: number;
    postal_zip_code: string;
  };
  mobile_no?: string;
  date_of_birth?: string;
  date_of_marriage?: string;
  old_rin_no?: string;
  member_status?: number;
  description?: string;
  modified_by: number;
}

const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const membersApi = {
  getMembers: async (token: string, params?: {
    skip?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
    include_archived?: boolean;
  }) => {
    const queryParams = new URLSearchParams({
      skip: String(params?.skip || 0),
      limit: String(params?.limit || 100),
      sort_by: params?.sort_by || 'created_on',
      sort_order: params?.sort_order || 'desc',
      include_archived: String(params?.include_archived || false),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/vm-members/?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<VMember[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch members');
    }

    return { members: result.data, meta: result.meta };
  },

  getArchivedMembers: async (token: string, params?: {
    skip?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  }) => {
    const queryParams = new URLSearchParams({
      skip: String(params?.skip || 0),
      limit: String(params?.limit || 100),
      sort_by: params?.sort_by || 'created_on',
      sort_order: params?.sort_order || 'desc',
    });

    const response = await fetch(
      `${API_BASE_URL}/api/vm-members/archived?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<VMember[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch archived members');
    }

    return { members: result.data, meta: result.meta };
  },

  getMemberById: async (token: string, memberId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/vm-members/${memberId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<VMember> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch member');
    }

    return result.data;
  },

  createMember: async (token: string, data: VMemberCreate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/vm-members/`,
      {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      }
    );

    const result: ApiResponse<VMember> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to create member');
    }

    return result.data;
  },

  updateMember: async (token: string, memberId: string, data: VMemberUpdate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/vm-members/${memberId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      }
    );

    const result: ApiResponse<VMember> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to update member');
    }

    return result.data;
  },

  archiveMember: async (token: string, memberId: string, archivedBy: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/vm-members/${memberId}/archive`,
      {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ archived_by: archivedBy }),
      }
    );

    const result: ApiResponse<null> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to archive member');
    }

    return result;
  },

  restoreMember: async (token: string, memberId: string, restoredBy: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/vm-members/${memberId}/restore`,
      {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ restored_by: restoredBy }),
      }
    );

    const result: ApiResponse<VMember> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to restore member');
    }

    return result.data;
  },

  deleteMember: async (token: string, memberId: string, hardDelete: boolean = false) => {
    const response = await fetch(
      `${API_BASE_URL}/api/vm-members/${memberId}?hard_delete=${hardDelete}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }
    );

    const result: ApiResponse<null> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to delete member');
    }

    return result;
  },
};
