import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, FileText } from 'lucide-react';
import { FormStep } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  currentStep: FormStep;
  getGradientClasses: () => string;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, currentStep, getGradientClasses }) => {
  return (
    <header className={`w-full py-6 px-4 ${darkMode ? 'bg-[#0f1520]/80' : 'bg-white/90'} backdrop-blur-md shadow-lg sticky top-0 z-10 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto max-w-6xl flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <div className={`absolute inset-0 rounded-xl blur-md ${getGradientClasses()} opacity-70`}></div>
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl ${darkMode ? 'bg-[#0f1520]' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-lg`}>
              <FileText className={`${currentStep === FormStep.NAME ? 'text-emerald-500' : 
                                  currentStep === FormStep.EMAIL ? 'text-teal-500' : 
                                  currentStep === FormStep.API_KEY ? 'text-cyan-500' : 
                                  currentStep === FormStep.CSV_UPLOAD ? 'text-blue-500' : 
                                  'text-indigo-500'}`} size={24} />
            </div>
          </div>
          <div>
            <h1 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 ${darkMode ? 'drop-shadow-[0_0_3px_rgba(16,185,129,0.3)]' : ''}`}>AtoZ MX Writer</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Identify at ease for free</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`px-5 py-2.5 rounded-full hidden sm:flex ${darkMode ? 'bg-[#1a2030]' : 'bg-gray-100'} text-sm font-medium flex items-center gap-2 ${darkMode ? 'border border-gray-800' : ''}`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${getGradientClasses()} text-white text-xs font-bold ${darkMode ? 'shadow-lg' : ''}`}>
              {currentStep + 1}
            </span>
            <span>of {Object.keys(FormStep).length / 2}</span>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-full ${darkMode ? 'bg-[#1a2030] text-yellow-400 hover:bg-[#252a3a] border border-gray-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;