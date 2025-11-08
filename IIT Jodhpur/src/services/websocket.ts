import { io, Socket } from 'socket.io-client';
import type { WebSocketMessage } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(): void {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    
    this.socket = io(wsUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.emit('disconnected', { connected: false, reason });
      
      // Attempt to reconnect
      this.attemptReconnect();
    });

    this.socket.on('message', (message: WebSocketMessage) => {
      this.handleMessage(message);
    });

    this.socket.on('search_result', (data) => {
      this.emit('search_result', data);
    });

    this.socket.on('peer_update', (data) => {
      this.emit('peer_update', data);
    });

    this.socket.on('upload_progress', (data) => {
      this.emit('upload_progress', data);
    });

    this.socket.on('network_stats', (data) => {
      this.emit('network_stats', data);
    });

    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts_reached', {});
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    this.emit(message.type, message.data);
  }

  // Send message to server
  send(type: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(type, data);
    } else {
      console.warn('WebSocket not connected. Message not sent:', { type, data });
    }
  }

  // Subscribe to events
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback?: (data: any) => void): void {
    if (!this.listeners.has(event)) return;

    if (callback) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  // Emit event to listeners
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event callback:', error);
        }
      });
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Get connection info
  getConnectionInfo(): { connected: boolean; id?: string } {
    return {
      connected: this.isConnected(),
      id: this.socket?.id,
    };
  }
}

export const wsService = new WebSocketService();
