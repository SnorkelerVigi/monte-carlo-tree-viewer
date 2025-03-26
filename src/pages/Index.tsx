
import React, { useState, useEffect } from 'react';
import MonteCarloTree from '@/components/MonteCarloTree';
import { toast } from "sonner";

const Index = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch the tree data from the JSON file
        const response = await fetch('/tree_data.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Wait a moment to simulate loading (optional - can be removed)
        setTimeout(() => {
          setTreeData(data);
          setLoading(false);
          toast.success("Tree data loaded successfully");
        }, 800);
      } catch (error) {
        console.error("Error loading tree data:", error);
        toast.error(`Failed to load tree data: ${error.message}`);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b py-6 px-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-light text-slate-800 tracking-tight">Monte Carlo Tree Viewer</h1>
          <p className="text-slate-500 mt-2">Visualize and explore the Monte Carlo search tree structure</p>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-slate-600">Loading tree data...</p>
          </div>
        ) : treeData ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-scale-in">
            <MonteCarloTree data={treeData} />
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border">
            <p className="text-slate-600">No tree data available</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
