export interface FileMetadata {
  id: string;
  name: string;
  path: string;
  contentType: string;
  size: number;
  peerId: string;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  description?: string;
  thumbnail?: string;
  preview?: string;
}

export interface SearchResult extends FileMetadata {
  similarity: number;
  snippet?: string;
  matchedFields: string[];
  relevanceScore: number;
}

export interface SearchFilters {
  contentTypes: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  peerId?: string;
  similarityThreshold?: number;
}

export interface Peer {
  id: string;
  address: string;
  port: number;
  status: 'connected' | 'disconnected' | 'connecting';
  lastSeen: string;
  fileCount: number;
  reputation: number;
  latency?: number;
  bandwidth?: number;
}

export interface NetworkStats {
  totalPeers: number;
  activePeers: number;
  totalFiles: number;
  networkLatency: number;
  throughput: number;
  reliability: number;
  uptime: number;
}

export interface TaggingVector {
  id: string;
  depth: number;
  vector: number[];
  peerId: string;
  fileCount: number;
  centroid: number[];
  lastUpdated: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'indexing' | 'complete' | 'error';
  error?: string;
  estimatedTimeRemaining?: number;
}

export interface SearchQuery {
  query: string;
  type: 'text' | 'semantic' | 'hybrid';
  filters: SearchFilters;
  limit: number;
  offset: number;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  searchDefaults: SearchFilters;
  notifications: {
    uploads: boolean;
    searches: boolean;
    network: boolean;
  };
  privacy: {
    shareStats: boolean;
    allowIndexing: boolean;
    encryptSensitive: boolean;
  };
}

export interface UserStats {
  filesUploaded: number;
  searchesPerformed: number;
  dataMined: number;
  peersConnected: number;
  uptime: number;
  reputation: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  metadata?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface WebSocketMessage {
  type: 'search_result' | 'peer_update' | 'upload_progress' | 'network_stats' | 'notification';
  data: any;
  timestamp: string;
  id: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}
