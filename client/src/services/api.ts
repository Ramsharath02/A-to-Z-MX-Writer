export const sendPersonalizationData = async (
  formData: any,
  csvData: any[]
): Promise<any> => {
  try {
    if (!formData.email || !formData.csvName || !csvData.length) {
      console.error("Missing required fields:", formData, csvData);
      return;
    }

    // Convert JSON to CSV
    console.log("CSV Data before conversion:", csvData);
    if (!csvData || csvData.length === 0) {
      console.error("CSV data is empty. Cannot create file.");
      return;
    }

    const csvContent = convertJsonToCsv(csvData);
    if (!csvContent) {
      console.error("CSV content is empty. Cannot create file.");
      return;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const file = new File([blob], `${formData.csvName || "data"}.csv`, { type: "text/csv" });

    console.log("Generated file object:", file);


    // Prepare FormData
    const form = new FormData();
    form.append("email", formData.email);
    form.append("name", formData.name);
    form.append("csvName", formData.csvName);
    form.append("file", file);

    if (!formData.csvName || !file) {
      console.error("csvName or file is missing:", formData.csvName, file);
      return;
    }

    console.log("FormData before sending:", Array.from(form.entries())); // ✅ Debugging Log

    // Send request to the API endpoint
    const response = await fetch(
      'https://mxapi.atozemails.com/api/upload-csv',
      // 'http://localhost:5000/api/upload-csv',
      {
        method: 'POST',
        body: form,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    console.log('Response received:', response);

    // Try to parse as JSON, fallback to text if parsing fails
    try {
      const text = await response.text(); // read once
      try {
        const data = JSON.parse(text); // attempt to parse JSON
        return data;
      } catch (parseError) {
        return { message: text }; // return raw text if not JSON
      }
    } catch (e) {
      console.error("Error reading response body:", e);
      return { message: "Failed to read response body" };
    }

  } catch (error) {
    console.error('Error sending data to personalization webhook:', error);
    throw error;
  }
};

/**
 * Converts a JSON array to a CSV string with proper escaping and handling of special characters
 */
const convertJsonToCsv = (jsonData: any[]): string => {

  if (!jsonData.length) return '';

  // Get headers and ensure they're properly escaped
  const headers = Object.keys(jsonData[0])
    .map((header) => `"${header.replace(/"/g, '""')}"`)
    .join(',');

  // Convert rows to CSV format with proper escaping
  const rows = jsonData.map((row) =>
    Object.values(row)
      .map((value) => {
        if (value === null || value === undefined) return '""';
        if (typeof value === 'string') {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`;
        }
        return `"${value}"`;
      })
      .join(',')
  );

  return [headers, ...rows].join('\n');
};