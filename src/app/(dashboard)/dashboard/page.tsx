'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface AnalyticsItem {
  date: string;
  source: string;
  medium: string;
  deviceCategory: string;
  totalUsers: number;
  newUsers: number;
  sessions: number;
  averageSessionDuration: number;
  pageViewsPerSession: number;
  bounceRate: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface ChartDataSet {
  deviceChart: ChartData[];
  sourceChart: ChartData[];
}

const Dashboardpage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[] | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    router.push('/api/auth/google');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const analyticsResponse = await fetch('/api/get-analytics-data');
        const data: AnalyticsItem[] = await analyticsResponse.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    }
    fetchData();
  }, []);

  const prepareChartData = (): ChartDataSet => {
    if (!analyticsData || !Array.isArray(analyticsData)) {
      return { deviceChart: [], sourceChart: [] };
    }
  
    const deviceData: { [key: string]: number } = {};
    const sourceData: { [key: string]: number } = {};
  
    analyticsData.forEach((item: AnalyticsItem) => {
      // Aggregate device data
      if (!deviceData[item.deviceCategory]) {
        deviceData[item.deviceCategory] = 0;
      }
      deviceData[item.deviceCategory] += item.sessions;
  
      // Aggregate source data
      if (!sourceData[item.source]) {
        sourceData[item.source] = 0;
      }
      sourceData[item.source] += item.sessions;
    });
  
    return {
      deviceChart: Object.keys(deviceData).map(key => ({ name: key, value: deviceData[key] })),
      sourceChart: Object.keys(sourceData).map(key => ({ name: key, value: sourceData[key] }))
    };
  };

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Google Analytics</h1>
        
        <div className="flex flex-row bg-white rounded-lg shadow p-6 mb-8">
          <button 
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Login with Google
          </button>
          <input 
            type='text' 
            placeholder='Enter your GA4 PROPERTY ID' 
            className="ml-4 p-2 border rounded placeholder:text-sm"
          />
        </div>

        {analyticsData && Array.isArray(analyticsData) && analyticsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Device Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.deviceChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.deviceChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.sourceChart}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Detailed Analytics Data</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Source</th>
                      <th className="px-4 py-2">Medium</th>
                      <th className="px-4 py-2">Device</th>
                      <th className="px-4 py-2">Sessions</th>
                      <th className="px-4 py-2">Avg. Duration</th>
                      <th className="px-4 py-2">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-2">{item.date}</td>
                        <td className="px-4 py-2">{item.source}</td>
                        <td className="px-4 py-2">{item.medium}</td>
                        <td className="px-4 py-2">{item.deviceCategory}</td>
                        <td className="px-4 py-2">{item.sessions}</td>
                        <td className="px-4 py-2">{item.averageSessionDuration.toFixed(2)}s</td>
                        <td className="px-4 py-2">{(item.bounceRate * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">
          {analyticsData === null ? "Loading Analytics data..." : "No analytics data available."}
        </p>
        )}
      </div>
    </div>
  );
};

export default Dashboardpage;