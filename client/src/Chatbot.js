import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your health assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message) => {
    const newMessage = {
      id: messages.length + 1,
      timestamp: new Date(),
      ...message
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    addMessage({
      text: inputText,
      sender: 'user'
    });
    
    // Clear input
    setInputText('');
    
    // Simulate bot response
    setTimeout(() => {
      // Simple responses based on keywords
      let botResponse = "I'm sorry, I don't understand that query. Could you try rephrasing?";
      
      const lowercaseInput = inputText.toLowerCase();
      
      if (lowercaseInput.includes('diet') || lowercaseInput.includes('eat') || lowercaseInput.includes('food')) {
        botResponse = "Based on your health profile, I recommend eating more leafy greens, lean proteins, and whole grains. Try to limit processed foods and added sugars.";
      } else if (lowercaseInput.includes('sleep') || lowercaseInput.includes('tired')) {
        botResponse = "For better sleep quality, aim for 7-8 hours per night. Establish a regular sleep schedule and avoid screens before bedtime.";
      } else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('workout')) {
        botResponse = "I recommend 150 minutes of moderate exercise per week. Mix cardio activities with strength training for optimal results.";
      } else if (lowercaseInput.includes('stress') || lowercaseInput.includes('anxiety')) {
        botResponse = "Regular meditation, deep breathing exercises, and physical activity can help manage stress levels. Consider taking short breaks throughout your day.";
      } else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        botResponse = "Hello! How can I assist with your health today?";
      }
      
      addMessage({
        text: botResponse,
        sender: 'bot'
      });
    }, 1000);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Common health questions for quick access
  const quickQuestions = [
    "What should I eat today?",
    "How can I improve my sleep?",
    "What exercises are recommended?",
    "How can I reduce stress?",
    "What's my health status?"
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>Health Assistant</h1>
        <p>Ask me anything about your health</p>
      </div>
      
      <div className="quick-questions">
        {quickQuestions.map((question, index) => (
          <button 
            key={index} 
            className="quick-question-btn"
            onClick={() => handleQuickQuestion(question)}
          >
            {question}
          </button>
        ))}
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chatbot-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your health question here..."
        />
        <button 
          type="submit" 
          disabled={!inputText.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;