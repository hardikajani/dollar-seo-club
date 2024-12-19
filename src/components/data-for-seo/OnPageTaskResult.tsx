import React from 'react';

interface Meta {
  title: string;
  description: string;
  htags: {
    h1?: string[];
  };
  internal_links_count: number;
  external_links_count: number;
  inbound_links_count: number;
  canonical: string;
  cumulative_layout_shift: number;
}

interface PageTiming {
  time_to_interactive: number;
  dom_complete: number;
  largest_contentful_paint: number;
  first_input_delay: number;
}

interface Item {
  url: string;
  status_code: number;
  media_type: string;
  onpage_score: number;
  meta: Meta;
  page_timing: PageTiming;
  checks: {
    has_robots_txt: boolean;
    has_sitemap: boolean;
    is_mobile_friendly: boolean;
  };
}

interface Task {
  result: {
    items: Item[];
  }[];
}

interface OnPageTaskResultProps {
  data: {
    tasks: Task[];
  };
}

const OnPageTaskResult: React.FC<OnPageTaskResultProps> = ({ data }) => {
  if (!data || !data.tasks || data.tasks.length === 0) {
    return <div className="text-red-500 bg-gray-100 shadow-lg rounded-lg p-6 max-w-4xl mx-auto">No data available</div>;
  }

  const task = data.tasks[0];
  if (!task.result || task.result.length === 0 || !task.result[0].items || task.result[0].items.length === 0) {
    return <div className="text-blue-800 bg-gray-100 shadow-lg rounded-lg p-6 max-w-4xl mx-auto">Task completed, but Your website forbids us from accessing it with their meta tags.</div>;
  }

  const item = task.result[0].items[0];
  const meta = item.meta || {};
  const pageTiming = item.page_timing || {};

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">On-Page SEO Analysis</h2>
      {/* OnPage Score */}
      <div className="mt-6 bg-indigo-100 p-4 rounded-md text-center">
        <h3 className="text-lg font-semibold mb-2">OnPage Score</h3>
        <p className="text-4xl font-bold text-indigo-600">{item.onpage_score.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Page Info */}
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Page Information</h3>
          <p><strong>URL:</strong> {item.url.substring(0, 40)}...</p>
          <p><strong>Status Code:</strong> {item.status_code}</p>
          <p><strong>Content Type:</strong> {item.media_type}</p>
        </div>

        {/* Page Speed */}
        <div className="bg-blue-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Page Speed</h3>
          <p><strong>Time to Interactive:</strong> {pageTiming.time_to_interactive}ms</p>
          <p><strong>DOM Complete:</strong> {pageTiming.dom_complete}ms</p>
          <p><strong>Largest Contentful Paint:</strong> {pageTiming.largest_contentful_paint.toFixed(2)}ms</p>
        </div>

        {/* SEO Elements */}
        <div className="bg-green-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">SEO Elements</h3>
          <p><strong>Title:</strong> {meta.title}</p>
          <p><strong>Description:</strong> {meta.description?.substring(0, 100)}</p>
          <p><strong>H1:</strong> {meta.htags.h1 ? meta.htags.h1[0] : 'N/A'}</p>
        </div>

        {/* Links Analysis */}
        <div className="bg-yellow-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Links Analysis</h3>
          <p><strong>Internal Links:</strong> {meta.internal_links_count}</p>
          <p><strong>External Links:</strong> {meta.external_links_count}</p>
          <p><strong>Inbound Links:</strong> {meta.inbound_links_count}</p>
        </div>

        {/* Technical SEO */}
        <div className="bg-purple-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Technical SEO</h3>
          <p><strong>Canonical URL:</strong> {meta.canonical}</p>
          <p><strong>Robots.txt:</strong> {item.checks.has_robots_txt ? 'Present' : 'Not found'}</p>
          <p><strong>Sitemap:</strong> {item.checks.has_sitemap ? 'Present' : 'Not found'}</p>
        </div>

        {/* Mobile & Core Web Vitals */}
        <div className="bg-red-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Mobile & Core Web Vitals</h3>
          <p><strong>Mobile Friendly:</strong> {item.checks.is_mobile_friendly ? 'Yes' : 'No'}</p>
          <p><strong>First Input Delay:</strong> {pageTiming.first_input_delay.toFixed(2)}ms</p>
          <p><strong>Cumulative Layout Shift:</strong> {meta.cumulative_layout_shift.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};

export default OnPageTaskResult;