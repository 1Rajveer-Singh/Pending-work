import type { ApiResponse, SearchQuery, SearchResult, FileMetadata, Peer, NetworkStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Search endpoints
  async search(query: SearchQuery): Promise<ApiResponse<SearchResult[]>> {
    return this.request<SearchResult[]>('/search', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return this.request<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // File endpoints
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<FileMetadata>> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_BASE_URL}/files/upload`);
      xhr.send(formData);
    });
  }

  async getFile(fileId: string): Promise<ApiResponse<FileMetadata>> {
    return this.request<FileMetadata>(`/files/${fileId}`);
  }

  async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  async getFiles(
    page: number = 1,
    limit: number = 20,
    filters?: any
  ): Promise<ApiResponse<FileMetadata[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    
    return this.request<FileMetadata[]>(`/files?${params}`);
  }

  async downloadFile(fileId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/download`);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    return response.blob();
  }

  // Network endpoints
  async getPeers(): Promise<ApiResponse<Peer[]>> {
    return this.request<Peer[]>('/network/peers');
  }

  async getNetworkStats(): Promise<ApiResponse<NetworkStats>> {
    return this.request<NetworkStats>('/network/stats');
  }

  async connectToPeer(address: string, port: number): Promise<ApiResponse<void>> {
    return this.request<void>('/network/connect', {
      method: 'POST',
      body: JSON.stringify({ address, port }),
    });
  }

  async disconnectFromPeer(peerId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/network/peers/${peerId}/disconnect`, {
      method: 'POST',
    });
  }

  // DHT endpoints
  async storeDHTValue(key: string, value: any): Promise<ApiResponse<void>> {
    return this.request<void>('/dht/store', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  }

  async getDHTValue(key: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/dht/get/${encodeURIComponent(key)}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.request<{ status: string; version: string }>('/health');
  }
}

export const apiService = new ApiService();
