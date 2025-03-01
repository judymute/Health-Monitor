import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = ({ userData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your health assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [userContext, setUserContext] = useState(null);

  useEffect(() => {
    // If userData is passed from parent, use it
    if (userData) {
      setUserContext(userData);
    } else {
      // Otherwise fetch from API
      const fetchUserContext = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('/api/user-context', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserContext(response.data);
        } catch (err) {
          console.error('Error fetching user context:', err);
          // Add a bot message about the error
          addMessage({
            text: "I'm having trouble accessing your health information. My responses may be limited.",
            sender: 'bot'
          });
        }
      };

      fetchUserContext();
    }
  }, [userData]);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    addMessage({
      text: inputText,
      sender: 'user'
    });
    
    // Clear input
    setInputText('');
    
    // Show bot is typing
    setIsTyping(true);
    
    try {
      // Send message to backend for AI processing
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/chatbot', {
        message: inputText,
        userContext: userContext
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add bot response after a short delay to seem more natural
      setTimeout(() => {
        addMessage({
          text: response.data.message,
          sender: 'bot'
        });
        setIsTyping(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error in chatbot communication:', err);
      
      // Add error message
      setTimeout(() => {
        addMessage({
          text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
          sender: 'bot'
        });
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Common health questions for quick access
  const quickQuestions = [
    "What should I eat today?",
    "How can I improve my sleep?",
    "Should I be concerned about my symptoms?",
    "What exercises are recommended for me?",
    "How can I reduce stress?"
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
        
        {isTyping && (
          <div className="message bot-message typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chatbot-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your health question here..."
          disabled={isTyping}
        />
        <button 
          type="submit" 
          disabled={!inputText.trim() || isTyping}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;