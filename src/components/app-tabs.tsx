"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "@/components/tabs/dashboard-tab";
import { EnhancedDashboardTab } from "@/components/tabs/enhanced-dashboard-tab";
import { 
  KeywordPerformanceTab, 
  CompetitiveAnalysisTab, 
  AppReviewsTab, 
  RankingsTab, 
  DownloadsTab 
} from "@/components/tabs/placeholder-tabs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function AppTabs() {
  const [useEnhancedDashboard, setUseEnhancedDashboard] = useState(false);

  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="keyword-performance">Keyword Performance</TabsTrigger>
          <TabsTrigger value="competitive-analysis">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="app-reviews">App Reviews</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setUseEnhancedDashboard(!useEnhancedDashboard)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {useEnhancedDashboard ? "Standard Dashboard" : "Interactive Dashboard"}
        </Button>
      </div>
      
      <TabsContent value="dashboard">
        {useEnhancedDashboard ? <EnhancedDashboardTab /> : <DashboardTab />}
      </TabsContent>
      <TabsContent value="keyword-performance">
        <KeywordPerformanceTab />
      </TabsContent>
      <TabsContent value="competitive-analysis">
        <CompetitiveAnalysisTab />
      </TabsContent>
      <TabsContent value="app-reviews">
        <AppReviewsTab />
      </TabsContent>
      <TabsContent value="rankings">
        <RankingsTab />
      </TabsContent>
      <TabsContent value="downloads">
        <DownloadsTab />
      </TabsContent>
    </Tabs>
  );
}
