import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ChatBubbleLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';



const socket = io();

const faqData = [
  { question: "What services do you offer?", answer: "We offer a variety of web development and design services." },
  { question: "How can I contact support?", answer: "You can reach us via email at support@example.com." },
  { question: "What is your refund policy?", answer: "We have a 30-day refund policy for all services." },
  // Add more FAQs here
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: "Hello! How can I assist you today?" }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isHandover, setIsHandover] = useState(false);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = { from: 'user', text: inputMessage };
    setMessages((prev) => [...prev, userMessage]);

    if (!isHandover) {
      // Bot handling before handover
      handleBotResponse(inputMessage);
    } else {
      // After handover, send the message to the admin via socket
      socket.emit('sendMessage', userMessage);
    }

    setInputMessage(''); // Reset input field
  };

  const handleBotResponse = (userInput: string) => {
    // Find a matching FAQ response
    const response = faqData.find((faq) => userInput.toLowerCase().includes(faq.question.toLowerCase()));

    if (response) {
      // If an FAQ match is found
      const botMessage = { from: 'bot', text: response.answer };
      setMessages((prev) => [...prev, botMessage]);
    } else if (userInput.toLowerCase().includes("talk to admin")) {
      // Trigger admin handover
      const botMessage = { from: 'bot', text: "Okay, I'm connecting you to an admin. Please wait a moment..." };
      setMessages((prev) => [...prev, botMessage]);
      setIsHandover(true); // Mark handover to admin
      socket.emit('sendMessage', { from: 'bot', text: "Admin is taking over the conversation." });
    } else {
      // Provide a fallback response or escalate
      const botMessage = { from: 'bot', text: "I'm not sure about that. Would you like to speak with an admin?" };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-white shadow-2xl rounded-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h3 className="text-lg font-semibold">Chat Assistant</h3>
            <button onClick={toggleChat}>
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-gray-50 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-lg transition hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-blue-500 to-blue-700 p-3 rounded-full shadow-lg text-white transition-transform transform hover:scale-110"
        >
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
