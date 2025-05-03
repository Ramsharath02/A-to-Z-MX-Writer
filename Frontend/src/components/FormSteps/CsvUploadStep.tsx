import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight } from 'lucide-react';
import CSVReader from 'react-csv-reader';
import { variants } from '../../utils/animations';

interface CsvUploadStepProps {
  csvData: any[] | null;
  handleCSVUpload: (data: any[], fileInfo: any) => void;
  handleNext: () => void;
  darkMode: boolean;
  getFormContainerClasses: () => string;
  getFormContainerStyles: () => React.CSSProperties;
  getTextGlowClasses: () => string;
  getInputFocusRingColor: () => string;
  getButtonGlowClasses: () => string;
}

const CsvUploadStep: React.FC<CsvUploadStepProps> = ({
  csvData,
  handleCSVUpload,
  handleNext,
  darkMode,
  getFormContainerClasses,
  getFormContainerStyles,
  getTextGlowClasses,
  getButtonGlowClasses
}) => {
  // Handle CSV upload with row limit check
  const handleCsvUpload = (data: any[], fileInfo: any) => {
    try {
      // Check if the CSV has more than 20,000 rows
      if (data.length > 200000) {
        const errorEvent = new CustomEvent('csv-error', { 
          detail: { message: 'CSV file exceeds the 20,000 row limit. Please upload a smaller file.' } 
        });
        window.dispatchEvent(errorEvent);
        return;
      }

      // Validate data structure
      if (!data || !Array.isArray(data) || data.length === 0) {
        const errorEvent = new CustomEvent('csv-error', { 
          detail: { message: 'Invalid CSV file format or empty file.' } 
        });
        window.dispatchEvent(errorEvent);
        return;
      }

      // Clean and validate the data
      const cleanedData = data.map(row => {
        const cleanRow: Record<string, any> = {};
        Object.entries(row).forEach(([key, value]) => {
          const cleanKey = key.trim();
          if (typeof value === 'string') {
            cleanRow[cleanKey] = value.trim();
          } else {
            cleanRow[cleanKey] = value;
          }
        });
        return cleanRow;
      });

      // If within limits and valid, proceed with upload
      handleCSVUpload(cleanedData, fileInfo);
    } catch (error) {
      console.error('Error processing CSV:', error);
      const errorEvent = new CustomEvent('csv-error', { 
        detail: { message: 'Error processing CSV file. Please check the file format.' } 
      });
      window.dispatchEvent(errorEvent);
    }
  };

  return (
    <motion.div
      key="csv-upload-step"
      custom={1}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', duration: 0.5 }}
      className={`absolute inset-0 p-8 flex flex-col justify-center ${getFormContainerClasses()}`}
      style={getFormContainerStyles()}
    >
      <h2 className={`text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 ${darkMode ? getTextGlowClasses() : ''}`}>Upload your CSV file</h2>
      <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>We'll extract the data for you</p>
      <div className="flex flex-col gap-4">
        <div className={`border-2 border-dashed rounded-xl p-2 text-center backdrop-blur-sm ${darkMode ? 'border-gray-700 bg-[#1a2030]/30' : 'border-gray-300 bg-white/30'} hover:border-blue-400 dark:hover:border-indigo-400 transition-colors cursor-pointer mb-4 shadow-sm ${darkMode ? 'hover:shadow-[0_0_15px_rgba(96,165,250,0.2)]' : ''}`}>
          <CSVReader
            onFileLoaded={handleCsvUpload}
            parserOptions={{ 
              header: true,
              skipEmptyLines: true,
              dynamicTyping: true,
              quoteChar: '"',
              escapeChar: '"',
              trimHeaders: true,
              transformHeader: (header: string) => header.trim()
            }}
            cssClass="hidden"
            inputId="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 ${darkMode ? 'shadow-lg' : ''}`}>
              <Upload size={20} className="text-white" />
            </div>
            <p className="mb-1 font-medium text-lg">Upload CSV file</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {csvData ? 'File uploaded successfully!' : 'Click to browse or drag and drop'}
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Maximum 20,000 rows allowed
            </p>
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default CsvUploadStep;