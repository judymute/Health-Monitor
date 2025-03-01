import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Questions.css';

const Questions = ({ setUserData }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    age: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
    
    // Health Conditions
    existingConditions: [],
    medications: [],
    allergies: [],
    familyHistory: [],
    
    // Lifestyle
    sleepHours: '',
    exerciseFrequency: '',
    dietType: '',
    alcoholConsumption: '',
    smokingHabits: '',
    stressLevel: '',
    
    // Symptoms (if any)
    currentSymptoms: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormData({ ...formData, [name]: selectedValues });
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    let updatedArray = [...formData[category]];
    
    if (checked) {
      updatedArray.push(value);
    } else {
      updatedArray = updatedArray.filter(item => item !== value);
    }
    
    setFormData({ ...formData, [category]: updatedArray });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send form data to backend
      const response = await axios.post('/api/health-assessment', formData);
      
      // Update user data with assessment results
      setUserData(response.data);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting health assessment:', error);
      // Handle error (show error message)
    }
  };

  // Render different form sections based on current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Type</label>
              <select name="bloodType" value={formData.bloodType} onChange={handleInputChange}>
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h2>Health Conditions</h2>
            <div className="form-group">
              <label>Existing Medical Conditions (select all that apply)</label>
              <div className="checkbox-group">
                {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Cancer', 'Thyroid Disorder', 'None'].map(condition => (
                  <div key={condition} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id={condition} 
                      value={condition} 
                      checked={formData.existingConditions.includes(condition)}
                      onChange={(e) => handleCheckboxChange(e, 'existingConditions')} 
                    />
                    <label htmlFor={condition}>{condition}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Current Medications</label>
              <textarea 
                name="medications" 
                value={formData.medications.join('\n')} 
                onChange={(e) => setFormData({...formData, medications: e.target.value.split('\n')})}
                placeholder="Enter one medication per line"
              />
            </div>
            <div className="form-group">
              <label>Allergies</label>
              <textarea 
                name="allergies" 
                value={formData.allergies.join('\n')} 
                onChange={(e) => setFormData({...formData, allergies: e.target.value.split('\n')})}
                placeholder="Enter one allergy per line"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h2>Lifestyle</h2>
            <div className="form-group">
              <label>Average Sleep Hours</label>
              <select name="sleepHours" value={formData.sleepHours} onChange={handleInputChange}>
                <option value="">Select Hours</option>
                <option value="less-than-5">Less than 5 hours</option>
                <option value="5-6">5-6 hours</option>
                <option value="7-8">7-8 hours</option>
                <option value="more-than-8">More than 8 hours</option>
              </select>
            </div>
            <div className="form-group">
              <label>Exercise Frequency</label>
              <select name="exerciseFrequency" value={formData.exerciseFrequency} onChange={handleInputChange}>
                <option value="">Select Frequency</option>
                <option value="never">Never</option>
                <option value="1-2-times">1-2 times per week</option>
                <option value="3-5-times">3-5 times per week</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="form-group">
              <label>Diet Type</label>
              <select name="dietType" value={formData.dietType} onChange={handleInputChange}>
                <option value="">Select Diet Type</option>
                <option value="omnivore">Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Alcohol Consumption</label>
              <select name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleInputChange}>
                <option value="">Select Option</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="form-group">
              <label>Smoking Habits</label>
              <select name="smokingHabits" value={formData.smokingHabits} onChange={handleInputChange}>
                <option value="">Select Option</option>
                <option value="never">Never smoked</option>
                <option value="former">Former smoker</option>
                <option value="occasional">Occasional smoker</option>
                <option value="regular">Regular smoker</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stress Level</label>
              <select name="stressLevel" value={formData.stressLevel} onChange={handleInputChange}>
                <option value="">Select Level</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h2>Current Symptoms</h2>
            <div className="form-group">
              <label>Are you currently experiencing any symptoms? (select all that apply)</label>
              <div className="checkbox-group">
                {[
                  'Fever', 'Cough', 'Shortness of breath', 'Fatigue', 'Headache', 
                  'Body aches', 'Sore throat', 'Nausea', 'Dizziness', 'None'
                ].map(symptom => (
                  <div key={symptom} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id={symptom} 
                      value={symptom} 
                      checked={formData.currentSymptoms.includes(symptom)}
                      onChange={(e) => handleCheckboxChange(e, 'currentSymptoms')} 
                    />
                    <label htmlFor={symptom}>{symptom}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea 
                name="additionalNotes" 
                value={formData.additionalNotes || ''} 
                onChange={handleInputChange}
                placeholder="Any other health concerns or information you'd like to share"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="questions-container">
      <h1>Health Assessment</h1>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
      <div className="step-indicators">
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step} 
            className={`step ${currentStep >= step ? 'active' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderFormStep()}
        
        <div className="form-buttons">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-prev">
              Previous
            </button>
          )}
          
          {currentStep < 4 ? (
            <button type="button" onClick={nextStep} className="btn-next">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-submit">
              Submit Assessment
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Questions;