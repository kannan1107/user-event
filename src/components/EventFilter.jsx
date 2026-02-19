import { useState } from 'react';

const EventFilter = ({ events, onFilterChange }) => {
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        dateRange: '',
        search: ''
    });

    const categories = [...new Set(events.map(e => e.category).filter(Boolean))];
    const locations = [...new Set(events.map(e => e.location).filter(Boolean))];

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        const filtered = events.filter(event => {
            const matchCategory = !newFilters.category || event.category === newFilters.category;
            const matchLocation = !newFilters.location || event.location === newFilters.location;
            const matchDate = !newFilters.dateRange || checkDateRange(event.date, newFilters.dateRange);
            const matchSearch = !newFilters.search || 
                event.title?.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                event.description?.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                event.location?.toLowerCase().includes(newFilters.search.toLowerCase());
            return matchCategory && matchLocation && matchDate && matchSearch;
        });
        
        onFilterChange(filtered);
    };

    const checkDateRange = (eventDate, range) => {
        const date = new Date(eventDate);
        const now = new Date();
        
        switch(range) {
            case 'today': return date.toDateString() === now.toDateString();
            case 'week': return date <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            case 'month': return date <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            default: return true;
        }
    };

    const clearFilters = () => {
        setFilters({ category: '', location: '', dateRange: '', search: '' });
        onFilterChange(events);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-wrap gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="border rounded px-3 py-2 flex-1 min-w-[200px]"
                />

                <select 
                    value={filters.category} 
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <select 
                    value={filters.location} 
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All Locations</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>

                <select 
                    value={filters.dateRange} 
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>

                <button 
                    onClick={clearFilters}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default EventFilter;