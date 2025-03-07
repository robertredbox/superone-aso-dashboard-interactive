"use client";

import React, { useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface InteractiveChartProps {
  title: string;
  data: DataPoint[];
  series: SeriesConfig[];
  height?: number;
  onPointClick?: (point: DataPoint) => void;
}

export function InteractiveChart({
  title,
  data,
  series,
  height = 300,
  onPointClick,
}: InteractiveChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [highlightedSeries, setHighlightedSeries] = useState<string | null>(null);

  const handleMouseEnter = useCallback((event: React.MouseEvent, index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  interface LegendEntry {
    dataKey: string;
    value: string;
    color: string;
  }

  const handleLegendMouseEnter = useCallback((entry: LegendEntry) => {
    setHighlightedSeries(entry.dataKey);
  }, []);

  const handleLegendMouseLeave = useCallback(() => {
    setHighlightedSeries(null);
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent, payload: unknown, index: number) => {
      if (onPointClick && data[index]) {
        onPointClick(data[index]);
      }
    },
    [data, onPointClick]
  );

  const getOpacity = (dataKey: string) => {
    if (!highlightedSeries) return 1;
    return highlightedSeries === dataKey ? 1 : 0.3;
  };

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number | string;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          <div className="mt-2">
            {payload.map((entry, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onMouseMove={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                onMouseEnter={handleLegendMouseEnter}
                onMouseLeave={handleLegendMouseLeave}
                wrapperStyle={{ paddingTop: "10px" }}
              />
              {series.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  fill={s.color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    strokeWidth: 1,
                    stroke: "#fff",
                  }}
                  opacity={getOpacity(s.key)}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
