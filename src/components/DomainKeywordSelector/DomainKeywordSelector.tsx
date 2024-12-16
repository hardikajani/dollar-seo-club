"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Select from '@/components/common/Select';
import { useDomainHistory } from '@/hooks/useDomainHistory';
import Loader from '../Loader/Loader';

interface DomainKeywordSelectorProps {
    onSubmit: (domain: string, keyword: string, taskId: string) => void;
    buttonText: string;
}

interface SelectOption {
    _id: string;
    value: string;
}

const DomainKeywordSelector: React.FC<DomainKeywordSelectorProps> = ({ onSubmit, buttonText }) => {
    const { domainHistory, loading, error } = useDomainHistory();
    
    // Always call useMemo, but handle the case where domainHistory is null or empty
    const domainOptions = useMemo<SelectOption[]>(() => {
        return domainHistory
            ? domainHistory
                .filter(d => d.isApproved)
                .map(d => ({ _id: d._id ? d._id.toString() : '', value: d.domain }))
            : [];
    }, [domainHistory]);

    const [selectedDomain, setSelectedDomain] = useState<string>('');
    const [selectedKeyword, setSelectedKeyword] = useState<string>('');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');

    // Filter keyword options based on the selected domain
    const keywordOptions = useMemo<SelectOption[]>(() => {
        if (selectedDomain && domainHistory) {
            const domain = domainHistory.find(d => d.domain === selectedDomain && d.isApproved);
            if (domain && Array.isArray(domain.keywords)) {
                return domain.keywords.map(keyword => ({ _id: keyword._id ? keyword._id.toString() : '', value: keyword.content }));
            }
        }
        return [];
    }, [selectedDomain, domainHistory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDomain && selectedTaskId) {
            onSubmit(selectedDomain, selectedKeyword, selectedTaskId);
        } else {
            alert("Please select a domain");
        }
    };

    useEffect(() => {
        setSelectedKeyword('');
        // Update selectedTaskId when selectedDomain changes
        if (domainHistory) {
            const selectedDomainOption = domainHistory.find(d => d.domain === selectedDomain);
            setSelectedTaskId(selectedDomainOption?.taskId || '');
        }
    }, [domainHistory, selectedDomain]);

    // Handle loading and error states
    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-row max-lg:flex-col px-10 lg:space-x-5 max-lg:space-y-5 w-auto lg:max-w-2xl">
            <Select
                options={domainOptions}
                value={selectedDomain}
                onChange={setSelectedDomain}
                placeholder="Select a domain"
                label="Domain"
            />
            <Select
                options={keywordOptions}
                value={selectedKeyword}
                onChange={setSelectedKeyword}
                placeholder="Select a keyword"
                label="Keyword"
            />
            <button
                type="submit"
                className="w-auto px-2 py-1.5 my-7 text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none"
            >
                {buttonText}
            </button>
        </form>
    );
};

export default DomainKeywordSelector;