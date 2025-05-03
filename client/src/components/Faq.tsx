import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FaqProps {
  darkMode: boolean;
  expandedFaq: number | null;
  toggleFaq: (index: number) => void;
  faqData: Array<{ question: string; answer: string }>;
  getGradientClasses: () => string;
}

const Faq: React.FC<FaqProps> = ({ darkMode, expandedFaq, toggleFaq, faqData, getGradientClasses }) => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mb-12"
      >
        <h2 className={`text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 ${darkMode ? 'text-shadow-md' : ''}`}>Frequently Asked Questions</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-xl mx-auto`}>
          Find answers to common questions about our MX Excluder tool
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            className={`rounded-xl overflow-hidden transition-all duration-300 ${darkMode ? 'bg-[#0f1520]/60 border border-gray-800/50' : 'bg-white border border-gray-200'} shadow-lg`}
          >
            <button
              onClick={() => toggleFaq(index)}
              className={`w-full p-5 text-left flex justify-between items-center ${darkMode ? 'hover:bg-[#1a2030]/50' : 'hover:bg-gray-50'} transition-colors duration-200`}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              />
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? 'max-h-96' : 'max-h-0'}`}
            >
              <div className={`p-5 border-t ${darkMode ? 'border-gray-800/50' : 'border-gray-200'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {faq.answer}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className={`mt-16 pt-8 border-t ${darkMode ? 'border-gray-800/50 text-gray-500' : 'border-gray-200 text-gray-600'} text-center text-sm`}>
        <p>© 2025 Atozemails.com. All rights reserved.</p>
        <p className="mt-2">Atozemails: Building modern outboundsolutions. </p>
      </div>
    </div>
  );
};

export default Faq;