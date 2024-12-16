import { LoaderIcon } from 'lucide-react';
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div> */}
      <LoaderIcon className="animate-spin" />
    </div>
  );
};

export default Loader;