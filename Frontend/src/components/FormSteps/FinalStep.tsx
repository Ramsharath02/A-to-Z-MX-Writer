import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { variants } from '../../utils/animations';
import { sendPersonalizationData } from '../../services/api';
import { toast } from 'react-hot-toast';

interface FinalStepProps {
  formData: { website: string; csvName: string };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  handleSubmit: () => void;
  csvHeaders: string[];
  darkMode: boolean;
  getFormContainerClasses: () => string;
  getFormContainerStyles: () => React.CSSProperties;
  getTextGlowClasses: () => string;
  getInputFocusRingColor: () => string;
  getButtonGlowClasses: () => string;
  sendPersonalizationData: (formData: any, csvData: File) => Promise<any>;
  csvData: File;
  isSubmitting: boolean;
}

const FinalStep: React.FC<FinalStepProps> = ({
  formData,
  handleChange,
  handleSubmit,
  csvHeaders,
  darkMode,
  getFormContainerClasses,
  getFormContainerStyles,
  getTextGlowClasses,
  getInputFocusRingColor,
  getButtonGlowClasses,
  sendPersonalizationData,
  csvData,
  isSubmitting
}) => {
  const handleSubmitWithFeedback = () => {
    toast.success('You will receive an email within 1 minute.');
    handleSubmit();
  };

  return (
    <motion.div
      key="final-step"
      custom={1}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', duration: 0.5 }}
      className={`absolute inset-0 p-8 flex flex-col   justify-center ${getFormContainerClasses()}`}
      style={getFormContainerStyles()}
    >
      <h2 className={`text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500 ${darkMode ? getTextGlowClasses() : ''}`}>Final Details</h2>
      <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Almost there! Just a few more details</p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Select Email Column
          </label>
          <select
            name="website"
            value={formData.website}
            onChange={handleChange}
            className={`p-2 rounded-xl border ${darkMode ? 'bg-[#1a2030]/70 border-gray-700 text-white' : 'bg-white/70 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${getInputFocusRingColor()} shadow-sm transition-all duration-300`}
            disabled={isSubmitting}
          >
            <option value="">Select a column</option>
            {csvHeaders.map((header, index) => (
              <option key={index} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Personalized CSV Name
          </label>
          <input
            type="text"
            name="csvName"
            value={formData.csvName}
            onChange={handleChange}
            placeholder="Enter a name for your CSV"
            className={`p-2 rounded-xl border ${darkMode ? 'bg-[#1a2030]/70 border-gray-700 text-white' : 'bg-white/70 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${getInputFocusRingColor()} shadow-sm transition-all duration-300`}
            disabled={isSubmitting}
          />
        </div>
        
        <button
          onClick={handleSubmitWithFeedback}
          disabled={isSubmitting || !formData.website || !formData.csvName}
          className={`bg-gradient-to-r from-indigo-400 to-violet-500 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${darkMode ? getButtonGlowClasses() : ''} hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              Submit
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default FinalStep;