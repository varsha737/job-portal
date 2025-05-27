import React from 'react';
import './JobFilters.css';

const JobFilters = ({ filters, setFilters, uniqueLocations, uniqueTypes }) => {
  const statusOptions = ['all', 'Pending', 'Reject', 'Interview', 'Hiring', 'Open', 'Closed'];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="job-filters">
      <div className="filter-group">
        <input
          type="text"
          name="search"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label>Status:</label>
        <select 
          name="status" 
          value={filters.status} 
          onChange={handleFilterChange}
        >
          {statusOptions.map(status => (
            <option key={status} value={status.toLowerCase()}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Type:</label>
        <select 
          name="workType" 
          value={filters.workType} 
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Location:</label>
        <select 
          name="workLocation" 
          value={filters.workLocation} 
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          {uniqueLocations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <button 
        className="clear-filters"
        onClick={() => setFilters({
          search: '',
          status: 'all',
          workType: 'all',
          workLocation: 'all'
        })}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default JobFilters; 