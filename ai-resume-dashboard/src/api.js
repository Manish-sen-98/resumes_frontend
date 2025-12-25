    import axios from 'axios';

   
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
   
    const response = await api.get('/export-data'); 
    
    const jsonData = response.data;

    
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      alert("No data found to export.");
      return;
    }

    const headers = Object.keys(jsonData[0]);
    
    const csvRows = [];
    
    // Add the header row
    csvRows.push(headers.join(','));

   
    for (const row of jsonData) {
      const values = headers.map(header => {
        const val = row[header];
        
        const safeVal = val === null || val === undefined ? '' : String(val);
        const escaped = safeVal.replace(/"/g, '""'); 
        return `"${escaped}"`; 
      });
      csvRows.push(values.join(','));
    }

    
    const csvString = csvRows.join('\n');

    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Resume_Database.csv');
    document.body.appendChild(link);
    link.click();
    
   
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    alert("Download failed. Check console for details.");
    console.error("Export Error:", error);
  }
};
