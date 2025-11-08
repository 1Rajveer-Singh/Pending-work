import { create } from 'zustand';
import type { SearchResult, SearchFilters, UploadProgress, Notification } from '../types';

interface AppState {
  // Search state
  searchQuery: string;
  searchResults: SearchResult[];
  searchFilters: SearchFilters;
  isSearching: boolean;
  searchHistory: string[];
  
  // Upload state
  uploads: UploadProgress[];
  
  // Notifications
  notifications: Notification[];
  
  // UI state
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  selectedFiles: string[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  setIsSearching: (isSearching: boolean) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  addUpload: (upload: UploadProgress) => void;
  updateUpload: (fileId: string, update: Partial<UploadProgress>) => void;
  removeUpload: (fileId: string) => void;
  clearUploads: () => void;
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSelectedFiles: (files: string[]) => void;
  toggleFileSelection: (fileId: string) => void;
  clearSelection: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  searchQuery: '',
  searchResults: [],
  searchFilters: {
    contentTypes: ['all'],
    tags: [],
  },
  isSearching: false,
  searchHistory: [],
  
  uploads: [],
  notifications: [],
  
  theme: 'system',
  sidebarOpen: true,
  selectedFiles: [],
  
  // Search actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSearchResults: (results) => set({ searchResults: results }),
  
  setSearchFilters: (filters) => set({ searchFilters: filters }),
  
  setIsSearching: (isSearching) => set({ isSearching }),
  
  addToSearchHistory: (query) => {
    const { searchHistory } = get();
    const trimmedQuery = query.trim();
    if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
      const newHistory = [trimmedQuery, ...searchHistory.slice(0, 9)]; // Keep last 10
      set({ searchHistory: newHistory });
    }
  },
  
  clearSearchHistory: () => set({ searchHistory: [] }),
  
  // Upload actions
  addUpload: (upload) => {
    const { uploads } = get();
    set({ uploads: [...uploads, upload] });
  },
  
  updateUpload: (fileId, update) => {
    const { uploads } = get();
    const updatedUploads = uploads.map(upload =>
      upload.fileId === fileId ? { ...upload, ...update } : upload
    );
    set({ uploads: updatedUploads });
  },
  
  removeUpload: (fileId) => {
    const { uploads } = get();
    set({ uploads: uploads.filter(upload => upload.fileId !== fileId) });
  },
  
  clearUploads: () => set({ uploads: [] }),
  
  // Notification actions
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    const { notifications } = get();
    set({ notifications: [newNotification, ...notifications] });
    
    // Auto-remove after 5 seconds for non-error notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, 5000);
    }
  },
  
  removeNotification: (id) => {
    const { notifications } = get();
    set({ notifications: notifications.filter(n => n.id !== id) });
  },
  
  markNotificationAsRead: (id) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications: updatedNotifications });
  },
  
  clearNotifications: () => set({ notifications: [] }),
  
  // UI actions
  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleSidebar: () => {
    const { sidebarOpen } = get();
    set({ sidebarOpen: !sidebarOpen });
  },
  
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  
  toggleFileSelection: (fileId) => {
    const { selectedFiles } = get();
    if (selectedFiles.includes(fileId)) {
      set({ selectedFiles: selectedFiles.filter(id => id !== fileId) });
    } else {
      set({ selectedFiles: [...selectedFiles, fileId] });
    }
  },
  
  clearSelection: () => set({ selectedFiles: [] }),
}));
