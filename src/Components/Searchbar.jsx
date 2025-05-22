import React, { useState, useEffect } from 'react';

const Searchbar = ({ placeholder, unFilterd, onFilter, searchKeys = []}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filteredTerms = unFilterd.filter((item) =>
            searchKeys.some((key) => item[key]?.toLowerCase().includes(value))
        );
        onFilter(filteredTerms);
    };

    return (
        <div className="relative w-64 h-10">
            <label htmlFor="search" className="sr-only">Search</label>
            <input
                id="search"
                type="text"
                placeholder={placeholder || 'Search...'}
                className="pl-10 pr-4 py-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    );
};

export default Searchbar;