import React from 'react';

interface SEOData {
  onPage: any;
  keywordForSite: KeywordForSiteData;
  keywordSuggestions: any;
  rankedKeywords: any;
  backlinksSummary: any;
}

interface SEODataDisplayProps {
  data: SEOData;
}

interface KeywordInfo {
  keyword: string;
  keyword_info: {
    search_volume: number;
    cpc?: number; // Optional if it can be undefined
    competition_level: string;
  };
}

interface KeywordForSiteData {
  tasks: {
    result: {
      items: KeywordInfo[];
    }[];
  }[];
}

const SEODataDisplay: React.FC<{ data: SEOData }> = ({ data }) => {
  const { onPage, keywordForSite, keywordSuggestions, rankedKeywords, backlinksSummary } = data;

  // Helper function to safely access nested properties
  const safelyAccessNestedProp = (obj: any, path: string, defaultValue: any = 'N/A', transform?: (value: any) => any) => {
    const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    return value !== undefined ? (transform ? transform(value) : value) : defaultValue;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">SEO Data Analysis</h1>

      {/* On-Page API */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">On-Page Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Total Items: {safelyAccessNestedProp(onPage, 'tasks.0.result.0.items_count')}</p>
            <p className="font-medium">Crawl Progress: {safelyAccessNestedProp(onPage, 'tasks.0.result.0.items.0.crawl_progress')}</p>
          </div>
          <div>
            <p className="font-medium">Pages Crawled: {safelyAccessNestedProp(onPage, 'tasks.0.result.0.items.0.crawl_status.pages_crawled')}</p>
            <p className="font-medium">OnPage Score: {safelyAccessNestedProp(onPage, 'tasks.0.result.0.items.0.onpage_score', 'N/A', (value) => value.toFixed(2))}</p>
          </div>
        </div>
      </section>

      {/* Keywords for Site API */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">Keywords for Site</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Keyword</th>
                <th className="px-4 py-2">Search Volume</th>
                <th className="px-4 py-2">CPC</th>
                <th className="px-4 py-2">Competition</th>
              </tr>
            </thead>
            <tbody>
              {safelyAccessNestedProp(keywordForSite, 'tasks.0.result.0.items', []).map((item: any, index: number) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border px-4 py-2">{item.keyword}</td>
                  <td className="border px-4 py-2">{safelyAccessNestedProp(item, 'keyword_info.search_volume')}</td>
                  <td className="border px-4 py-2">${safelyAccessNestedProp(item, ' keyword_info.cpc', 'N/A', (value) => value.toFixed(2))}</td>
                  <td className="border px-4 py-2">{safelyAccessNestedProp(item, 'keyword_info.competition_level')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Keyword Suggestions API */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">Keyword Suggestions</h2>
        <p className="font-medium">Seed Keyword: {safelyAccessNestedProp(keywordSuggestions, 'tasks.0.result.0.seed_keyword')}</p>
        <p className="font-medium">Total Suggestions: {safelyAccessNestedProp(keywordSuggestions, 'tasks.0.result.0.items_count')}</p>
      </section>

      {/* Ranked Keywords API */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">Ranked Keywords</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Total Keywords: {safelyAccessNestedProp(rankedKeywords, 'tasks.0.result.0.total_count')}</p>
            <p className="font-medium">Organic Traffic Value: ${safelyAccessNestedProp(rankedKeywords, 'tasks.0.result.0.metrics.organic.etv', 'N/A', (value) => value.toFixed(2))}</p>
          </div>
          <div>
            <p className="font-medium">Top 10 Rankings: {
              (Number(safelyAccessNestedProp(rankedKeywords, 'tasks.0.result.0.metrics.organic.pos_1', 0)) +
                Number(safelyAccessNestedProp(rankedKeywords, 'tasks.0.result.0.metrics.organic.pos_2_3', 0)) +
                Number(safelyAccessNestedProp(rankedKeywords, 'tasks.0.result.0.metrics.organic.pos_4_10', 0))).toString()
            }</p>
            <p className="font-medium">New Rankings: {safelyAccessNestedProp(rankedKeywords, 'tasks.0.result.0.metrics.organic.is_new')}</p>
          </div>
        </div>
      </section>

      {/* Backlinks API */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">Backlinks Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Total Backlinks: {safelyAccessNestedProp(backlinksSummary, 'tasks.0.result.0.backlinks')}</p>
            <p className="font-medium">Referring Domains: {safelyAccessNestedProp(backlinksSummary, 'tasks.0.result.0.referring_domains')}</p>
          </div>
          <div>
            <p className="font-medium">Domain Rank: {safelyAccessNestedProp(backlinksSummary, 'tasks.0.result.0.rank')}</p>
            <p className="font-medium">First Seen: {safelyAccessNestedProp(backlinksSummary, 'tasks.0.result.0.first_seen', 'N/A', (value) => new Date(value).toLocaleDateString())}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SEODataDisplay;