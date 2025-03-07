"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle } from "lucide-react";

interface Update {
  id: string;
  message: string;
  timestamp: Date;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
}

interface RealTimeUpdatesProps {
  title?: string;
  maxUpdates?: number;
  dataSource?: () => Promise<Update[]>;
  pollingInterval?: number;
  onUpdateClick?: (update: Update) => void;
}

export function RealTimeUpdates({
  title = "Real-Time Updates",
  maxUpdates = 5,
  dataSource,
  pollingInterval = 30000, // 30 seconds
  onUpdateClick,
}: RealTimeUpdatesProps) {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const lastUpdateIdRef = useRef<string | null>(null);

  // Mock data source if none provided
  const fetchUpdates = async (): Promise<Update[]> => {
    if (dataSource) {
      return dataSource();
    }

    // Mock data for demonstration
    const types: ("info" | "success" | "warning" | "error")[] = [
      "info",
      "success",
      "warning",
      "error",
    ];
    
    const mockMessages = [
      "Keyword 'fan battle' ranking improved to position #5",
      "App Store rating increased to 4.8",
      "New competitor detected in the market",
      "Download rate increased by 15% this week",
      "User retention improved to 45%",
      "New review trend detected: UI feedback",
    ];

    return [
      {
        id: Date.now().toString(),
        message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
        timestamp: new Date(),
        type: types[Math.floor(Math.random() * types.length)],
        read: false,
      },
    ];
  };

  const loadUpdates = async () => {
    try {
      const newUpdates = await fetchUpdates();
      
      if (newUpdates.length > 0) {
        // Check if we have new updates
        const hasNew = !lastUpdateIdRef.current || 
          newUpdates.some(update => update.id !== lastUpdateIdRef.current);
        
        if (hasNew) {
          setHasNewUpdates(true);
          lastUpdateIdRef.current = newUpdates[0].id;
        }
        
        setUpdates(prev => {
          const combined = [...newUpdates, ...prev];
          // Remove duplicates based on id
          const unique = combined.filter((update, index, self) => 
            index === self.findIndex(u => u.id === update.id)
          );
          // Limit to maxUpdates
          return unique.slice(0, maxUpdates);
        });
      }
    } catch (error) {
      console.error("Failed to fetch updates:", error);
    }
  };

  useEffect(() => {
    // Initial load
    loadUpdates();

    // Set up polling
    const intervalId = setInterval(loadUpdates, pollingInterval);

    return () => clearInterval(intervalId);
  }, [pollingInterval]);

  const markAllAsRead = () => {
    setUpdates(prev => prev.map(update => ({ ...update, read: true })));
    setHasNewUpdates(false);
  };

  const handleUpdateClick = (update: Update) => {
    // Mark this update as read
    setUpdates(prev => 
      prev.map(u => u.id === update.id ? { ...u, read: true } : u)
    );
    
    // If all are read, clear the new updates indicator
    if (updates.every(u => u.id === update.id || u.read)) {
      setHasNewUpdates(false);
    }
    
    // Call the provided handler
    onUpdateClick?.(update);
  };

  const getIconForType = (type: Update["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
            {hasNewUpdates && (
              <Badge variant="destructive" className="h-5 rounded-full">
                New
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all as read
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {expanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`space-y-2 ${expanded ? "" : "max-h-[300px] overflow-y-auto"}`}>
          {updates.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No updates available
            </div>
          ) : (
            updates.map((update) => (
              <div
                key={update.id}
                className={`p-3 rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                  update.read
                    ? "bg-muted/30"
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => handleUpdateClick(update)}
              >
                <div className="mt-0.5">{getIconForType(update.type)}</div>
                <div className="flex-1">
                  <p className={`text-sm ${!update.read ? "font-medium" : ""}`}>
                    {update.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {update.timestamp.toLocaleTimeString()} - {update.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
