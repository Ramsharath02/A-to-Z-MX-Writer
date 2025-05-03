import React from 'react';
import { motion } from 'framer-motion';

interface CsvDataTableProps {
  csvData: any[] | null;
  csvHeaders: string[];
  formData: { website: string };
  darkMode: boolean;
  getGradientClasses: () => string;
}

const CsvDataTable: React.FC<CsvDataTableProps> = ({ 
  csvData, 
  csvHeaders, 
  formData,
  darkMode,
  getGradientClasses
}) => {
  if (!csvData || csvData.length === 0) return null;

  // Get only the first 5 rows for preview
  const previewData = csvData.slice(0, 5);

  // Format cell value for display
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    
    // Handle Date objects
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    
    // Handle other types
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`max-w-4xl mx-auto mt-12 mb-8 rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-[#0f1520]/80 border border-gray-800' : 'bg-white/90 border border-gray-200'}`}
    >
      <div className={`p-4 ${getGradientClasses()} text-white`}>
        <h3 className="text-xl font-bold">CSV Data Preview</h3>
        <p className="text-sm opacity-80">Showing first 5 rows of your uploaded data</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            <tr>
              {csvHeaders.map((header, index) => (
                <th 
                  key={index} 
                  className={`p-3 text-left text-sm font-medium ${
                    header === formData.website ? 'bg-blue-500/20 text-blue-400' : 
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {header}
                  {header === formData.website && (
                    <span className="ml-2 text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">Selected</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'divide-y divide-gray-800' : 'divide-y divide-gray-200'}`}>
            {previewData.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`${darkMode ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'} transition-colors`}
              >
                {csvHeaders.map((header, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`p-3 text-sm ${
                      header === formData.website ? 'text-blue-400' : 
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {formatCellValue(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className={`p-3 text-center text-xs ${darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
        {csvData.length > 5 ? `Showing 5 of ${csvData.length} rows` : `Showing all ${csvData.length} rows`}
      </div>
    </motion.div>
  );
};

export default CsvDataTable;