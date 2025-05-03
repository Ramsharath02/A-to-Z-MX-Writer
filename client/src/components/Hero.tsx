import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  darkMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ darkMode }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[60rem] relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-8"
      >
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <span>Identify the domain provider of 1000s of Inboxes at </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600">
            once
          </span>
          <br />
        </h1>
        <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          No need to pay for expensive tools. Just upload your CSV and you are good to GO.
        </p>
      </motion.div>
    </div>
  );
};

export default Hero;