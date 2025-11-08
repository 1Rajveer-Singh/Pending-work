from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import json
from typing import List, Dict, Any
from datetime import datetime
import uuid

# Create FastAPI app
app = FastAPI(
    title="FileNest API",
    description="Advanced P2P Search Engine Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data for demonstration
MOCK_FILES = [
    {
        "id": "1",
        "name": "React.js Documentation.pdf",
        "type": "application/pdf",
        "size": 2048576,
        "path": "/documents/react-docs.pdf",
        "lastModified": "2024-01-15T10:30:00Z",
        "tags": ["react", "documentation", "frontend"],
        "peer": {"id": "peer-1", "name": "Alice's Laptop", "ip": "192.168.1.100"},
        "embedding": [0.1, 0.2, 0.3],
        "isAvailable": True
    },
    {
        "id": "2", 
        "name": "Machine Learning Tutorial.mp4",
        "type": "video/mp4",
        "size": 104857600,
        "path": "/videos/ml-tutorial.mp4",
        "lastModified": "2024-01-14T14:20:00Z",
        "tags": ["machine learning", "tutorial", "video"],
        "peer": {"id": "peer-2", "name": "Bob's Desktop", "ip": "192.168.1.101"},
        "embedding": [0.4, 0.5, 0.6],
        "isAvailable": True
    },
    {
        "id": "3",
        "name": "TypeScript Guide.md",
        "type": "text/markdown", 
        "size": 51200,
        "path": "/docs/typescript-guide.md",
        "lastModified": "2024-01-13T09:15:00Z",
        "tags": ["typescript", "guide", "programming"],
        "peer": {"id": "peer-3", "name": "Charlie's Notebook", "ip": "192.168.1.102"},
        "embedding": [0.7, 0.8, 0.9],
        "isAvailable": False
    }
]

MOCK_PEERS = [
    {"id": "peer-1", "name": "Alice's Laptop", "ip": "192.168.1.100", "status": "online", "filesShared": 156},
    {"id": "peer-2", "name": "Bob's Desktop", "ip": "192.168.1.101", "status": "online", "filesShared": 89},
    {"id": "peer-3", "name": "Charlie's Notebook", "ip": "192.168.1.102", "status": "offline", "filesShared": 234}
]

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# API Routes
@app.get("/")
async def root():
    return {"message": "Welcome to FileNest API", "version": "1.0.0"}

@app.get("/api/v1/search")
async def search_files(q: str = "", file_type: str = "", size_min: int = 0, size_max: int = 0):
    """Search for files with optional filters"""
    results = MOCK_FILES.copy()
    
    # Filter by query
    if q:
        results = [f for f in results if q.lower() in f["name"].lower() or 
                  any(q.lower() in tag.lower() for tag in f["tags"])]
    
    # Filter by file type
    if file_type and file_type != "all":
        type_mapping = {
            "documents": ["application/pdf", "text/markdown", "application/msword"],
            "videos": ["video/mp4", "video/avi", "video/mkv"],
            "images": ["image/jpeg", "image/png", "image/gif"],
            "audio": ["audio/mp3", "audio/wav", "audio/flac"]
        }
        if file_type in type_mapping:
            results = [f for f in results if f["type"] in type_mapping[file_type]]
    
    # Filter by size
    if size_min > 0:
        results = [f for f in results if f["size"] >= size_min]
    if size_max > 0:
        results = [f for f in results if f["size"] <= size_max]
    
    return {"results": results, "total": len(results)}

@app.get("/api/v1/suggestions")
async def get_suggestions(q: str = ""):
    """Get search suggestions"""
    if not q:
        return {"suggestions": ["react", "machine learning", "typescript", "python", "javascript"]}
    
    # Simple suggestion logic based on mock data
    suggestions = []
    for file in MOCK_FILES:
        for tag in file["tags"]:
            if q.lower() in tag.lower() and tag not in suggestions:
                suggestions.append(tag)
    
    # Add some common suggestions
    common_suggestions = ["react", "python", "javascript", "machine learning", "typescript"]
    for suggestion in common_suggestions:
        if q.lower() in suggestion.lower() and suggestion not in suggestions:
            suggestions.append(suggestion)
    
    return {"suggestions": suggestions[:5]}

@app.get("/api/v1/network/stats")
async def get_network_stats():
    """Get network statistics"""
    return {
        "totalPeers": len(MOCK_PEERS),
        "onlinePeers": len([p for p in MOCK_PEERS if p["status"] == "online"]),
        "totalFiles": len(MOCK_FILES),
        "availableFiles": len([f for f in MOCK_FILES if f["isAvailable"]]),
        "networkHealth": 85,
        "avgResponseTime": 120
    }

@app.get("/api/v1/peers")
async def get_peers():
    """Get connected peers"""
    return {"peers": MOCK_PEERS}

@app.post("/api/v1/files/upload")
async def upload_file():
    """Upload a file to the network"""
    # Mock upload response
    new_file = {
        "id": str(uuid.uuid4()),
        "name": "uploaded_file.txt",
        "type": "text/plain",
        "size": 1024,
        "status": "uploaded"
    }
    return {"message": "File uploaded successfully", "file": new_file}

@app.get("/api/v1/files/{file_id}/download")
async def download_file(file_id: str):
    """Download a file"""
    file = next((f for f in MOCK_FILES if f["id"] == file_id), None)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {"message": "Download started", "file": file, "downloadUrl": f"/download/{file_id}"}

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back the message (in real app, this would handle commands)
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background task for periodic updates
async def send_periodic_updates():
    while True:
        await asyncio.sleep(30)  # Send update every 30 seconds
        update = {
            "type": "stats_update",
            "data": {
                "timestamp": datetime.now().isoformat(),
                "onlinePeers": len([p for p in MOCK_PEERS if p["status"] == "online"]),
                "totalFiles": len(MOCK_FILES)
            }
        }
        await manager.broadcast(json.dumps(update))

# Start background tasks
@app.on_event("startup")
async def startup_event():
    # Start periodic updates in the background
    asyncio.create_task(send_periodic_updates())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
