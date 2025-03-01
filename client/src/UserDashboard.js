import React from 'react';
import './UserDashboard.css';

const UserDashboard = ({ userData }) => {
  // Sample data for demonstration
  const dashboardData = userData || {
    user: {
      name: 'John Doe',
      age: 35,
      bloodType: 'O+',
      height: 175,
      weight: 70
    },
    healthAssessment: {
      healthScore: 85,
      warningFlags: []
    },
    recommendations: {
      diet: {
        breakfast: 'Oatmeal with berries and nuts',
        lunch: 'Grilled chicken salad with olive oil dressing',
        dinner: 'Baked salmon with steamed vegetables',
        snacks: 'Apple slices with almond butter',
        include: ['Leafy greens', 'Berries', 'Nuts', 'Fatty fish', 'Whole grains'],
        limit: ['Processed foods', 'Added sugars', 'Excessive caffeine']
      }
    }
  };

  // Helper function to determine health status
  const getHealthStatus = () => {
    const { healthScore } = dashboardData.healthAssessment;
    
    if (healthScore >= 80) return 'healthy';
    if (healthScore >= 60) return 'fair';
    if (healthScore >= 40) return 'needs-attention';
    return 'needs-checkup';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {dashboardData.user.name}</h1>
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
            <div className="status-text">{getHealthStatus().replace('-', ' ')}</div>
          </div>
          <div className="health-score">
            <div className="score-label">Health Score</div>
            <div className="score-value">{dashboardData.healthAssessment?.healthScore || '?'}</div>
          </div>
        </div>

        {/* Dietary Recommendations */}
        <div className="dashboard-card diet-card">
          <h2>Dietary Recommendations</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;