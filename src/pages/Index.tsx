
import React, { useState, useEffect } from 'react';
import MonteCarloTree from '@/components/MonteCarloTree';
import { toast } from "sonner";

const Index = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        setLoading(true);
        // Sample data structure based on the provided JSON structure
        const sampleData = {
          "full_trajectory": [
            {
              "role": "system",
              "content": "# Retail agent policy\n\nAs a retail agent, you can help users cancel or modify pending orders, return or exchange delivered orders, modify their default user address, or provide information about their own profile, orders, and related products.\n\n- At the beginning of the conversation, you have to authenticate the user identity by locating their user id via email, or via name + zip code. This has to be done even when the user already provides the user id.\n\n- Once the user has been authenticated, you can provide the user with information about order, product, profile information, e.g. help the user look up order id.\n\n- You can only help one user per conversation (but you can handle multiple requests from the same user), and must deny any requests for tasks related to any other user.\n\n- Before taking consequential actions that update the database (cancel, modify, return, exchange), you have to list the action detail and obtain explicit user confirmation (yes) to proceed.\n\n- You should not make up any information or knowledge or procedures not provided from the user or the tools, or give subjective recommendations or comments.\n\n- You should at most make one tool call at a time, and if you take a tool call, you should not respond to the user at the same time. If you respond to the user, you should not make a tool call.\n\n- You should transfer the user to a human agent if and only if the request cannot be handled within the scope of your actions.",
              "mc_value": 0.9,
              "visit_count": 5,
              "total_rollouts": 10,
              "count_correct_rollouts": 9,
              "incorrect_rollouts": 1,
              "children": []
            },
            {
              "role": "user",
              "content": "Hey, can you tell me how many t-shirt options are available in the store right now?",
              "mc_value": 0.75,
              "visit_count": 3,
              "total_rollouts": 8,
              "count_correct_rollouts": 6,
              "incorrect_rollouts": 2,
              "children": [
                {
                  "role": "assistant",
                  "content": "I'll need to look that up for you. Let me check our inventory system.",
                  "mc_value": 0.82,
                  "visit_count": 2,
                  "total_rollouts": 6,
                  "count_correct_rollouts": 5,
                  "incorrect_rollouts": 1,
                  "children": [
                    {
                      "text": "Thought: I need to check the available t-shirt options in the store. I can use the list_all_product_types tool first to see if t-shirts are in the product catalog, and then get more details if needed.",
                      "mc_value": 0.95,
                      "visit_count": 1,
                      "total_rollouts": 4,
                      "count_correct_rollouts": 4,
                      "incorrect_rollouts": 0,
                      "children": []
                    }
                  ]
                }
              ]
            }
          ],
          "text": "",
          "mc_value": 0.75,
          "visit_count": 1,
          "total_rollouts": 4,
          "count_correct_rollouts": 3,
          "incorrect_rollouts": 1,
          "children": [
            {
              "text": "Thought: The user is asking about t-shirt options in the store. I need to check that information.",
              "mc_value": 0.88,
              "visit_count": 3,
              "total_rollouts": 8,
              "count_correct_rollouts": 7,
              "incorrect_rollouts": 1,
              "children": [
                {
                  "text": "Action: {\"name\": \"list_all_product_types\", \"arguments\": {}}",
                  "mc_value": 0.92,
                  "visit_count": 2,
                  "total_rollouts": 6,
                  "count_correct_rollouts": 6,
                  "incorrect_rollouts": 0,
                  "children": []
                }
              ]
            }
          ]
        };
        
        // Wait a moment to simulate loading
        setTimeout(() => {
          setTreeData(sampleData);
          setLoading(false);
          toast.success("Tree data loaded successfully");
        }, 800);
      } catch (error) {
        console.error("Error loading tree data:", error);
        toast.error("Failed to load tree data");
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
