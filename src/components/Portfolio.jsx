import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const initialPortfolios = [
  {
    name: 'Bitcoin Portfolio',
    initialAmount: 5,
    assets: [
      { id: 'bitcoin', amount: 1.2, location: 'Binance', type: 'Exchange' },
      { id: 'bitcoin', amount: 0.8, location: 'OKX', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.5, location: 'Trezor', type: 'Hardware Wallet' },
      { id: 'bitcoin', amount: 0.7, location: 'KuCoin', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.26, location: 'Bitcoin Network', type: 'Blockchain' },
    ]
  },
  {
    name: 'Ethereum Portfolio',
    initialAmount: 30,
    assets: [
      { id: 'ethereum', amount: 7.2, location: 'MetaMask', type: 'Software Wallet' },
      { id: 'ethereum', amount: 5.8, location: 'KuCoin', type: 'Exchange' },
      { id: 'ethereum', amount: 8.3, location: 'Ethereum Mainnet', type: 'Blockchain' },
      { id: 'ethereum', amount: 5.2, location: 'Binance', type: 'Exchange' },
      { id: 'ethereum', amount: 7.6, location: 'OKX', type: 'Exchange' },
    ]
  },
  {
    name: 'USDT Portfolio',
    initialAmount: 600000,
    assets: [
      { id: 'tether', amount: 150000, location: 'Tron Network', type: 'Blockchain' },
      { id: 'tether', amount: 100000, location: 'Ethereum Network', type: 'Blockchain' },
      { id: 'tether', amount: 80000, location: 'Binance Smart Chain', type: 'Blockchain' },
      { id: 'tether', amount: 75680, location: 'Binance', type: 'Exchange' },
      { id: 'tether', amount: 60000, location: 'KuCoin', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.5, location: 'Binance', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.34, location: 'KuCoin', type: 'Exchange' },
      { id: 'ethereum', amount: 4, location: 'Binance', type: 'Exchange' },
      { id: 'ethereum', amount: 3, location: 'KuCoin', type: 'Exchange' },
    ]
  }
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#C7F464', '#FF8C94', '#91A6FF'];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState(initialPortfolios[0].name);
  const [prices, setPrices] = useState({
    bitcoin: 50000,
    ethereum: 3000,
    tether: 1,
  });

  const portfolioValues = useMemo(() => {
    return initialPortfolios.reduce((acc, portfolio) => {
      acc[portfolio.name] = portfolio.assets.reduce((total, item) => {
        const price = prices[item.id];
        return total + (price ? item.amount * price : 0);
      }, 0);
      return acc;
    }, {});
  }, [prices]);

  const totalValue = useMemo(() => 
    Object.values(portfolioValues).reduce((sum, value) => sum + value, 0),
  [portfolioValues]);

  const pieChartData = useMemo(() => 
    Object.entries(portfolioValues).map(([name, value]) => ({ name, value })),
  [portfolioValues]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <div className="flex-grow flex flex-col md:flex-row mb-4">
          <div className="md:w-1/2 h-64 md:h-auto mb-4 md:mb-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center items-center p-4">
            <div className="text-3xl font-bold text-primary mb-4">
              Total Value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {initialPortfolios.map((portfolio) => (
              <TabsTrigger key={portfolio.name} value={portfolio.name} className="text-sm">
                {portfolio.name}
                <span className="ml-2 text-xs font-semibold">
                  ${portfolioValues[portfolio.name]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {initialPortfolios.map((portfolio) => (
            <TabsContent key={portfolio.name} value={portfolio.name}>
              <PortfolioTable portfolio={portfolio} prices={prices} initialAmount={portfolio.initialAmount} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const PortfolioTable = ({ portfolio, prices, initialAmount }) => {
  const totalAmount = portfolio.assets.reduce((sum, asset) => sum + (asset.id === portfolio.assets[0].id ? asset.amount : 0), 0);
  const totalValue = portfolio.assets.reduce((sum, asset) => sum + asset.amount * prices[asset.id], 0);
  const profit = totalValue - (initialAmount * prices[portfolio.assets[0].id]);
  const profitPercentage = ((totalValue / (initialAmount * prices[portfolio.assets[0].id])) - 1) * 100;

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border">
      <div className="p-4">
        <div className="mb-4">
          <p className="text-lg font-bold">
            Overall Balance: {totalAmount.toFixed(4)} {portfolio.assets[0].id.toUpperCase()}
          </p>
          <p className={cn(
            "text-lg",
            profit >= 0 ? "text-green-500" : "text-red-500"
          )}>
            Profit: {profit.toFixed(2)} USD ({profitPercentage.toFixed(2)}%)
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="font-bold text-primary">Amount</TableHead>
              <TableHead>Value (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.assets.map((item, assetIndex) => {
              const price = prices[item.id] || 0;
              const value = item.amount * price;
              return (
                <TableRow key={assetIndex}>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className={cn(
                    "font-mono text-sm",
                    item.id === 'bitcoin' && "text-orange-500 font-bold",
                    item.id === 'ethereum' && "text-blue-500 font-bold",
                    item.id === 'tether' && "text-green-500 font-bold"
                  )}>
                    {item.amount.toFixed(4)} {item.id === 'bitcoin' ? 'BTC' : item.id === 'ethereum' ? 'ETH' : 'USDT'}
                  </TableCell>
                  <TableCell>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};

export default Portfolio;