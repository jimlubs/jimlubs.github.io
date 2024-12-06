import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Minimize2, Loader } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const welcomeMessage = {
    text: "👋 Welcome to JimLubs Investment Community! I'm your personal investment assistant. How can I help you today?\n\nI can assist you with:\n✨ Stock Market Strategies\n🛡️ Life Insurance Planning\n🏘️ Real Estate Investments",
    isBot: true
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([welcomeMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getBotResponse = (input) => {
    const responses = {
      stock: "💰 Our expert team can help you develop winning stock market strategies! Would you like to:\n\n1. Learn about our investment courses\n2. Get market analysis tips\n3. Connect with our stock advisors",
      invest: "📈 Ready to grow your wealth? Here are some investment options we can discuss:\n\n• Stock Market Trading\n• Real Estate Investment\n• Retirement Planning",
      insurance: "🛡️ Protecting your future is important! Our life insurance experts can help you:\n\n• Understand policy types\n• Plan for your family's security\n• Use insurance as an investment tool",
      estate: "🏘️ Looking to invest in real estate? We can help you:\n\n• Analyze property markets\n• Find investment opportunities\n• Understand REITs and property funds",
      hello: "👋 Hello! I'm excited to help you on your investment journey! What area interests you most:\n\n• Stock Market\n• Life Insurance\n• Real Estate",
      help: "🌟 I'd be happy to assist! Here are our main services:\n\n1. Stock Market Investments\n2. Life Insurance Planning\n3. Real Estate Opportunities\n\nWhat would you like to explore?",
    };

    const inputLower = input.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (inputLower.includes(key)) {
        return response;
      }
    }
    
    return "🤝 I'm here to help with your investment journey! Would you like to learn about:\n\n• Stock Market Strategies\n• Life Insurance Planning\n• Real Estate Investments\n\nJust let me know what interests you!";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = { text: getBotResponse(inputText.toLowerCase()), isBot: true };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Investment Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-500 p-1 rounded-full transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.isBot ? 'text-left' : 'text-right'}`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                    msg.isBot
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
