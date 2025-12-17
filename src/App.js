import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import WritePage from './pages/WritePage';
import AboutPage from './pages/AboutPage';
import { Heart, Globe, Mail, Send } from 'lucide-react';

const INITIAL_MESSAGES = [
  { id: 1, to: "Dushara", from: "Best Friend", text: "Hey buddy, remember that trip to Ella? Keep smiling!", type: "person", private: true, hint: "Where did we first meet?", image: null, password: "123" },
  { id: 2, to: "Everyone", from: "Dushara K.", text: "This project was built with so much love...", type: "world", private: false, image: null },
  { id: 3, to: "My Daughter", from: "Dad", text: "Read this when you turn 18. I am so proud of you.", type: "family", private: true, hint: "Our dog's name", image: null, password: "dog" },
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [allMessages, setAllMessages] = useState([...INITIAL_MESSAGES]);

  const handleAddMessage = (newMessage) => {
    setAllMessages(prev => [newMessage, ...prev]);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home setPage={setCurrentPage} />;
      case 'search': return <SearchPage messages={allMessages} />;
      case 'write': return <WritePage setPage={setCurrentPage} onAddMessage={handleAddMessage} />;
      case 'about': return <AboutPage setPage={setCurrentPage} />;
      default: return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar bg-glass">
        <div className="container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <div className="logo" onClick={() => setCurrentPage('home')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Heart fill="#ff758c" color="#ff758c" />
            <span style={{ fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(45deg, #ff758c, #ff7eb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TellYouSomeday</span>
          </div>

          <div className="desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage('home')}>Home</span>
            <span className={`nav-link ${currentPage === 'write' ? 'active' : ''}`} onClick={() => setCurrentPage('write')}>Write</span>
            <span className={`nav-link ${currentPage === 'search' ? 'active' : ''}`} onClick={() => setCurrentPage('search')}>Search</span>
            <span className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} onClick={() => setCurrentPage('about')}>About</span>
          </div>
        </div>
      </nav>

      <main>
        {renderPage()}
      </main>

      <footer style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)', borderTop: '1px solid #e0e0e0', padding: '5rem 0 8rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            
            {/* Column 1: Brand & Mission */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#ff758c', padding: '8px', borderRadius: '50%', color: 'white', display: 'flex' }}>
                  <Heart size={20} fill="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2d3436' }}>TellYouSomeday</span>
              </div>
              <p style={{ color: '#636e72', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                A digital sanctuary for your unspoken words. Preserving your legacy and love for the moments that matter most.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['Twitter', 'Facebook', 'Instagram'].map(i => (
                  <div key={i} style={{ 
                    width: 36, height: 36, borderRadius: '50%', background: 'white', 
                    border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ff758c', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseOver={e => {e.currentTarget.style.background = '#ff758c'; e.currentTarget.style.color = 'white'}}
                  onMouseOut={e => {e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#ff758c'}}
                  >
                    <Globe size={16} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#2d3436' }}>Explore</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <span className="footer-link" onClick={() => setCurrentPage('home')}>Home</span>
                <span className="footer-link" onClick={() => setCurrentPage('search')}>Find Messages</span>
                <span className="footer-link" onClick={() => setCurrentPage('write')}>Write Message</span>
                <span className="footer-link" onClick={() => setCurrentPage('about')}>Our Story</span>
              </div>
            </div>

            {/* Column 3: Legal & Support */}
            <div>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#2d3436' }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <span className="footer-link">Help Center</span>
                <span className="footer-link">Privacy Policy</span>
                <span className="footer-link">Terms of Service</span>
                <span className="footer-link">Cookie Policy</span>
              </div>
            </div>

            {/* Column 4: Newsletter/Contact */}
            <div>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#2d3436' }}>Stay Connected</h4>
              <p style={{ color: '#636e72', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Join our community and get inspired by stories of connection.
              </p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  style={{ 
                    width: '100%', padding: '12px 15px', borderRadius: '12px', 
                    border: '1px solid #e0e0e0', outline: 'none', fontSize: '0.9rem',
                    background: 'white'
                  }}
                />
                <button style={{ 
                  position: 'absolute', right: '5px', top: '5px', bottom: '5px',
                  background: '#ff758c', border: 'none', borderRadius: '8px',
                  padding: '0 12px', color: 'white', cursor: 'pointer'
                }}>
                  <Send size={16} />
                </button>
              </div>
            </div>

          </div>

          <div style={{ 
            marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
            color: '#888', fontSize: '0.9rem'
          }}>
            <div>
              © 2025 TellYouSomeday. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              Made with <Heart size={14} fill="#ff758c" color="#ff758c" /> in Sri Lanka
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;