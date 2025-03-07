"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DraggableItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onPositionChange: (id: string, x: number, y: number) => void;
  initialPosition?: { x: number; y: number };
}

function DraggableItem({
  id,
  title,
  children,
  onPositionChange,
  initialPosition = { x: 0, y: 0 },
}: DraggableItemProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      setPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onPositionChange(id, position.x, position.y);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position]);

  return (
    <div
      className={`absolute ${isDragging ? "z-50" : "z-10"}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.2s ease",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <Card className="w-full shadow-lg">
        <CardHeader
          className="p-3 cursor-grab bg-muted/50"
          onMouseDown={handleMouseDown}
        >
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

interface DashboardItem {
  id: string;
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number };
}

interface DraggableDashboardProps {
  items: DashboardItem[];
  onLayoutChange?: (items: DashboardItem[]) => void;
}

export function DraggableDashboard({
  items,
  onLayoutChange,
}: DraggableDashboardProps) {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>(items);

  const handlePositionChange = (id: string, x: number, y: number) => {
    const updatedItems = dashboardItems.map((item) =>
      item.id === id ? { ...item, position: { x, y } } : item
    );
    setDashboardItems(updatedItems);
    onLayoutChange?.(updatedItems);
  };

  return (
    <div className="relative w-full h-[800px] bg-muted/20 rounded-lg p-4 overflow-hidden">
      <div className="absolute top-2 right-2 z-50">
        <button
          className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm"
          onClick={() => {
            // Reset positions
            const resetItems = dashboardItems.map((item, index) => ({
              ...item,
              position: { x: 20, y: 20 + index * 350 },
            }));
            setDashboardItems(resetItems);
            onLayoutChange?.(resetItems);
          }}
        >
          Reset Layout
        </button>
      </div>
      {dashboardItems.map((item) => (
        <DraggableItem
          key={item.id}
          id={item.id}
          title={item.title}
          initialPosition={item.position}
          onPositionChange={handlePositionChange}
        >
          {item.content}
        </DraggableItem>
      ))}
    </div>
  );
}
