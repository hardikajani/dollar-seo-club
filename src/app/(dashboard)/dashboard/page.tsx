

import BulkTrafficDisplay from '@/components/data-for-seo/BulkTrafficDisplay';
import React from 'react'

const Dashboardpage = () => {
  return (
    <div>
      <BulkTrafficDisplay />
    </div>
    // <div className='flex flex-col px-2'>
    //   Google Search Console data will be personalized only for one account.
    //   so &quot; GOOGLE SEARCH CONSOLE AND ANALYTICS INTEGRATION. SHOW WEBSITE TRAFFIC GRAPH&ldquo; is not possible to implement 
    // </div>
  )
}

export default Dashboardpage;