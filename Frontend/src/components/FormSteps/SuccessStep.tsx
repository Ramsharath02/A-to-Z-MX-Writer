import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { variants } from '../../utils/animations';

interface SuccessStepProps {
  darkMode: boolean;
  getFormContainerClasses: () => string;
  getFormContainerStyles: () => React.CSSProperties;
  getTextGlowClasses: () => string;
  getButtonGlowClasses: () => string;
  resetForm: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  darkMode,
  getFormContainerClasses,
  getFormContainerStyles,
  getTextGlowClasses,
  getButtonGlowClasses,
  resetForm
}) => {
  return (
    <motion.div
      key="success-step"
      custom={1}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', duration: 0.5 }}
      className={`absolute inset-0 p-8 flex flex-col justify-center items-center text-center ${getFormContainerClasses()}`}
      style={getFormContainerStyles()}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r from-green-400 to-emerald-500 ${darkMode ? 'shadow-lg shadow-green-500/20' : ''}`}>
        <Check size={32} className="text-white" />
      </div>
      
      <h2 className={`text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 ${darkMode ? getTextGlowClasses() : ''}`}>
        Success!
      </h2>
      
      <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        You will receive an email with your personalized data shortly.
      </p>
      
      <button
        onClick={resetForm}
        className={`flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg transition-all duration-300 ${darkMode ? getButtonGlowClasses() : ''} hover:scale-105 w-full`}
      >
        <ArrowLeft size={20} />
        Start Over
      </button>
    </motion.div>
  );
};

export default SuccessStep;