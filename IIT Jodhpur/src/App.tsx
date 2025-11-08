import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Upload, Settings, Bell, Moon, Sun, Monitor } from 'lucide-react';
import SearchBar from './components/SearchBar';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { NotificationContainer } from './components/ui/Notification';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { useAppStore } from './store/app';
import type { SearchFilters } from './types';

function App() {
  const {
    theme,
    notifications,
    searchResults,
    isSearching,
    setTheme,
    removeNotification,
    setSearchResults,
    setIsSearching,
  } = useAppStore();

  // Modal states
  const [showSettings, setShowSettings] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Fetch network stats
  const [networkStats, setNetworkStats] = React.useState({
    totalPeers: 0,
    onlinePeers: 0,
    totalFiles: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/network/stats');
        const data = await response.json();
        setNetworkStats({
          totalPeers: data.totalPeers || 0,
          onlinePeers: data.onlinePeers || 0,
          totalFiles: data.totalFiles || 0,
          avgResponseTime: data.avgResponseTime || 0
        });
      } catch (error) {
        console.error('Failed to fetch network stats:', error);
      }
    };

    fetchNetworkStats();
    // Fetch stats every 30 seconds
    const interval = setInterval(fetchNetworkStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real search function connected to backend
  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.contentTypes?.length > 0) params.append('file_type', filters.contentTypes[0]);
      if (filters.sizeRange?.min) params.append('size_min', filters.sizeRange.min.toString());
      if (filters.sizeRange?.max) params.append('size_max', filters.sizeRange.max.toString());

      const response = await fetch(`http://localhost:8000/api/v1/search?${params}`);
      const data = await response.json();
      
      // Transform backend data to match frontend interface
      const transformedResults = data.results.map((file: any) => ({
        id: file.id,
        name: file.name,
        path: file.path,
        contentType: file.type,
        size: file.size,
        peerId: file.peer.id,
        createdAt: file.lastModified,
        updatedAt: file.lastModified,
        similarity: 0.95, // Mock similarity for now
        snippet: `File: ${file.name} - ${file.tags.join(', ')}`,
        matchedFields: ['name'],
        relevanceScore: 0.95,
      }));
      
      setSearchResults(transformedResults);
      
      // Show success notification
      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Search Complete',
        message: `Found ${transformedResults.length} results`,
        read: false,
      });
      
    } catch (error) {
      console.error('Search error:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Search Failed',
        message: 'Could not connect to backend server',
        read: false,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    
    // Show notification
    useAppStore.getState().addNotification({
      type: 'info',
      title: 'Theme Changed',
      message: `Switched to ${nextTheme} theme`,
      read: false,
    });
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string): string => {
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
    if (contentType.includes('powerpoint') || contentType.includes('presentation')) return '📽️';
    if (contentType.includes('image')) return '🖼️';
    if (contentType.includes('video')) return '🎥';
    if (contentType.includes('audio')) return '🎵';
    return '📁';
  };

  // Handle file download
  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      useAppStore.getState().addNotification({
        type: 'info',
        title: 'Download Started',
        message: `Downloading ${fileName}...`,
        read: false,
      });

      const response = await fetch(`http://localhost:8000/api/v1/files/${fileId}/download`);
      const data = await response.json();

      if (response.ok) {
        useAppStore.getState().addNotification({
          type: 'success',
          title: 'Download Complete',
          message: `${fileName} download initiated`,
          read: false,
        });
        // In a real app, you would handle the actual file download here
        console.log('Download URL:', data.downloadUrl);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Download Failed',
        message: `Failed to download ${fileName}`,
        read: false,
      });
    }
  };

  // Handle file preview
  const handlePreview = (result: any) => {
    useAppStore.getState().addNotification({
      type: 'info',
      title: 'Preview',
      message: `Opening preview for ${result.name}`,
      read: false,
    });
    // In a real app, you would open a preview modal here
  };

  // Handle file upload
  const handleFileUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      for (const file of Array.from(files)) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          useAppStore.getState().addNotification({
            type: 'info',
            title: 'Upload Started',
            message: `Uploading ${file.name}...`,
            read: false,
          });

          const response = await fetch('http://localhost:8000/api/v1/files/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            useAppStore.getState().addNotification({
              type: 'success',
              title: 'Upload Complete',
              message: `${file.name} uploaded successfully`,
              read: false,
            });
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          useAppStore.getState().addNotification({
            type: 'error',
            title: 'Upload Failed',
            message: `Failed to upload ${file.name}`,
            read: false,
          });
        }
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    FileNest
                  </h1>
                  <p className="text-xs text-slate-500">Decentralized Search Engine</p>
                </div>
              </motion.div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={handleFileUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {getThemeIcon()}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Find Anything,{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Anywhere
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Intelligent search across decentralized networks. Discover files, documents, and data with AI-powered semantic understanding.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          </motion.div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Search Results ({searchResults.length})
              </h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span>Found in 0.127 seconds</span>
              </div>
            </div>

            <div className="grid gap-4">
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card hover className="transition-all duration-200 hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{getFileIcon(result.contentType)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                              {result.name}
                            </h4>
                            <div className="flex items-center space-x-3 text-sm text-slate-500">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {Math.round(result.similarity * 100)}% match
                              </span>
                              <span>{formatFileSize(result.size)}</span>
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mb-3">
                            {result.snippet}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4 text-slate-500">
                              <span>{result.path}</span>
                              <span>•</span>
                              <span>Peer: {result.peerId.slice(0, 8)}...</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePreview(result)}
                              >
                                Preview
                              </Button>
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleDownload(result.id, result.name)}
                              >
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        {searchResults.length === 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <Card hover>
              <CardHeader className="text-center">
                <CardTitle className="text-blue-600">🌐 Network</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {networkStats.onlinePeers}/{networkStats.totalPeers}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Connected Peers</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader className="text-center">
                <CardTitle className="text-purple-600">📁 Files</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {networkStats.totalFiles.toLocaleString()}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Indexed Files</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader className="text-center">
                <CardTitle className="text-green-600">⚡ Speed</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {networkStats.avgResponseTime}ms
                </div>
                <p className="text-slate-600 dark:text-slate-400">Average Response</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg text-slate-600 dark:text-slate-400">
                Searching across the network...
              </span>
            </div>
          </motion.div>
        )}
      </main>

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}

export default App;
