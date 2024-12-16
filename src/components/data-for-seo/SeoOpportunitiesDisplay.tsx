"use client"


import { useSeoOpportunities } from "@/hooks/data-for-seo-api/useSeoOpportunities";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';
import SEODataDisplay from "./SEODataDisplay";


export default function SeoOpportunitiesDisplay() {
    const { runTask, loading, error, data } = useSeoOpportunities();
    

    const handleSubmit = (domain: string, keyword: string, taskId: string) => {
        const cleanDomain = (domain: string) => {
            return domain
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '');
        };

        const cleanedDomain = cleanDomain(domain);
        runTask(cleanedDomain, keyword, taskId);
    };


    return (
        <div className="flex flex-col space-y-6 p-6">
            <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Analyze" />
            {loading && <Loader />}
            {error && <p className="text-red-500">Error: {error}</p>}
            {data && (
                <SEODataDisplay data={data} />
            )}
        </div>
    );
}