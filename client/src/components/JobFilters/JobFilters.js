import React from 'react';
import './JobFilters.css';

const JobFilters = ({ 
  filters, 
  setFilters, 
  uniqueLocations = [], 
  uniqueTypes = [],
  showStatusFilter = false 
}) => {
  const workTypeOptions = ['all', 'Full-Time', 'Part-Time', 'Contract', 'Internship'];
  const locationOptions = ['all', 'Remote', 'On-Site', 'Hybrid'];

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

      {showStatusFilter && (
        <div className="filter-group">
          <label>Status:</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
      )}

      <div className="filter-group">
        <label>Type:</label>
        <select 
          name="workType" 
          value={filters.workType} 
          onChange={handleFilterChange}
        >
          <option value="all">All Types</option>
          {(uniqueTypes.length > 0 ? uniqueTypes : workTypeOptions).map(type => (
            <option key={type} value={type.toLowerCase()}>
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
          <option value="all">All Locations</option>
          {(uniqueLocations.length > 0 ? uniqueLocations : locationOptions).map(location => (
            <option key={location} value={location.toLowerCase()}>
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