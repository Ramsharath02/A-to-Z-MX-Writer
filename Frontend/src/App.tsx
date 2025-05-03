import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';

// Types
import { FormStep, FormData } from './types';

// Components
import Header from './components/Header';
import Background from './components/Background';
import NameStep from './components/FormSteps/NameStep';
import EmailStep from './components/FormSteps/EmailStep';
import CsvUploadStep from './components/FormSteps/CsvUploadStep';
import FinalStep from './components/FormSteps/FinalStep';
import SuccessStep from './components/FormSteps/SuccessStep';
import Faq from './components/Faq';
import Hero from './components/Hero';
import CsvDataTable from './components/CsvDataTable';
import { sendPersonalizationData } from './services/api';

function App() {
  // State
  const [darkMode, setDarkMode] = useState(true);
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.NAME);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    website: '',
    csvName: '',
  });
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formContentHeight, setFormContentHeight] = useState<boolean | null>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [rawCsvString, setRawCsvString] = useState<string | null>(null);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for CSV error events
  useEffect(() => {
    const handleCsvError = (event: CustomEvent) => {
      toast.error(event.detail.message);
    };

    window.addEventListener('csv-error', handleCsvError as EventListener);

    return () => {
      window.removeEventListener('csv-error', handleCsvError as EventListener);
    };
  }, []);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setCurrentStep(FormStep.NAME);
    setFormData({
      name: '',
      email: '',
      website: '',
      csvName: '',
    });
    setCsvData([]);
    setCsvHeaders([]);
    setRawCsvString(null);
  };

  // Move to next step
  const handleNext = () => {
    if (currentStep === FormStep.NAME && !formData.name) {
      toast.error('Please enter your full name');
      return;
    }

    if (currentStep === FormStep.EMAIL && !validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (currentStep === FormStep.CSV_UPLOAD && !csvData) {
      toast.error('Please upload a CSV file');
      return;
    }

    if (currentStep === FormStep.EMAIL) {
      setFormContentHeight(false);
    }

    setCurrentStep((prev) => prev + 1);
  };

  // Validate email format
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle CSV upload
  const handleCSVUpload = (data: any[], fileInfo: File) => {
    if (data.length === 0) {
      toast.error('The CSV file is empty or invalid');
      return;
    }

    // Store the raw CSV string for later parsing
    if (fileInfo && fileInfo instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setRawCsvString(e.target.result as string);
        }
      };
      reader.readAsText(fileInfo);
    }

    // Process the data
    const processedData = data.map((row) => {
      // Create a new object with trimmed values
      const newRow: Record<string, any> = {};
      Object.keys(row).forEach((key) => {
        const trimmedKey = key.trim();
        if (typeof row[key] === 'string') {
          newRow[trimmedKey] = row[key].trim();
        } else {
          newRow[trimmedKey] = row[key];
        }
      });
      return newRow;
    });

    setCsvData(processedData);

    // Extract headers from the first row
    const headers = Object.keys(processedData[0]);
    setCsvHeaders(headers);

    toast.success(`File uploaded successfully!`);

    setCurrentStep((prev) => prev + 1);
  };

  // Submit form
  const handleSubmit = () => {
    if (!formData.website) {
      toast.error('Please select a website column');
      return;
    }

    if (!formData.csvName) {
      toast.error('Please enter a name for your CSV file');
      return;
    }

    if (!csvData) {
      console.error('Please upload a CSV file');
      return;
    }

    // Navigate immediately to success step
    setCurrentStep(FormStep.SUCCESS);

    // Process in background
    try {
      let processedData;

      if (rawCsvString) {
        const parseResult = Papa.parse(rawCsvString, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          quoteChar: '"',
          escapeChar: '"',
          trimHeaders: true,
          transformHeader: (header) => header.trim(),
        });

        if (parseResult.errors && parseResult.errors.length > 0) {
          console.warn('CSV parsing warnings:', parseResult.errors);
        }

        processedData = parseResult.data;
      } else {
        processedData = csvData;
      }

      processedData = processedData?.map((row) => {
        const newRow = { ...row };
        newRow.Website = row[formData.website];
        return newRow;
      });

      // Send data to the personalization webhook
      sendPersonalizationData(formData, processedData || [])
        .then(() => {
          console.log('Data submitted successfully');
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
        });
    } catch (error) {
      console.error('Error processing data:', error);
    }
  };

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Get gradient classes based on current step
  const getGradientClasses = () => {
    const gradients = [
      'bg-gradient-to-r from-emerald-400 to-teal-500',
      'bg-gradient-to-r from-teal-400 to-cyan-500',
      'bg-gradient-to-r from-blue-400 to-indigo-500',
      'bg-gradient-to-r from-indigo-400 to-violet-500',
      'bg-gradient-to-r from-green-400 to-emerald-500',
    ];

    return gradients[currentStep];
  };

  // Get button glow classes based on current step (only in dark mode)
  const getButtonGlowClasses = () => {
    if (!darkMode) return '';

    const glows = [
      'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      'shadow-[0_0_15px_rgba(45,212,191,0.5)]',
      'shadow-[0_0_15px_rgba(96,165,250,0.5)]',
      'shadow-[0_0_15px_rgba(139,92,246,0.5)]',
      'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    ];

    return glows[currentStep];
  };

  // Get text glow classes based on current step (only in dark mode)
  const getTextGlowClasses = () => {
    if (!darkMode) return '';

    const glows = [
      'text-shadow-emerald',
      'text-shadow-teal',
      'text-shadow-blue',
      'text-shadow-indigo',
      'text-shadow-emerald',
    ];

    return glows[currentStep];
  };

  // Get form step container classes based on dark mode
  const getFormContainerClasses = () => {
    if (darkMode) {
      return 'backdrop-blur-md bg-[#0f1520]/40 border border-gray-800/50 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]';
    } else {
      return 'bg-white shadow-md border border-gray-200';
    }
  };

  // Get form step container styles based on dark mode
  const getFormContainerStyles = () => {
    if (darkMode) {
      return {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      };
    }
    return {};
  };

  // Get input focus ring color based on current step
  const getInputFocusRingColor = () => {
    const colors = [
      'focus:ring-emerald-400/70 dark:focus:ring-emerald-400/50',
      'focus:ring-teal-400/70 dark:focus:ring-teal-400/50',
      'focus:ring-blue-400/70 dark:focus:ring-blue-400/50',
      'focus:ring-indigo-400/70 dark:focus:ring-indigo-400/50',
      'focus:ring-green-400/70 dark:focus:ring-green-400/50',
    ];

    return colors[currentStep];
  };

  // FAQ data
  const faqData = [
    {
      question: 'What file formats are supported for upload?',
      answer:
        'Currently, our platform supports CSV (Comma Separated Values) files. Make sure your CSV file has headers in the first row, as these will be used to identify columns. The system automatically detects columns for filtering purposes.',
    },
    {
      question: 'How is my data processed and stored?',
      answer:
        'Your uploaded CSV data is processed in your browser and is not permanently stored on our servers. Once you close the session, the data is cleared. For persistent storage, you would need to submit the form, at which point only your selected data points would be saved according to our privacy policy.',
    },
  ];

  return (
    <div className="relative min-h-screen transition-colors duration-300 dark:bg-[#0a0a0a] bg-[#f8f9fa] text-gray-900 dark:text-white overflow-hidden">
      <Background darkMode={darkMode} getGradientClasses={getGradientClasses} />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: darkMode ? '#2d3748' : '#ffffff',
            color: darkMode ? '#ffffff' : '#1a202c',
            borderRadius: '0.5rem',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      />

      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentStep={currentStep}
        getGradientClasses={getGradientClasses}
      />

      <Hero darkMode={darkMode} />

      <div className="container mx-auto px-4 pt-0 pb-2 relative z-10">
        <div
          className={`rounded-2xl overflow-hidden max-w-lg mx-auto shadow-2xl transition-all duration-300 backdrop-blur-sm ${
            darkMode
              ? 'bg-[#0f1520]/80 border border-gray-800'
              : 'bg-white/90 border border-gray-200'
          }`}
        >
          <div className="w-full h-2 bg-gray-300/30 dark:bg-gray-700/30">
            <div
              className={`h-full transition-all duration-500 ease-in-out ${getGradientClasses()} ${
                darkMode ? 'shadow-[0_0_10px_rgba(0,0,0,0.3)]' : ''
              }`}
              style={{
                width: `${((currentStep + 1) / (Object.keys(FormStep).length / 2)) * 100}%`,
              }}
            ></div>
          </div>

          <div
            className={`p-8 relative overflow-hidden h-[400px]`}
          >
            <AnimatePresence initial={false} mode="wait">
              {currentStep === FormStep.NAME && (
                <NameStep
                  formData={formData}
                  handleChange={handleChange}
                  handleNext={handleNext}
                  darkMode={darkMode}
                  getFormContainerClasses={getFormContainerClasses}
                  getFormContainerStyles={getFormContainerStyles}
                  getTextGlowClasses={getTextGlowClasses}
                  getInputFocusRingColor={getInputFocusRingColor}
                  getButtonGlowClasses={getButtonGlowClasses}
                />
              )}

              {currentStep === FormStep.EMAIL && (
                <EmailStep
                  formData={formData}
                  handleChange={handleChange}
                  handleNext={handleNext}
                  darkMode={darkMode}
                  getFormContainerClasses={getFormContainerClasses}
                  getFormContainerStyles={getFormContainerStyles}
                  getTextGlowClasses={getTextGlowClasses}
                  getInputFocusRingColor={getInputFocusRingColor}
                  getButtonGlowClasses={getButtonGlowClasses}
                />
              )}

              {currentStep === FormStep.CSV_UPLOAD && (
                <CsvUploadStep
                  handleCSVUpload={handleCSVUpload}
                  csvData={csvData}
                  darkMode={darkMode}
                  getFormContainerClasses={getFormContainerClasses}
                  getFormContainerStyles={getFormContainerStyles}
                  getTextGlowClasses={getTextGlowClasses}
                  getInputFocusRingColor={getInputFocusRingColor}
                  getButtonGlowClasses={getButtonGlowClasses}
                  handleNext={handleNext}
                />
              )}

              {currentStep === FormStep.FINAL && (
                <FinalStep
                  formData={formData}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  csvHeaders={csvHeaders}
                  darkMode={darkMode}
                  getFormContainerClasses={getFormContainerClasses}
                  getFormContainerStyles={getFormContainerStyles}
                  getTextGlowClasses={getTextGlowClasses}
                  getInputFocusRingColor={getInputFocusRingColor}
                  getButtonGlowClasses={getButtonGlowClasses}
                  sendPersonalizationData={sendPersonalizationData}
                  csvData={csvData}
                  isSubmitting={isSubmitting}
                />
              )}

              {currentStep === FormStep.SUCCESS && (
                <SuccessStep
                  darkMode={darkMode}
                  getFormContainerClasses={getFormContainerClasses}
                  getFormContainerStyles={getFormContainerStyles}
                  getTextGlowClasses={getTextGlowClasses}
                  getButtonGlowClasses={getButtonGlowClasses}
                  resetForm={resetForm}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {csvData && currentStep !== FormStep.SUCCESS && (
          <CsvDataTable
            csvData={csvData}
            csvHeaders={csvHeaders}
            formData={formData}
            darkMode={darkMode}
            getGradientClasses={getGradientClasses}
          />
        )}

        <Faq
          faqData={faqData}
          expandedFaq={expandedFaq}
          toggleFaq={toggleFaq}
          darkMode={darkMode}
          getGradientClasses={getGradientClasses}
        />
      </div>
    </div>
  );
}

export default App;