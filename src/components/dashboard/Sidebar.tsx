"use client"

import React, { useState, useEffect, useRef } from 'react';
import { dashboardItems } from '@/utils/constants';
import Link from 'next/link';
import Logo from '@/icons/logo';
import { ChevronLast, X } from 'lucide-react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Toggle button for mobile */}
            <button
                className="fixed top-40 left-1 z-50 lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
            >
                {!isOpen ? (
                    <ChevronLast className="h-6 w-6" />
                ) : null}
            </button>

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed inset-y-0 left-0 z-40 w-64 [background:radial-gradient(125%_125%_at_40%_40%,#F8FAFC_20%,#D1D5DB_100%)] shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:relative lg:translate-x-0`}
            >
                <div className="flex flex-col h-full p-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="w-10">
                            <Logo />
                        </div>
                        <button
                            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={toggleSidebar}
                            aria-label="Close Sidebar"
                        >
                            <X />
                        </button>
                    </div>
                    <nav>
                        <ul className="space-y-2">
                            {dashboardItems.map((item, index) => (
                                <li key={index}>
                                    <Link 
                                        href={item.href}
                                        onClick={toggleSidebar}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    >
                                        <span className="text-sm font-medium tracking-wider">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;