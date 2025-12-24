    import axios from 'axios';

    // ⚠️ IMPORTANT: If your backend is on Render/Koyeb, change this URL!
    // Example: const API_URL = 'https://ai-resume-backend.koyeb.app';
    const API_URL = 'https://ideological-daniella-manish-sen-1fd1b91e.koyeb.app'; 

    export const api = axios.create({ baseURL: API_URL });

    export const uploadFiles = async (files) => {
        console.log("upload triggered")
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    
    console.log(formData)
    return await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    };

 export const downloadCSV = async () => {
  try {
    // 1. Fetch JSON data (Remove 'responseType: blob')
    // Make sure the URL matches your backend endpoint (e.g., /export-data or /export-csv)
    const response = await api.get('/export-data'); 
    
    const jsonData = response.data;

    // Check if we actually have data
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      alert("No data found to export.");
      return;
    }

    // 2. Convert JSON to CSV String
    // Get headers from the first object keys (e.g., "name", "email", "score")
    const headers = Object.keys(jsonData[0]);
    
    const csvRows = [];
    
    // Add the header row
    csvRows.push(headers.join(','));

    // Loop through rows and format values
    for (const row of jsonData) {
      const values = headers.map(header => {
        const val = row[header];
        // Handle missing values and escape quotes for CSV format
        const safeVal = val === null || val === undefined ? '' : String(val);
        const escaped = safeVal.replace(/"/g, '""'); 
        return `"${escaped}"`; // Wrap in quotes
      });
      csvRows.push(values.join(','));
    }

    // Join all rows with newlines
    const csvString = csvRows.join('\n');

    // 3. Create a Blob from the CSV String and Download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Resume_Database.csv');
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    alert("Download failed. Check console for details.");
    console.error("Export Error:", error);
  }
};