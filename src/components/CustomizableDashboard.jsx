import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import MarketOverview from './MarketOverview';
import GreedFearIndex from './GreedFearIndex';
import TopPerformers from './TopPerformers';
import TrendingCoins from './TrendingCoins';
import CryptoNews from './CryptoNews';
import TokenPairExplorer from './TokenPairExplorer';
import LiquidityPoolsOverview from './LiquidityPoolsOverview';
import GasTracker from './GasTracker';
import DeFiOverview from './DeFiOverview';
import NFTMarketplace from './NFTMarketplace';
import BlockchainExplorer from './BlockchainExplorer';
import TopCryptoAssets from './TopCryptoAssets';
import Portfolio from './Portfolio';
import PortfolioPerformance from './PortfolioPerformance';
import ChartWidget from './ChartWidget';
import TradeTerminal from './TradeTerminal';

const widgetComponents = {
  ChartWidget,
  MarketOverview,
  GreedFearIndex,
  TopPerformers,
  TrendingCoins,
  CryptoNews,
  TokenPairExplorer,
  LiquidityPoolsOverview,
  GasTracker,
  DeFiOverview,
  NFTMarketplace,
  BlockchainExplorer,
  TopCryptoAssets,
  Portfolio,
  PortfolioPerformance,
  TradeTerminal,
};

const initialWidgetSizes = {
  ChartWidget: { width: 8, height: 6 },
  MarketOverview: { width: 4, height: 3 },
  GreedFearIndex: { width: 4, height: 3 },
  TopPerformers: { width: 4, height: 3 },
  TrendingCoins: { width: 4, height: 3 },
  CryptoNews: { width: 4, height: 3 },
  TokenPairExplorer: { width: 4, height: 3 },
  LiquidityPoolsOverview: { width: 4, height: 3 },
  GasTracker: { width: 4, height: 3 },
  DeFiOverview: { width: 4, height: 3 },
  NFTMarketplace: { width: 4, height: 3 },
  BlockchainExplorer: { width: 4, height: 3 },
  TopCryptoAssets: { width: 4, height: 3 },
  Portfolio: { width: 4, height: 3 },
  PortfolioPerformance: { width: 4, height: 3 },
  TradeTerminal: { width: 4, height: 3 },
};

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : [
      'ChartWidget',
      'MarketOverview',
      'GreedFearIndex',
      'TopPerformers',
      'TrendingCoins',
      'CryptoNews',
    ];
  });
  const [widgetSizes, setWidgetSizes] = useState(() => {
    const savedSizes = localStorage.getItem('widgetSizes');
    return savedSizes ? JSON.parse(savedSizes) : initialWidgetSizes;
  });
  const [expandedWidgets, setExpandedWidgets] = useState({});
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [columns, setColumns] = useState(12);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else if (width < 1280) setColumns(4);
      else setColumns(6);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    localStorage.setItem('widgetSizes', JSON.stringify(widgetSizes));
  }, [widgets, widgetSizes]);

  useEffect(() => {
    const newLayout = [];
    let row = 0;
    let col = 0;

    widgets.forEach((widgetName) => {
      const size = widgetSizes[widgetName] || initialWidgetSizes[widgetName];
      if (col + size.width > columns) {
        col = 0;
        row += 1;
      }
      newLayout.push({
        i: widgetName,
        x: col,
        y: row,
        w: size.width,
        h: size.height,
      });
      col += size.width;
      if (col >= columns) {
        col = 0;
        row += size.height;
      }
    });

    setLayout(newLayout);
  }, [widgets, widgetSizes, columns]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgets(items);
  };

  const removeWidget = (index) => {
    const newWidgets = widgets.filter((_, i) => i !== index);
    setWidgets(newWidgets);
  };

  const toggleWidgetExpansion = (widgetName) => {
    setExpandedWidgets(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }));
  };

  const onResizeStop = (widgetName, size) => {
    setWidgetSizes(prev => ({
      ...prev,
      [widgetName]: {
        width: Math.round(size.width / (window.innerWidth / columns)),
        height: Math.round(size.height / 50),
      },
    }));
  };

  const getWidgetClassName = (widgetName, index) => {
    const isExpanded = expandedWidgets[widgetName];
    if (isExpanded) {
      return 'col-span-full row-span-full';
    }
    const size = widgetSizes[widgetName] || initialWidgetSizes[widgetName] || { width: 1, height: 1 };
    let className = `col-span-${size.width} row-span-${size.height}`;
    if (index === 0) {
      className += ' col-start-1 row-start-1';
    }
    return className;
  };

  const addWidget = (widgetName) => {
    if (!widgets.includes(widgetName)) {
      setWidgets([...widgets, widgetName]);
    }
    setIsAddWidgetOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customizable Dashboard</h2>
        <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Widget</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new widget</DialogTitle>
              <DialogDescription>
                Choose a widget to add to your dashboard.
              </DialogDescription>
            </DialogHeader>
            <Select onValueChange={addWidget}>
              <SelectTrigger>
                <SelectValue placeholder="Select a widget" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(widgetComponents).map((widgetName) => (
                  <SelectItem key={widgetName} value={widgetName}>
                    {widgetName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-${columns} auto-rows-min gap-4`}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridAutoRows: 'minmax(50px, auto)',
                gap: '1rem',
              }}
            >
              {layout.map((item, index) => {
                const WidgetComponent = widgetComponents[item.i];
                if (!WidgetComponent) {
                  console.error(`Widget component not found: ${item.i}`);
                  return null;
                }
                return (
                  <Draggable key={item.i} draggableId={item.i} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group`}
                        style={{
                          ...provided.draggableProps.style,
                          gridColumn: `span ${item.w}`,
                          gridRow: `span ${item.h}`,
                        }}
                      >
                        <ResizableBox
                          width={item.w * (window.innerWidth / columns)}
                          height={item.h * 50}
                          onResizeStop={(e, data) => onResizeStop(item.i, data.size)}
                          minConstraints={[100, 50]}
                          maxConstraints={[window.innerWidth, window.innerHeight]}
                          resizeHandles={['se']}
                          handle={
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary/20 cursor-se-resize rounded-bl" />
                          }
                        >
                          <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader className="p-2 flex flex-row items-center justify-between bg-secondary/10">
                              <CardTitle className="text-sm font-medium">{item.i}</CardTitle>
                              <div className="flex items-center space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleWidgetExpansion(item.i)}
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        {expandedWidgets[item.i] ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {expandedWidgets[item.i] ? 'Minimize' : 'Maximize'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeWidget(index)}
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Remove Widget
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div {...provided.dragHandleProps} className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                  <GripVertical className="h-3 w-3" />
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-2 overflow-auto relative" style={{ height: 'calc(100% - 2rem)' }}>
                              <WidgetComponent />
                            </CardContent>
                          </Card>
                        </ResizableBox>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CustomizableDashboard;