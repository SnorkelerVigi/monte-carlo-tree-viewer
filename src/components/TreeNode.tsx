
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, ExpandIcon, MinimizeIcon } from 'lucide-react';
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

interface TreeNodeProps {
  node: NodeData;
  depth: number;
  index?: number;
  isLastChild?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  depth, 
  index = 0, 
  isLastChild = false 
}) => {
  // Change default expanded state to true for all nodes
  const [expanded, setExpanded] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const nodeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Format the actual mc_value as percentage
  const mcScorePercentage = Math.round(node.mc_value * 100);
  
  // Calculate accuracy
  const accuracy = node.total_rollouts > 0 
    ? Math.round((node.count_correct_rollouts / node.total_rollouts) * 100) 
    : 0;
  
  // Determine color based on score (green for high scores, yellow for medium, red for low)
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (acc >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  // Animation handling when expanding/collapsing
  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.style.height = expanded ? 'auto' : '0';
    }
  }, [expanded]);

  // Handle toggle expansion
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Toggle full text display
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // To display content properly with potential truncation
  const displayContent = node.content || node.text || '';
  const isTextLong = displayContent.length > 150;
  const truncatedContent = isTextLong && !showFullText
    ? `${displayContent.substring(0, 150)}...` 
    : displayContent;

  return (
    <div 
      className={cn(
        "relative animate-node-enter",
        { "ml-6 mt-6": depth > 0 }
      )}
      style={{ 
        animationDelay: `${depth * 0.1 + index * 0.05}s`,
      }}
    >
      {/* Vertical connector line from parent to current node */}
      {depth > 0 && (
        <div 
          className="absolute w-[2px] bg-slate-200 left-[-20px]" 
          style={{ 
            top: '-24px',
            height: '24px' 
          }}
        />
      )}

      {/* Horizontal connector line */}
      {depth > 0 && (
        <div 
          className="absolute h-[2px] bg-slate-200 top-[28px] left-[-20px] w-[20px]"
        />
      )}

      {/* Main node content */}
      <div
        className={cn(
          "node-container rounded-lg border p-4 mb-2 bg-white shadow-sm",
          "backdrop-blur-sm bg-opacity-90 transition-all duration-300",
          hasChildren && (expanded ? "node-expanded" : "node-collapsed")
        )}
      >
        {/* Header with toggle and role */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {hasChildren && (
              <button 
                onClick={toggleExpanded}
                className="mr-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                aria-label={expanded ? "Collapse node" : "Expand node"}
              >
                {expanded ? 
                  <ChevronDown className="h-4 w-4 text-slate-500" /> : 
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                }
              </button>
            )}
            {node.role && (
              <span className="text-sm font-medium border px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {node.role}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <span 
              className={cn(
                "text-xs border px-2 py-0.5 rounded-full",
                getScoreColor(mcScorePercentage)
              )}
              title="Monte Carlo Value"
            >
              Score: {mcScorePercentage}% ({node.mc_value.toFixed(2)})
            </span>
            
            <span 
              className={cn(
                "text-xs border px-2 py-0.5 rounded-full",
                getAccuracyColor(accuracy)
              )}
              title="Accuracy: Correct rollouts / Total rollouts"
            >
              Acc: {accuracy}% ({node.count_correct_rollouts}/{node.total_rollouts})
            </span>
          </div>
        </div>
        
        {/* Node statistics */}
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs text-slate-500">
          <div>
            <span className="font-medium">Visits:</span> {node.visit_count}
          </div>
          <div>
            <span className="font-medium">Incorrect:</span> {node.incorrect_rollouts}/{node.total_rollouts}
          </div>
        </div>
        
        {/* Node content */}
        {displayContent && (
          <div className="relative">
            <div
              ref={contentRef}
              className="mt-2 p-3 bg-slate-50 rounded border border-slate-100 text-sm text-slate-700 max-h-[200px] overflow-auto"
            >
              {truncatedContent}
            </div>
            
            {/* Show expand/collapse button only if text is long */}
            {isTextLong && (
              <button
                onClick={toggleFullText}
                className="absolute bottom-2 right-2 p-1 rounded-full bg-white border shadow-sm hover:bg-slate-50 transition-colors"
                aria-label={showFullText ? "Show less" : "Show more"}
                title={showFullText ? "Show less" : "Show more"}
              >
                {showFullText ? 
                  <MinimizeIcon className="h-3.5 w-3.5 text-slate-500" /> : 
                  <ExpandIcon className="h-3.5 w-3.5 text-slate-500" />
                }
              </button>
            )}
          </div>
        )}
      </div>

      {/* Children nodes - vertical tree layout */}
      {hasChildren && expanded && (
        <div 
          ref={nodeRef}
          className="overflow-hidden relative"
        >
          {/* Connector line for child nodes */}
          {node.children.length > 1 && (
            <div 
              className="absolute w-[2px] bg-slate-200 left-[-20px]" 
              style={{ 
                top: '0', 
                height: `calc(100% - ${isLastChild ? '0px' : '54px'})` 
              }}
            />
          )}
          
          {node.children.map((childNode, childIndex) => (
            <TreeNode
              key={childIndex}
              node={childNode}
              depth={depth + 1}
              index={childIndex}
              isLastChild={childIndex === node.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
