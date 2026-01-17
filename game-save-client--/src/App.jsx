import React, { useState, useEffect } from 'react';
import { 
  Upload, Download, Trash2, Search, FolderOpen, HardDrive, 
  Clock, User, HelpCircle, LogOut, Moon, LogIn 
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Make sure this file exists
import Register from './register.jsx';
import Login from './login.jsx';
import { useAuth0 } from "@auth0/auth0-react";


// ==========================================
// 1. SAFE DASHBOARD COMPONENT
// ==========================================
const Dashboard = ({ saves, username, logout, isAuthenticated, searchTerm, setSearchTerm, isUploading, handleFileUpload, handleDelete, handleDownload }) => {
  
 
  const safeSaves = Array.isArray(saves) ? saves : [];

  const filteredSaves = safeSaves.filter(save => {
    
    const name = save.gameName || save.gamename || "Unknown Game";
    const file = save.fileName || save.filename || "Unknown File";
    const search = (searchTerm || "").toLowerCase();
    
    return name.toLowerCase().includes(search) || 
           file.toLowerCase().includes(search);
  });

  return (
   <div className="game-vault">
  <div className="container">
    <header className="header">
      <div className="logo-section">
        <div className="logo-icon"></div>

        <div className="logo-text">
          <h1>Game-o-Valda</h1>
          <p>Game Save Manager</p>
        </div>
      </div>
    </header>


       <section className='hero'> <div className="hero-image"> <img src="public\ghost.png" alt="GHost is invisible" /> </div> <div className="hero-text"> <h1>Hey there!</h1> <p>Welcome to the archives of the unseen. At Game-o-Valda, we believe that no victory should ever be forgotten and no checkpoint left behind. Like a ghost in the machine, our platform silently guards your progress, ensuring that your digital legacy remains immortal even when the screen goes dark. Whether you are battling through retro classics or forging paths in modern RPGs, we provide the ultimate sanctuary for your save files, keeping your achievements alive in the cloud—invisible, yet ever-present.</p> </div> </section>

        {/* Sidebar */}
<div className="sidebar">
  <div className="sidebar-profile">
    <div className="avatar-circle">
      <User size={32} color="white" />
    </div>

    <div className="profile-info">
      <h3>{username ? username : "Guest User"}</h3>
      <span>{username ? "Level 1" : "Not Logged In"}</span>
    </div>
  </div>

  <hr className="divider" />

  <nav className="sidebar-menu">
    <ul>
      {username ? (
        <li>
          <a href="#profile" className="menu-item">
            <User size={20} />
            <span>My Profile</span>
          </a>
        </li>
      ) : (
        <li>
          <Link to="/login" className="menu-item">
            <LogIn size={20} />
            <span>Sign In</span>
          </Link>
        </li>
      )}

      <li>
        <a href="#faq" className="menu-item active">
          <HelpCircle size={20} />
          <span>FAQ & Help</span>
        </a>
      </li>

      <li>
        <a href="#" className="menu-item">
          <Moon size={20} />
          <span>Dark Mode</span>
        </a>
      </li>
    </ul>
  </nav>

  <div className="sidebar-footer">
    {(isAuthenticated || username) && (
      <button
        className="logout-btn"
       onClick={() => {
        
        localStorage.removeItem("activeUser"); 
        
        
        logout({ logoutParams: { returnTo: window.location.origin } });
      }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    )}
  </div>
</div>


        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Total Saves</span>
                <span className="stat-value">{safeSaves.length}</span>
              </div>
              <FolderOpen className="stat-icon" size={36} />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="actions-bar">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <label className="upload-btn">
            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
            {isUploading ? (
              <>
                <div className="spinner"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Upload Save</span>
              </>
            )}
          </label>
        </div>

        {/* Saves Grid */}
        {filteredSaves.length > 0 ? (
          <div className="saves-grid">
            {filteredSaves.map((save) => (
              <div key={save.id} className="save-card">
                <div className="save-header">
                  <div className="save-title">
                    {/* VISIBILITY FIX: Check both spellings */}
                    <h3>{save.gameName || save.gamename || "Unknown Game"}</h3>
                    <p className="file-name">{save.fileName || save.filename}</p>
                  </div>
                  <div className="game-icon"><HardDrive size={24}/></div>
                </div>

                <div className="save-details">
                  <div className="detail-item">
                    <HardDrive size={16} />
                    <span>{save.size}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{save.playtime || "0h"}</span>
                  </div>
                  <div className="detail-item">
                    <span>📅</span>
                    <span>{save.uploadDate ? new Date(save.uploadDate).toLocaleDateString() : "Just now"}</span>
                  </div>
                </div>

                <div className="save-actions">
                  <button className="btn-download" onClick={() => handleDownload(save)}>
                    <Download size={18} />
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(save.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FolderOpen size={64} />
            <h3>No saves found</h3>
            {/* DEBUG INFO: This tells you WHY it is empty */}
            <p style={{fontSize: '12px', color: '#666'}}>
              {Array.isArray(saves) ? `List is empty` : `Error: Server sent bad data`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN GAMEVAULT COMPONENT (Logic)
// ==========================================
export default function GameVault() {
const { user: googleUser, isAuthenticated, logout } = useAuth0();
const [sqlUser, setSqlUser] = useState(localStorage.getItem('activeUser') || "");
const username = isAuthenticated
  ? googleUser?.name
  : sqlUser;
  const dbUsername = sqlUser;
  const [saves, setSaves] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);



  
useEffect(() => {
  const syncGoogleUser = async () => {
    
    if (isAuthenticated && googleUser) {
      try {
        const response = await fetch('http://localhost:5000/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Sync success:", data);
          
          
          localStorage.setItem("activeUser", data.username);
        } else {
          console.error("Sync failed:", await response.text());
        }

      } catch (error) {
        console.error("Network error during sync:", error);
      }
    }
  };

  syncGoogleUser();
}, [isAuthenticated, googleUser]);



 
  const fetchSaves = () => {
    if (!username) return;
    
    fetch(`http://localhost:5000/api/saves?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        // CRITICAL FIX: Only set saves if data is actually an Array!
        if (Array.isArray(data)) {
          console.log("Data Loaded:", data);
          setSaves(data);
        } else {
          console.error("Server returned bad data:", data);
          setSaves([]); // Default to empty list on error
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setSaves([]); 
      });
  };

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchSaves();
  }, [username]);

  // --- UPLOAD HANDLER ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!username) {
      alert("Please login first.");
      return;
    }

    const userGameName = prompt("Enter the name of the game (e.g., Elden Ring):");
    if (!userGameName) return; 

    setIsUploading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('gameName', userGameName);
    formData.append('saveFile', file);

    try {
      const response = await fetch('http://localhost:5000/api/saves', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Upload successful!");
        fetchSaves(); // Refresh list immediately
      } else {
        const err = await response.json();
        alert("Upload failed: " + err.error);
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    } finally {
      setIsUploading(false);
    }
  };

  

  // --- DELETE HANDLER ---
  const handleDelete = async(id) => {
    // Optimistic UI update
    setSaves(prevSaves => prevSaves.filter(save => save.id !== id));
    
    try {
      await fetch(`http://localhost:5000/api/saves/${id}`, { method: 'DELETE' });
    } catch (error) { console.error(error); }
  };

  // --- DOWNLOAD HANDLER ---
  const handleDownload = (save) => {
    if (!username) {
      alert("Please login to download.");
      return;
    }
    window.location.href = `http://localhost:5000/api/saves/${save.id}/download?username=${username}`;  
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Dashboard 
            username={username}
            isAuthenticated={isAuthenticated}
            logout={logout}
            saves={saves}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isUploading={isUploading}
            handleFileUpload={handleFileUpload}
            handleDelete={handleDelete}
            handleDownload={handleDownload}
          />
        } />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}