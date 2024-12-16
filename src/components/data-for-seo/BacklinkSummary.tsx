
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

const BacklinkSummary: React.FC<BacklinkSummaryProps> = ({ data }) => {
  const summaryData = data.summary.tasks[0].result[0];
  const backlinksData = data.backlinks.tasks[0].result[0];
  const referringDomainsData = data.referringDomains.tasks[0].result[0];

  const target = summaryData.target;
  const totalBacklinks = summaryData.backlinks;
  const referringDomains = summaryData.referring_domains;
  const dofollowBacklinks = backlinksData.total_count;
  const nofollowBacklinks = totalBacklinks - dofollowBacklinks;
  const dofollowPercentage = ((dofollowBacklinks / totalBacklinks) * 100).toFixed(1);
  const brokenBacklinks = summaryData.broken_backlinks;
  const brokenBacklinksPercentage = ((brokenBacklinks / totalBacklinks) * 100).toFixed(1);

  const topReferringTLDs = Object.entries(summaryData.referring_links_tld)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topBacklinkTypes = Object.entries(summaryData.referring_links_types)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
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
        
        {/* Dofollow vs Nofollow */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Dofollow vs Nofollow</h3>
          <div className="flex items-center">
            <div className="w-4/5 bg-blue-200 rounded-full h-4">
              <div 
                className="bg-blue-500 rounded-full h-4" 
                style={{ width: `${dofollowPercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-600">{dofollowPercentage}% Dofollow</span>
          </div>
        </div>
        
        {/* Broken Backlinks */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Broken Backlinks</h3>
          <div className="flex items-center">
            <div className="w-4/5 bg-red-200 rounded-full h-4">
              <div 
                className="bg-red-500 rounded-full h-4" 
                style={{ width: `${brokenBacklinksPercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-600">{brokenBacklinksPercentage}%</span>
          </div>
        </div>
      </div>
      
      {/* Top Referring TLDs */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Top Referring TLDs</h3>
        <div className="flex justify-between">
          {topReferringTLDs.map(([tld, count], index) => (
            <div key={index} className="text-center">
              <p className={`text-2xl font-bold text-${['blue', 'green', 'yellow'][index]}-500`}>
                {count.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">.{tld}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top Backlink Types */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Top Backlink Types</h3>
        <div className="flex justify-between">
          {topBacklinkTypes.map(([type, count], index) => (
            <div key={index} className="text-center">
              <p className={`text-2xl font-bold text-${['purple', 'indigo'][index]}-500`}>
                {count.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">{type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Backlink Sources */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Backlink Sources</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(summaryData.referring_links_platform_types).slice(0, 4).map(([type, count], index) => (
            <div key={index} className="text-center">
              <p className="text-lg font-semibold text-gray-700">{count.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Authority */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Domain Authority</h3>
        <p className="text-3xl font-bold text-purple-500">{summaryData.rank}</p>
      </div>
    </div>
  );
};

export default BacklinkSummary;