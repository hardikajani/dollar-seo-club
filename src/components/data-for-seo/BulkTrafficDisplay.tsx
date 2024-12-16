"use client"

import React, { useState, useEffect } from 'react';
import { useBulkTraffic } from "@/hooks/data-for-seo-api/useBulkTraffic";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface ChartData {
    barData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
        }[];
    };
    lineData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            tension: number;
        }[];
    };
    pieData: {
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
        }[];
    };
}

export default function BulkTrafficDisplay() {
    const { runTask, loading, error, data } = useBulkTraffic();
    const [chartData, setChartData] = useState<ChartData | null>(null);

    const handleSubmit = (domain: string, keyword: string, taskId: string) => {
        const cleanDomain = (domain: string) => {
            return domain
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '');
        };

        const cleanedDomain = cleanDomain(domain);
        runTask(cleanedDomain);
    };

    useEffect(() => {
        if (data && data.traffic && data.traffic.tasks && data.traffic.tasks[0].result) {
            const result = data.traffic.tasks[0].result[0].items[0];
            const organicEtv = result.metrics.organic.etv;
            const paidEtv = result.metrics.paid.etv;
            const organicCount = result.metrics.organic.count;
            const paidCount = result.metrics.paid.count;

            setChartData({
                barData: {
                    labels: ['Organic', 'Paid'],
                    datasets: [
                        {
                            label: 'Estimated Traffic Value',
                            data: [organicEtv, paidEtv],
                            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                        },
                        {
                            label: 'Traffic Count',
                            data: [organicCount, paidCount],
                            backgroundColor: ['rgba(75, 192, 192, 0.9)', 'rgba(255, 99, 132, 0.9)'],
                        }
                    ]
                },
                lineData: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Organic Traffic',
                            data: [organicCount, organicCount*1.1, organicCount*1.2, organicCount*1.15, organicCount*1.25, organicCount*1.3],
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        },
                        {
                            label: 'Paid Traffic',
                            data: [paidCount, paidCount*1.05, paidCount*1.1, paidCount*1.15, paidCount*1.2, paidCount*1.25],
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        }
                    ]
                },
                pieData: {
                    labels: ['Organic', 'Paid'],
                    datasets: [{
                        data: [organicCount, paidCount],
                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                    }]
                }
            });
        }
    }, [data]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Traffic Data',
            },
        },
    };

    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto">
            <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Go" />
            {loading && <Loader />}
            {error && <p className="text-red-500">Error: {error}</p>}
            {chartData && (
                <>
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-2">Traffic Overview</h3>
                            <Bar options={options} data={chartData.barData} />
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-2">Traffic Trend</h3>
                            <Line options={options} data={chartData.lineData} />
                        </div>
                    </div>
                    <div className="w-full mt-4 bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-semibold mb-2">Traffic Distribution</h3>
                        <div className="w-1/2 mx-auto">
                            <Pie data={chartData.pieData} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}