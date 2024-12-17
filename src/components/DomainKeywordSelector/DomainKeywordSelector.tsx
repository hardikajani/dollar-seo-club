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
    isApproved: boolean;
}

const DomainKeywordSelector: React.FC<DomainKeywordSelectorProps> = ({ onSubmit, buttonText }) => {
    const { domainHistory, loading, error } = useDomainHistory();
    
    const domainOptions = useMemo<SelectOption[]>(() => {
        return domainHistory
            ? domainHistory.map(d => ({
                _id: d._id ? d._id.toString() : '',
                value: d.domain,
                isApproved: d.isApproved
              }))
            : [];
    }, [domainHistory]);

    const [selectedDomain, setSelectedDomain] = useState<string>('');
    const [selectedKeyword, setSelectedKeyword] = useState<string>('');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');

    const keywordOptions = useMemo<SelectOption[]>(() => {
        if (selectedDomain && domainHistory) {
            const domain = domainHistory.find(d => d.domain === selectedDomain);
            if (domain && Array.isArray(domain.keywords)) {
                return domain.keywords.map(keyword => ({
                    _id: keyword._id ? keyword._id.toString() : '',
                    value: keyword.content,
                    isApproved: domain.isApproved
                }));
            }
        }
        return [];
    }, [selectedDomain, domainHistory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedDomainOption = domainOptions.find(d => d.value === selectedDomain);
        if (selectedDomain && selectedTaskId && selectedDomainOption?.isApproved) {
            onSubmit(selectedDomain, selectedKeyword, selectedTaskId);
        } else if (!selectedDomainOption?.isApproved) {
            alert("Please wait for approval of your domain from admin");
        } else {
            alert("Please select a domain");
        }
    };

    useEffect(() => {
        setSelectedKeyword('');
        if (domainHistory) {
            const selectedDomainOption = domainHistory.find(d => d.domain === selectedDomain);
            setSelectedTaskId(selectedDomainOption?.taskId || '');
        }
    }, [domainHistory, selectedDomain]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-row px-10 gap-x-5 w-auto lg:max-w-2xl">
            <Select
                options={domainOptions.map(option => ({
                    ...option,
                    label: option.isApproved ? option.value : `${option.value} (Pending Approval)`
                }))}
                value={selectedDomain}
                onChange={setSelectedDomain}
                placeholder="Select a domain"
                label="Domain"
            />
            {domainOptions.some(d => !d.isApproved) && (
                <div className="text-yellow-600 text-sm">
                    Some domains are pending approval. Please wait for admin approval.
                </div>
            )}
            <Select
                options={keywordOptions}
                value={selectedKeyword}
                onChange={setSelectedKeyword}
                placeholder="Select a keyword"
                label="Keyword"
            />
            <div className='flex flex-col justify-end'>
            <button
                type="submit"
                className={` px-2 py-1.5 text-white rounded-md focus:outline-none ${
                    domainOptions.find(d => d.value === selectedDomain)?.isApproved
                        ? 'bg-blue-800 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!domainOptions.find(d => d.value === selectedDomain)?.isApproved}
            >
                {buttonText}
            </button>
            </div>
        </form>
    );
};

export default DomainKeywordSelector;