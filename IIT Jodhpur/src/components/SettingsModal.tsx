import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Moon, Sun, Bell, Palette, Globe, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useAppStore } from '../store/app';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState('general');

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    addNotification({
      type: 'info',
      title: 'Theme Changed',
      message: `Switched to ${newTheme} theme`,
      read: false,
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'network', label: 'Network', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex h-[60vh]">
            {/* Sidebar */}
            <div className="w-64 bg-slate-50 dark:bg-slate-800 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">General Settings</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Language
                            </label>
                            <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                              <option>English (US)</option>
                              <option>Spanish</option>
                              <option>French</option>
                              <option>German</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Default Search Results
                            </label>
                            <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                              <option>20 results</option>
                              <option>50 results</option>
                              <option>100 results</option>
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Appearance</h3>
                    <Card>
                      <CardHeader>
                        <CardTitle>Theme Preference</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => handleThemeChange('light')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === 'light'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                            <div className="text-sm font-medium text-slate-900 dark:text-white">Light</div>
                          </button>
                          <button
                            onClick={() => handleThemeChange('dark')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <Moon className="w-6 h-6 mx-auto mb-2 text-slate-700 dark:text-slate-300" />
                            <div className="text-sm font-medium text-slate-900 dark:text-white">Dark</div>
                          </button>
                          <button
                            onClick={() => handleThemeChange('system')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === 'system'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <Monitor className="w-6 h-6 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                            <div className="text-sm font-medium text-slate-900 dark:text-white">System</div>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Notification Settings</h3>
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Search Notifications</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Get notified when searches complete</div>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Upload Notifications</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Get notified about file uploads</div>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Network Notifications</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Get notified about network status</div>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'network' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Network Settings</h3>
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Max Concurrent Downloads
                          </label>
                          <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                            <option>3</option>
                            <option>5</option>
                            <option>10</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Connection Timeout (seconds)
                          </label>
                          <input 
                            type="number" 
                            defaultValue={30}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Privacy Settings</h3>
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Anonymous Mode</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Hide your peer ID from other users</div>
                          </div>
                          <input type="checkbox" className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Share Usage Analytics</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Help improve FileNest by sharing anonymous usage data</div>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onClose}>
              Save Changes
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
