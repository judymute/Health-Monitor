import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';

// Components
import HealthStatusCard from './HealthStatusCard';
import MetricsPanel from './MetricsPanel';
import DietaryRecommendations from './DietaryRecommendations';
import ActivitySuggestions from './ActivitySuggestions';

const UserDashboard = ({ userData }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have userData (passed from parent), use it
    if (userData) {
      setDashboardData(userData);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load your health data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData]);

  // Helper function to determine health status
  const getHealthStatus = () => {
    if (!dashboardData || !dashboardData.healthAssessment) return 'unknown';
    
    const { healthScore } = dashboardData.healthAssessment;
    
    if (healthScore >= 80) return 'healthy';
    if (healthScore >= 60) return 'fair';
    if (healthScore >= 40) return 'needs attention';
    return 'needs checkup';
  };

  if (loading) return <div className="loading">Loading your health dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!dashboardData) return <div className="error-message">No data available. Please complete the health assessment.</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {dashboardData.user.name || 'User'}</h1>
        <p>Your personalized health dashboard</p>
      </header>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="dashboard-card profile-card">
          <h2>Profile</h2>
          <div className="profile-details">
            <div className="profile-item">
              <span className="label">Name:</span>
              <span className="value">{dashboardData.user.name}</span>
            </div>
            <div className="profile-item">
              <span className="label">Age:</span>
              <span className="value">{dashboardData.user.age}</span>
            </div>
            <div className="profile-item">
              <span className="label">Blood Type:</span>
              <span className="value">{dashboardData.user.bloodType || 'Not specified'}</span>
            </div>
            <div className="profile-item">
              <span className="label">Height:</span>
              <span className="value">{dashboardData.user.height ? `${dashboardData.user.height} cm` : 'Not specified'}</span>
            </div>
            <div className="profile-item">
              <span className="label">Weight:</span>
              <span className="value">{dashboardData.user.weight ? `${dashboardData.user.weight} kg` : 'Not specified'}</span>
            </div>
            <div className="profile-item">
              <span className="label">BMI:</span>
              <span className="value">
                {dashboardData.user.height && dashboardData.user.weight
                  ? (dashboardData.user.weight / Math.pow(dashboardData.user.height/100, 2)).toFixed(1)
                  : 'Not available'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Health Status Card */}
        <div className={`dashboard-card health-status-card ${getHealthStatus()}`}>
          <h2>Health Status</h2>
          <div className="status-indicator">
            <div className="status-icon"></div>
            <div className="status-text">{getHealthStatus()}</div>
          </div>
          <div className="health-score">
            <div className="score-label">Health Score</div>
            <div className="score-value">{dashboardData.healthAssessment?.healthScore || '?'}</div>
          </div>
          {dashboardData.healthAssessment?.warningFlags && 
            dashboardData.healthAssessment.warningFlags.length > 0 && (
            <div className="warning-flags">
              <h3>Areas of Concern</h3>
              <ul>
                {dashboardData.healthAssessment.warningFlags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Dietary Recommendations */}
        <div className="dashboard-card diet-card">
          <h2>Dietary Recommendations</h2>
          {dashboardData.recommendations?.diet ? (
            <div className="diet-recommendations">
              <h3>Today's Meal Plan</h3>
              <div className="meal">
                <h4>Breakfast</h4>
                <p>{dashboardData.recommendations.diet.breakfast}</p>
              </div>
              <div className="meal">
                <h4>Lunch</h4>
                <p>{dashboardData.recommendations.diet.lunch}</p>
              </div>
              <div className="meal">
                <h4>Dinner</h4>
                <p>{dashboardData.recommendations.diet.dinner}</p>
              </div>
              <div className="meal">
                <h4>Snacks</h4>
                <p>{dashboardData.recommendations.diet.snacks}</p>
              </div>
              
              <h3>Foods to Include</h3>
              <ul className="food-list include">
                {dashboardData.recommendations.diet.include.map((food, index) => (
                  <li key={index}>{food}</li>
                ))}
              </ul>
              
              <h3>Foods to Limit</h3>
              <ul className="food-list limit">
                {dashboardData.recommendations.diet.limit.map((food, index) => (
                  <li key={index}>{food}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Complete your health assessment to receive dietary recommendations.</p>
          )}
        </div>

        {/* Health Metrics */}
        <div className="dashboard-card metrics-card">
          <h2>Health Metrics</h2>
          {dashboardData.metrics ? (
            <div className="metrics-container">
              {Object.entries(dashboardData.metrics).map(([key, value]) => (
                <div key={key} className="metric-item">
                  <div className="metric-label">{key}</div>
                  <div className="metric-value">{value}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No health metrics available yet.</p>
          )}
        </div>

        {/* Upcoming Check-ups */}
        <div className="dashboard-card checkups-card">
          <h2>Upcoming Check-ups</h2>
          {dashboardData.checkups && dashboardData.checkups.length > 0 ? (
            <ul className="checkup-list">
              {dashboardData.checkups.map((checkup, index) => (
                <li key={index} className="checkup-item">
                  <div className="checkup-date">{new Date(checkup.date).toLocaleDateString()}</div>
                  <div className="checkup-type">{checkup.type}</div>
                  <div className="checkup-provider">{checkup.provider}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming check-ups scheduled.</p>
          )}
          <button className="btn-schedule">Schedule Check-up</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;