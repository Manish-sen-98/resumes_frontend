import React, { useState } from 'react';
import { FileText, UploadCloud, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadFiles, downloadCSV } from './api';
import './app.css'; // Make sure this imports your CSS file!

function App() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  const total = resumes.length;
  const avgScore = total > 0 ? Math.round(resumes.reduce((acc, r) => acc + (r.score || 0), 0) / total) : 0;
  
  const handleUpload = async (e) => {
    if (!e.target.files.length) return;
    setLoading(true);
    try {
      const res = await uploadFiles(e.target.files);
      if (res.data.status === "success") {
        setResumes(prev => [...res.data.data, ...prev]);
      }
    } catch (err) {
      alert("Error uploading. Is your Python backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper for dynamic classes
  const getBadgeClass = (category) => {
    if (category?.includes('Web')) return 'badge badge-web';
    if (category?.includes('Data')) return 'badge badge-data';
    return 'badge badge-default';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green';
    if (score < 50) return 'text-red';
    return 'text-amber';
  };

  return (
    <div className="app-container">
      
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">
              <FileText size={20} color="white" />
            </div>
            AI Resume<span className="highlight">Parser</span>
          </div>
          <button onClick={downloadCSV} className="btn-export">
            <Download size={16} /> Export Data
          </button>
        </div>
      </nav>

      <main className="container">
        
        {/* --- HEADER --- */}
        <div className="header-text">
          <h1>Resume Analysis Dashboard</h1>
          <p>Upload PDFs to categorize roles & calculate match scores instantly.</p>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="stats-grid">
          <div className="card">
            <div>
              <p className="card-label">Total Processed</p>
              <h3 className="card-value">{total}</h3>
            </div>
            <div className="icon-circle icon-blue">
              <FileText size={28} />
            </div>
          </div>
          <div className="card">
            <div>
              <p className="card-label">Average Score</p>
              <h3 className="card-value">{avgScore}%</h3>
            </div>
            <div className="icon-circle icon-green">
              <CheckCircle2 size={28} />
            </div>
          </div>
        </div>

        {/* --- UPLOAD SECTION --- */}
        <div className="upload-container">
          <label className={`upload-box ${loading ? 'loading' : ''}`}>
            {loading ? (
              <div style={{textAlign: 'center'}}>
                <Loader2 className="animate-spin" size={32} color="#2563eb" style={{margin:'0 auto 10px'}} />
                <p style={{color: '#2563eb', fontWeight: 'bold'}}>AI is analyzing document...</p>
                <p style={{fontSize: '0.8rem', color: '#94a3b8'}}>Extracting skills & calculating score</p>
              </div>
            ) : (
              <div style={{textAlign: 'center'}}>
                <div style={{background:'#f1f5f9', padding:'1rem', borderRadius:'50%', display:'inline-block', marginBottom:'10px'}}>
                  <UploadCloud size={32} color="#94a3b8" />
                </div>
                <p style={{fontWeight:'600', fontSize:'1.1rem', color:'#334155'}}>Click to Upload Resume</p>
                <p style={{fontSize: '0.9rem', color: '#94a3b8'}}>Supports .pdf files only</p>
              </div>
            )}
            <input type="file" multiple accept=".pdf" className="hidden-input" onChange={handleUpload} disabled={loading} />
          </label>
        </div>

        {/* --- RESULTS TABLE --- */}
        <div className="table-container">
          <div className="table-header">Recent Uploads</div>
          <div style={{overflowX: 'auto'}}>
            <table>
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Predicted Role</th>
                  <th>Match Score</th>
                  <th style={{textAlign: 'right'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((r, i) => (
                  <tr key={i}>
                    <td style={{fontWeight:'500'}}>{r.name || "Unknown"}</td>
                    <td>
                      <span className={getBadgeClass(r.category)}>
                        {r.category}
                      </span>
                    </td>
                    <td>
                      <div style={{display:'flex', alignItems:'center'}}>
                        <span className={`score-text ${getScoreColor(r.score)}`}>
                          {r.score}%
                        </span>
                        <div className="progress-bar-bg">
                          <div 
                            className={`progress-bar-fill ${r.score >= 80 ? 'bg-green' : 'bg-amber'}`} 
                            style={{ width: `${r.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <a href={r.file_path} target="_blank" rel="noreferrer" className="link">
                        View PDF
                      </a>
                    </td>
                  </tr>
                ))}
                {resumes.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <AlertCircle size={32} style={{opacity: 0.2, margin:'0 auto'}} />
                        <p>No candidates found yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;