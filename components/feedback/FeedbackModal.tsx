"use client";

// FeedbackModal.tsx
import React, { useState } from "react";
import FeedbackModalComponent from "./FeedbackModalComponent";
import FeedbackModalComponents from "./FeedbackModalComponents";
import Link from "next/link";
import {usePathname} from "next/navigation";

const FeedbackModal = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showMainModal, setShowMainModal] = useState(true);

  const pathname = usePathname();

  const show = pathname.includes("/chat-ai") || pathname.includes("/dashboard");

  const openModal = (type: string) => {
    setActiveModal(type);
    setShowMainModal(false);
  };

  const closeModal = () => {
    setActiveModal(null);
    setShowMainModal(true);
  };

  const handleModal = () => {
    setModalOpen(!isModalOpen); // Toggle the modal state
  };

  return (
    <>
      {!show && (
        <button
          onClick={handleModal}
          className="fixed -right-8 bottom-32 bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-700 transform rotate-90 z-50"
        >
          Feedback
        </button>
      )}

      {isModalOpen && showMainModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-6 py-4">
          <div className="bg-white p-4 rounded-lg shadow-xl w-[95%] md:max-w-lg">
            <h2 className="text-md md:text-lg text-center dark:text-black mb-4">
              What's the nature of your feedback?
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => openModal("Technical")}
                className="bg-black text-sm md:text-md text-white p-2 rounded-full hover:bg-blue-700 w-full"
              >
                Technical
              </button>
              <button
                onClick={() => openModal("Suggestion")}
                className="bg-black text-sm md:text-md text-white p-2 rounded-full hover:bg-blue-700 w-full"
              >
                Suggestion
              </button>
              <button
                onClick={() => openModal("Bug")}
                className="bg-black text-sm md:text-md text-white p-2 rounded-full hover:bg-blue-700 w-full"
              >
                Bug
              </button>
              <button
                onClick={() => openModal("Something not working")}
                className="bg-black text-sm md:text-md text-white p-2 rounded-full hover:bg-blue-700 w-full"
              >
                Something not working
              </button>
              <button
                onClick={() => openModal("Something else")}
                className="border-2 border-black text-sm md:text-md text-black p-2 rounded-full hover:border-blue-700 w-full"
              >
                Something else
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleModal}
                className="text-red-500 text-sm font-bold"
              >
                Close
              </button>
            </div>
            <div className="pt-2">
              <p className="text-xs dark:text-black">
                <span className="text-red-500 font-bold text-xs pr-1">
                  Note :
                </span>
                Kindly provide your feedback to help us enhance our website.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Modals */}
      <FeedbackModalComponents
        title="Technical"
        isOpen={activeModal === "Technical"}
        onClose={closeModal}
      />
      <FeedbackModalComponent
        title="Suggestion"
        isOpen={activeModal === "Suggestion"}
        onClose={closeModal}
      />
      <FeedbackModalComponents
        title="Bug"
        isOpen={activeModal === "Bug"}
        onClose={closeModal}
      />
      <FeedbackModalComponents
        title="Something not working"
        isOpen={activeModal === "Something not working"}
        onClose={closeModal}
      />
      <FeedbackModalComponent
        title="Something else"
        isOpen={activeModal === "Something else"}
        onClose={closeModal}
      />
    </>
  );
};

export default FeedbackModal;
