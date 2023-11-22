"use client"
import React, { useState } from 'react';

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModalComponent: React.FC<Props> = ({ title, isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-[95%] max-w-lg">
        <h2 className="text-xl mb-4">{title}</h2>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
          placeholder={`Write your ${title.toLowerCase()} here...`}
        />
        <button onClick={onClose} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  );
};

export default FeedbackModalComponent;
