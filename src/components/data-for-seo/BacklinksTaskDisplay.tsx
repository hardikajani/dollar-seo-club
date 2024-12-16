"use client"

import React from 'react';
import { useBacklinks } from "@/hooks/data-for-seo-api/useBacklinks";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';
import BacklinkSummary from './BacklinkSummary';


export default function BacklinksTaskDisplay() {
    const { runTask, loading, error, data } = useBacklinks();

    const handleSubmit = (domain: string, keyword: string, tsakId: string) => {
        // Function to clean up the domain
        const cleanDomain = (domain: string) => {
            return domain
                .replace(/^https?:\/\//, '') // Remove http:// or https://
                .replace(/^www\./, '');        // Remove www.
        };

        const cleanedDomain = cleanDomain(domain);
        runTask(cleanedDomain);
    };

    return (
        <div className="flex flex-col">
            <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Go" />
            {loading && <Loader />}
            {error && <p className="text-red-500">Error: {error}</p>}
            {data &&
                <div className='w-full'>
                    <BacklinkSummary data={data} />
                </div>
            }
        </div>
    );
}