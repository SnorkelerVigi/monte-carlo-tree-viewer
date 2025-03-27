
import React, { useState } from 'react';
import TreeNode from './TreeNode';
import { ChevronDown, ChevronUp, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type NodeData = {
  role?: string;
  content?: string;
  text?: string;
  mc_value: number;
  visit_count: number;
  total_rollouts: number;
  count_correct_rollouts: number;
  incorrect_rollouts: number;
  children: NodeData[];
};

interface MonteCarloTreeProps {
  data: NodeData;
  className?: string;
}

const MonteCarloTree: React.FC<MonteCarloTreeProps> = ({ data, className }) => {
  const [scale, setScale] = useState(1);
  const [expanded, setExpanded] = useState(true);

  // Zoom in/out functionality
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 1.5));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  // Toggle the entire tree
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={cn("tree-container", className)}>
      {/* Control panel */}
      <div className="flex items-center justify-between p-4 bg-white border-b mb-6 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <h2 className="text-xl font-medium text-slate-800">Monte Carlo Tree Viewer</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={toggleExpanded}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label={expanded ? "Collapse tree" : "Expand tree"}
          >
            {expanded ? 
              <ChevronUp className="h-4 w-4 text-slate-700" /> : 
              <ChevronDown className="h-4 w-4 text-slate-700" />
            }
          </button>
          
          <button
            onClick={zoomOut}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Zoom out"
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4 text-slate-700" />
          </button>
          
          <button
            onClick={resetZoom}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Reset zoom"
          >
            <RotateCcw className="h-4 w-4 text-slate-700" />
          </button>
          
          <button
            onClick={zoomIn}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Zoom in"
            disabled={scale >= 1.5}
          >
            <ZoomIn className="h-4 w-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Tree container with scaling */}
      {expanded && (
        <div 
          className="tree-content p-6 transition-transform duration-300 animate-fade-in" 
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            width: 'fit-content',
            margin: '0 auto'
          }}
        >
          <TreeNode node={data} depth={0} />
        </div>
      )}
    </div>
  );
};

export default MonteCarloTree;
