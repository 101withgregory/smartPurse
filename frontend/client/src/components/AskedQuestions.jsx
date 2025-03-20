import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChevronDown, ChevronUp } from "lucide-react"; // For dropdown icons

const AskedQuestions = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is VaultFund?",
      answer:
        "VaultFund is a fintech platform designed to help community savings groups, clubs, and informal investment circles manage their finances securely and transparently.",
    },
    {
      question: "How does VaultFund prevent fraud?",
      answer:
        "VaultFund uses advanced fraud detection techniques, including anomaly detection powered by semi-supervised and unsupervised learning, to identify irregular transactions and protect group funds.",
    },
    {
      question: "Who can use VaultFund?",
      answer:
        "VaultFund is designed for savings groups, investment clubs, and informal financial circles looking for a secure way to manage collective funds.",
    },
    {
      question: "How can I track my contributions and expenses?",
      answer:
        "VaultFund provides real-time tracking, allowing members to monitor their contributions, expenses, and overall group fund balance instantly.",
    },
    {
      question: "Is my money safe with VaultFund?",
      answer:
        "Yes, VaultFund prioritizes security through fraud detection, encryption, and transparent financial records to ensure funds are managed safely.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "VaultFund supports multiple payment options, including bank transfers, mobile money, and digital wallets.",
    },
    {
      question: "Can I create multiple savings groups?",
      answer:
        "Yes, users can create and manage multiple savings groups within the platform, each with its own members and financial tracking.",
    },
    {
      question: "How does VaultFund support financial inclusion?",
      answer:
        "VaultFund helps users underserved by traditional banks by providing a digital-first solution for group savings and investments, making financial management accessible to all.",
    },
    {
      question: "Is VaultFund available on mobile?",
      answer:
        "Yes, VaultFund is a web-based platform optimized for both desktop and mobile use, ensuring accessibility anytime, anywhere.",
    },
    {
      question: "How do I get started with VaultFund?",
      answer:
        "Simply sign up on our platform, create or join a savings group, and start managing your funds with transparency and security.",
    },
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container py-5" data-aos="fade-up">
      <h2 className="text-center mb-4" style={{ color: "#058fc3" }}>
        FAQ's
      </h2>
      <p className="text-center mb-5">
        Find answers to some of the most frequently asked questions about our
        services. If you have more questions, feel free to contact us.
      </p>
      <div className="row">
        {faqs.map((faq, index) => (
          <div className="col-lg-6 mb-4" key={index}>
            <div
              className="card shadow-sm border-0"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#f8f9fa",
              }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                  fontWeight: "bold",
                }}
                onClick={() => toggleAnswer(index)}
              >
                <span>{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
              {activeIndex === index && (
                <div className="card-body">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AskedQuestions;
