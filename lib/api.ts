const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('safespace_token') : null;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error occurred' };
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('safespace_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('safespace_token');
    }
  }

  // Auth endpoints
  async register(username: string, password: string, language: string = 'english') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, language }),
    });
  }

  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async checkUsername(username: string) {
    return this.request(`/auth/check-username/${username}`);
  }

  // User endpoints
  async updateProfile(language: string) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ language }),
    });
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  // Incident endpoints
  async getIncidents(page: number = 1, limit: number = 10, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/incidents?${params}`);
  }

  async getIncident(id: string) {
    return this.request(`/incidents/${id}`);
  }

  async createIncident(incidentData: {
    title: string;
    description: string;
    location?: string;
    witnesses?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    tags?: string[];
  }) {
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  }

  // Evidence endpoints
  async getEvidence(page: number = 1, limit: number = 10, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/evidence?${params}`);
  }

  async getEvidenceByIncident(incidentId: string) {
    return this.request(`/evidence/incident/${incidentId}`);
  }

  async uploadEvidence(formData: FormData) {
    const url = `${this.baseURL}/evidence/upload`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Upload failed' };
      }

      return { data };
    } catch (error) {
      console.error('Upload failed:', error);
      return { error: 'Upload failed' };
    }
  }

  async getEvidenceStats() {
    return this.request('/evidence/stats/summary');
  }

  async deleteEvidence(id: string) {
    return this.request(`/evidence/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Assistant endpoints
  async generateComplaint(incidentId: string, language: string = 'english') {
    return this.request('/ai-assistant/generate-complaint', {
      method: 'POST',
      body: JSON.stringify({ incidentId, language }),
    });
  }

  async generateSummary(incidentId: string, language: string = 'english') {
    return this.request('/ai-assistant/generate-summary', {
      method: 'POST',
      body: JSON.stringify({ incidentId, language }),
    });
  }

  async getLegalAdvice(incidentId: string, language: string = 'english') {
    return this.request('/ai-assistant/legal-advice', {
      method: 'POST',
      body: JSON.stringify({ incidentId, language }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService(API_BASE_URL); 