"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber, formatPercentage, getRandomDateData, getYTDDateRange } from "@/lib/utils";
import { InteractiveChart } from "@/components/interactive-chart";
import { InteractiveTable } from "@/components/interactive-table";
import { InteractiveFilter } from "@/components/interactive-filter";
import { RealTimeUpdates } from "@/components/real-time-updates";
import { DraggableDashboard } from "@/components/draggable-dashboard";
import { CalendarIcon, DownloadIcon, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Reuse the data from the original dashboard
const dateRange = getYTDDateRange();

// Process the data for our interactive components
const realDownloads = [
  { "date": "1/1/25", "value": 13 },
  { "date": "1/2/25", "value": 13 },
  { "date": "1/3/25", "value": 10 },
  { "date": "1/4/25", "value": 7 },
  { "date": "1/5/25", "value": 14 },
  { "date": "1/6/25", "value": 11 },
  { "date": "1/7/25", "value": 8 },
  { "date": "1/8/25", "value": 20 },
  { "date": "1/9/25", "value": 15 },
  { "date": "1/10/25", "value": 18 },
  { "date": "1/11/25", "value": 11 },
  { "date": "1/12/25", "value": 18 },
  { "date": "1/13/25", "value": 15 },
  { "date": "1/14/25", "value": 17 },
  { "date": "1/15/25", "value": 22 },
  { "date": "1/16/25", "value": 27 },
  { "date": "1/17/25", "value": 39 },
  { "date": "1/18/25", "value": 40 },
  { "date": "1/19/25", "value": 27 },
  { "date": "1/20/25", "value": 68 },
  { "date": "1/21/25", "value": 62 },
  { "date": "1/22/25", "value": 43 },
  { "date": "1/23/25", "value": 26 },
  { "date": "1/24/25", "value": 27 },
  { "date": "1/25/25", "value": 13 },
  { "date": "1/26/25", "value": 24 },
  { "date": "1/27/25", "value": 41 },
  { "date": "1/28/25", "value": 27 },
  { "date": "1/29/25", "value": 22 },
  { "date": "1/30/25", "value": 176 },
  { "date": "1/31/25", "value": 186 },
  { "date": "2/1/25", "value": 86 },
  { "date": "2/2/25", "value": 67 },
  { "date": "2/3/25", "value": 70 },
  { "date": "2/4/25", "value": 68 },
  { "date": "2/5/25", "value": 53 },
  { "date": "2/6/25", "value": 48 },
  { "date": "2/7/25", "value": 38 },
  { "date": "2/8/25", "value": 41 },
  { "date": "2/9/25", "value": 43 },
  { "date": "2/10/25", "value": 51 },
  { "date": "2/11/25", "value": 35 },
  { "date": "2/12/25", "value": 29 },
  { "date": "2/13/25", "value": 40 },
  { "date": "2/14/25", "value": 33 },
  { "date": "2/15/25", "value": 40 },
  { "date": "2/16/25", "value": 26 },
  { "date": "2/17/25", "value": 27 },
  { "date": "2/18/25", "value": 26 },
  { "date": "2/19/25", "value": 19 },
  { "date": "2/20/25", "value": 22 },
  { "date": "2/21/25", "value": 29 },
  { "date": "2/22/25", "value": 29 },
  { "date": "2/23/25", "value": 20 },
  { "date": "2/24/25", "value": 26 },
  { "date": "2/25/25", "value": 14 },
  { "date": "2/26/25", "value": 22 },
  { "date": "2/27/25", "value": 14 },
  { "date": "2/28/25", "value": 18 },
  { "date": "3/1/25", "value": 17 },
  { "date": "3/2/25", "value": 31 },
  { "date": "3/3/25", "value": 33 },
  { "date": "3/4/25", "value": 25 },
  { "date": "3/5/25", "value": 28 }
];

// Format the data for our interactive chart
const chartData = realDownloads.map(item => {
  const [month, day, year] = item.date.split('/');
  return {
    date: `${month}/${day}`,
    downloads: item.value,
  };
});

// Calculate 7-day moving average
const calculate7DayAverage = (data) => {
  return data.map((item, index, array) => {
    if (index < 3) return { ...item, average: null }; // Not enough prior data
    
    // Calculate average of current day and 6 days before
    const sumPrev7Days = array
      .slice(Math.max(0, index - 6), index + 1)
      .reduce((sum, curr) => sum + curr.downloads, 0);
    
    const avg = sumPrev7Days / Math.min(7, index + 1);
    
    return {
      ...item,
      average: parseFloat(avg.toFixed(1))
    };
  });
};

const processedChartData = calculate7DayAverage(chartData);

// Calculate total YTD downloads
const totalYtdDownloads = realDownloads.reduce((sum, item) => sum + item.value, 0);

// Keyword data
const keywordData = [
  { keyword: "super one", rank: 2, volume: 29, change: "+1" },
  { keyword: "super fan", rank: 10, volume: 20, change: "-2" },
  { keyword: "super 1", rank: 4, volume: 16, change: "0" },
  { keyword: "ultamate fan", rank: 13, volume: 9, change: "+3" },
  { keyword: "fan battle", rank: 18, volume: 7, change: "+5" },
  { keyword: "super battle", rank: 22, volume: 5, change: "-1" },
  { keyword: "fan game", rank: 25, volume: 4, change: "+2" },
];

// Competitor data
const competitorData = [
  { name: "Sports Trivia Star", id: "6444810592", rating: 4.9, downloads: 12500 },
  { name: "MADFUT 24", id: "6446899306", rating: 4.8, downloads: 9800 },
  { name: "Basketball Highlights 2045", id: "1003138996", rating: 4.7, downloads: 7200 },
  { name: "Astonishing Basketball Manager", id: "1589313811", rating: 4.7, downloads: 6500 },
  { name: "Super.One Fan Battle", id: "1455333818", rating: 4.6, downloads: 2000 },
];

// Filter options
const timeRangeOptions = [
  { value: "ytd", label: "Year to Date" },
  { value: "1m", label: "Last Month" },
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
];

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "global", label: "Global" },
];

export function EnhancedDashboardTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("ytd");
  const [country, setCountry] = useState("us");
  const [date, setDate] = useState(null);
  const [isDraggableMode, setIsDraggableMode] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [timeRange, country]);

  // Handle chart point click
  const handleChartPointClick = (point) => {
    setSelectedDataPoint(point);
  };

  // Handle table row click
  const handleKeywordRowClick = (row) => {
    console.log("Keyword selected:", row);
    // In a real app, this would show detailed keyword analytics
  };

  // Dashboard items for draggable mode
  const dashboardItems = [
    {
      id: "downloads-chart",
      title: "Downloads Trend",
      content: (
        <InteractiveChart
          title="Downloads Trend"
          data={processedChartData}
          series={[
            { key: "downloads", name: "Daily Downloads", color: "#0088FE" },
            { key: "average", name: "7-Day Average", color: "#FF8042" }
          ]}
          height={250}
          onPointClick={handleChartPointClick}
        />
      ),
      position: { x: 20, y: 20 }
    },
    {
      id: "keywords-table",
      title: "Keyword Rankings",
      content: (
        <InteractiveTable
          title="Keyword Rankings"
          data={keywordData}
          columns={[
            { key: "keyword", header: "Keyword", sortable: true },
            { key: "rank", header: "Rank", sortable: true },
            { key: "volume", header: "Volume", sortable: true },
            { 
              key: "change", 
              header: "Change", 
              sortable: true,
              render: (value) => (
                <span className={
                  value.startsWith("+") ? "text-green-500" : 
                  value.startsWith("-") ? "text-red-500" : 
                  "text-gray-500"
                }>
                  {value}
                </span>
              )
            }
          ]}
          initialSortColumn="volume"
          initialSortDirection="desc"
          onRowClick={handleKeywordRowClick}
          pageSize={5}
        />
      ),
      position: { x: 20, y: 350 }
    },
    {
      id: "real-time-updates",
      title: "Real-Time Updates",
      content: (
        <RealTimeUpdates
          title="ASO Alerts"
          maxUpdates={5}
          pollingInterval={10000} // 10 seconds for demo purposes
        />
      ),
      position: { x: 450, y: 20 }
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-col sm:flex-row gap-4">
          <InteractiveFilter
            title="Time Range"
            options={timeRangeOptions}
            defaultValue={timeRange}
            onValueChange={setTimeRange}
          />
          
          <InteractiveFilter
            title="Country"
            options={countryOptions}
            defaultValue={country}
            onValueChange={setCountry}
          />
          
          {timeRange === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsDraggableMode(!isDraggableMode)}
          >
            {isDraggableMode ? "Standard View" : "Customizable View"}
          </Button>
          
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Selected Data Point Details */}
      {selectedDataPoint && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">Details for {selectedDataPoint.date}</h3>
                <p className="text-sm text-muted-foreground">
                  Downloads: {selectedDataPoint.downloads}
                  {selectedDataPoint.average && ` | 7-Day Average: ${selectedDataPoint.average}`}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDataPoint(null)}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Content */}
      {isDraggableMode ? (
        <DraggableDashboard 
          items={dashboardItems}
          onLayoutChange={(items) => console.log("Layout changed:", items)}
        />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.6 ★</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on 23 ratings
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">YTD Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalYtdDownloads)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  -91.3% from last year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Category Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Unranked</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Not currently ranked in categories
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(9.64)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +0.5% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              title="Downloads Trend"
              data={processedChartData}
              series={[
                { key: "downloads", name: "Daily Downloads", color: "#0088FE" },
                { key: "average", name: "7-Day Average", color: "#FF8042" }
              ]}
              height={300}
              onPointClick={handleChartPointClick}
            />
            
            <InteractiveTable
              title="Keyword Rankings"
              data={keywordData}
              columns={[
                { key: "keyword", header: "Keyword", sortable: true },
                { key: "rank", header: "Rank", sortable: true },
                { key: "volume", header: "Volume", sortable: true },
                { 
                  key: "change", 
                  header: "Change", 
                  sortable: true,
                  render: (value) => (
                    <span className={
                      value.startsWith("+") ? "text-green-500" : 
                      value.startsWith("-") ? "text-red-500" : 
                      "text-gray-500"
                    }>
                      {value}
                    </span>
                  )
                }
              ]}
              initialSortColumn="volume"
              initialSortDirection="desc"
              onRowClick={handleKeywordRowClick}
            />
          </div>

          {/* More Interactive Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveTable
              title="Competitor Analysis"
              data={competitorData}
              columns={[
                { key: "name", header: "App Name", sortable: true },
                { key: "rating", header: "Rating", sortable: true },
                { 
                  key: "downloads", 
                  header: "Est. Downloads", 
                  sortable: true,
                  render: (value) => formatNumber(value)
                }
              ]}
              initialSortColumn="downloads"
              initialSortDirection="desc"
            />
            
            <RealTimeUpdates
              title="ASO Alerts"
              maxUpdates={5}
              pollingInterval={10000} // 10 seconds for demo purposes
            />
          </div>
        </>
      )}
    </div>
  );
}
