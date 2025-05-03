import React, { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { variants } from '../../utils/animations';

interface ApiKeyStepProps {
  formData: { apiKey: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  verifyApiKey: () => void;
  isKeyValid: boolean | null;
  setIsKeyValid: (isValid: boolean | null) => void;
  darkMode: boolean;
  getFormContainerClasses: () => string;
  getFormContainerStyles: () => React.CSSProperties;
  getTextGlowClasses: () => string;
  getInputFocusRingColor: () => string;
  getButtonGlowClasses: () => string;
}

const ApiKeyStep: React.FC<ApiKeyStepProps> = ({
  formData,
  handleChange,
  verifyApiKey,
  isKeyValid,
  setIsKeyValid,
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
      verifyApiKey();
    }
  };

  // Track verification state
  const [isVerifying, setIsVerifying] = React.useState(false);

  // Wrapped verify function to handle loading state
  const handleVerify = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    
    // Call the actual verify function
    verifyApiKey();
    
    // Set a timeout to reset the loading state in case the API call takes too long
    setTimeout(() => {
      setIsVerifying(false);
    }, 10000); // 10 second timeout as a fallback
  };

  // Reset loading state when isKeyValid changes
  React.useEffect(() => {
    if (isKeyValid !== null) {
      setIsVerifying(false);
    }
  }, [isKeyValid]);

  return (
    <motion.div
      key="api-key-step"
      custom={1}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', duration: 0.5 }}
      className={`absolute inset-0 p-8 flex flex-col justify-center ${getFormContainerClasses()}`}
      style={getFormContainerStyles()}
    >
      <h2 className={`text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 ${darkMode ? getTextGlowClasses() : ''}`}>Enter your API key</h2>
      <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Connect to OpenAI services</p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <input
            type="password"
            name="apiKey"
            value={formData.apiKey}
            onChange={(e) => {
              handleChange(e);
              setIsKeyValid(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="sk-..."
            className={`flex-1 p-4 rounded-xl border ${darkMode ? 'bg-[#1a2030]/70 border-gray-700 text-white' : 'bg-white/70 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${getInputFocusRingColor()} shadow-sm transition-all duration-300 ${isKeyValid === false ? 'border-red-500' : ''}`}
            autoFocus
          />
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className={`bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-sm min-w-[100px] flex items-center justify-center ${darkMode ? getButtonGlowClasses() : ''} hover:scale-105 ${isVerifying ? 'opacity-90 cursor-wait' : ''}`}
          >
            {isVerifying ? (
              <Loader2 size={24} className="animate-spin" />
            ) : isKeyValid === true ? (
              <Check size={24} />
            ) : isKeyValid === false ? (
              <X size={24} />
            ) : (
              'Verify'
            )}
          </button>
        </div>
        
        {isKeyValid === false && (
          <p className="text-red-500 text-sm">Your API key is invalid. Please check and try again.</p>
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Enter your OpenAI API key to continue.
        </p>
      </div>
    </motion.div>
  );
};

export default ApiKeyStep;