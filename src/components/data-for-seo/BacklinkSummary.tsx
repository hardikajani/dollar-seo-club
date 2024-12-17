import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  LineChart,
  Line,
} from 'recharts';


interface SummaryData {
  target: string;
  backlinks: number;
  referring_domains: number;
  broken_backlinks: number;
  referring_links_tld: { [key: string]: number };
  referring_links_types: { [key: string]: number };
  referring_links_platform_types: { [key: string]: number };
  rank: number;
}

interface BacklinksData {
  total_count: number;
}

interface ReferringDomainsData {
  // Add properties if needed
}

interface BacklinkSummaryProps {
  data: {
    summary: {
      tasks: [{ result: [SummaryData] }];
    };
    backlinks: {
      tasks: [{ result: [BacklinksData] }];
    };
    referringDomains: {
      tasks: [{ result: [ReferringDomainsData] }];
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6699', '#9966FF', '#FF99CC'];


const BacklinkSummary: React.FC<BacklinkSummaryProps> = ({ data }) => {
  if (!data || !data.summary || !data.backlinks || !data.referringDomains) {
    return <div>Loading data...</div>;
  }

  const summaryData = data.summary.tasks?.[0]?.result?.[0] || {};
  const backlinksData = data.backlinks.tasks?.[0]?.result?.[0] || {};
  const referringDomainsData = data.referringDomains.tasks?.[0]?.result?.[0] || {};

  const target = summaryData.target || 'Unknown';
  const totalBacklinks = summaryData.backlinks || 0;
  const referringDomains = summaryData.referring_domains || 0;
  const dofollowBacklinks = backlinksData.total_count || 0;
  const nofollowBacklinks = totalBacklinks - dofollowBacklinks;
  const dofollowPercentage = totalBacklinks > 0 ? ((dofollowBacklinks / totalBacklinks) * 100).toFixed(1) : '0.0';
  const brokenBacklinks = summaryData.broken_backlinks || 0;
  const brokenBacklinksPercentage = totalBacklinks > 0 ? ((brokenBacklinks / totalBacklinks) * 100).toFixed(1) : '0.0';

  const dataForPieChart = [
    { name: 'Dofollow', value: dofollowBacklinks },
    { name: 'Nofollow', value: nofollowBacklinks },
  ];

  // Data for Broken Backlinks Pie Chart
  const dataForBrokenBacklinks = [
    { name: 'Working', value: totalBacklinks - brokenBacklinks },
    { name: 'Broken', value: brokenBacklinks },
  ];

  const radarData = Object.entries(summaryData.referring_links_types || {}).map(([key, value]) => ({
    subject: key,
    A: value,
    fullMark: Math.max(...Object.values(summaryData.referring_links_types || {})),
  }));

  // New data for Treemap
  const treemapData = Object.entries(summaryData.referring_links_tld || {}).map(([name, size]) => ({
    name,
    size,
  }));

  // Dummy data for Line Chart (replace with actual historical data if available)
  const lineChartData = [
    { name: 'Jan', backlinks: totalBacklinks * 0.8 },
    { name: 'Feb', backlinks: totalBacklinks * 0.85 },
    { name: 'Mar', backlinks: totalBacklinks * 0.9 },
    { name: 'Apr', backlinks: totalBacklinks * 0.95 },
    { name: 'May', backlinks: totalBacklinks },
  ];

  const topReferringTLDs = Object.entries(summaryData.referring_links_tld || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topBacklinkTypes = Object.entries(summaryData.referring_links_types || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Backlink Summary for {target}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Backlinks */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Backlinks</h3>
          <p className="text-3xl font-bold text-blue-500">{totalBacklinks.toLocaleString()}</p>
        </div>

        {/* Referring Domains */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Referring Domains</h3>
          <p className="text-3xl font-bold text-green-500">{referringDomains.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Dofollow vs Nofollow Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Dofollow vs Nofollow</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataForPieChart}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dataForPieChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Broken Backlinks Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Broken Backlinks</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataForBrokenBacklinks}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dataForBrokenBacklinks.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart for Backlink Types */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Backlink Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              <Radar name="Backlink Types" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Treemap for Referring Domains */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Top Referring TLDs</h3>
          <ResponsiveContainer width="100%" height={200}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip formatter={(value, name) => [`${value} backlinks`, name]} />
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* Line Chart for Backlink Growth */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Backlink Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="backlinks" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Authority */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Domain Authority</h3>
          <p className="text-5xl font-bold text-purple-500">{summaryData.rank || 'N/A'}</p>
        </div>
      </div>

      {/* Backlink Sources */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Backlink Sources</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(summaryData.referring_links_platform_types || {}).length > 0 ? (
            Object.entries(summaryData.referring_links_platform_types || {}).slice(0, 4).map(([type, count], index) => (
              <div key={index} className="text-center bg-gray-50 p-2 rounded">
                <p className="text-lg font-semibold text-gray-700">{count.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{type}</p>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacklinkSummary;