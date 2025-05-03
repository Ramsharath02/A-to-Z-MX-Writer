import React, { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { variants } from '../../utils/animations';

interface EmailStepProps {
  formData: { email: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  darkMode: boolean;
  getFormContainerClasses: () => string;
  getFormContainerStyles: () => React.CSSProperties;
  getTextGlowClasses: () => string;
  getInputFocusRingColor: () => string;
  getButtonGlowClasses: () => string;
}

const EmailStep: React.FC<EmailStepProps> = ({
  formData,
  handleChange,
  handleNext,
  darkMode,
  getFormContainerClasses,
  getFormContainerStyles,
  getTextGlowClasses,
  getInputFocusRingColor,
  getButtonGlowClasses
}) => {
  // Handle Enter key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <motion.div
      key="email-step"
      custom={1}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', duration: 0.5 }}
      className={`absolute inset-0 p-8 flex flex-col justify-center ${getFormContainerClasses()}`}
      style={getFormContainerStyles()}
    >
      <h2 className={`text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 ${darkMode ? getTextGlowClasses() : ''}`}>What's your email?</h2>
      <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>We'll keep your data secure</p>
      <div className="flex gap-3">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Email Address"
          className={`flex-1 p-4 rounded-xl border ${darkMode ? 'bg-[#1a2030]/70 border-gray-700 text-white' : 'bg-white/70 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${getInputFocusRingColor()} shadow-sm transition-all duration-300`}
          autoFocus
        />
        <button
          onClick={handleNext}
          className={`bg-gradient-to-r from-teal-400 to-cyan-500 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-sm ${darkMode ? getButtonGlowClasses() : ''} hover:scale-105`}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </motion.div>
  );
};

export default EmailStep;