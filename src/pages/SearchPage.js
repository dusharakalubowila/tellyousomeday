import React, { useState } from 'react';
import { Search, Lock, CheckCircle } from 'lucide-react';

const SearchPage = ({ messages }) => {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Unlock Logic
  const [unlockingId, setUnlockingId] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [unlockedIds, setUnlockedIds] = useState([]); 
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!query) return;
    setHasSearched(true);
    const results = messages.filter(msg => 
      msg.to.toLowerCase().includes(query.toLowerCase()) || 
      msg.from.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(results);
  };

  const handleUnlockClick = (id) => {
    setUnlockingId(id);
    setPasswordInput('');
    setError('');
  };

  const submitUnlock = (msg) => {
    if (passwordInput === msg.password) {
      setUnlockedIds([...unlockedIds, msg.id]);
      setUnlockingId(null);
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }} className="animate-fade-in">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Find Messages</h2>
          <p style={{ color: '#666' }}>Enter a name to search for messages left for you.</p>
        </div>

        <div className="search-box">
          <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#ff758c' }} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Enter name (e.g. Dushara)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="btn btn-primary"
            style={{ position: 'absolute', right: '8px', top: '8px', padding: '0.6rem 1.5rem' }}
          >
            Search
          </button>
        </div>

        {hasSearched && filteredResults.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredResults.map((msg) => {
              const isLocked = msg.private && !unlockedIds.includes(msg.id);
              
              return (
                <div key={msg.id} className="message-card">
                  <div className="msg-header">
                    <span style={{ fontWeight: 'bold' }}>To: {msg.to}</span>
                    {msg.private && <Lock size={16} color={isLocked ? "#ff758c" : "#2ecc71"} />}
                  </div>
                  
                  <div className="msg-body">
                    {isLocked ? (
                      <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>
                        <Lock size={32} color="#e0e0e0" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>This message is protected.</p>
                        {msg.hint && <p style={{ fontSize: '0.8rem', background: '#f8f9fa', padding: '0.5rem', borderRadius: '8px', color: '#666', fontStyle: 'normal' }}>Hint: {msg.hint}</p>}
                      </div>
                    ) : (
                      <div className="animate-fade-in">
                        {msg.image && (
                          <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={msg.image} alt="Memory" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                          </div>
                        )}
                        <p>"{msg.text}"</p>
                      </div>
                    )}
                  </div>

                  <div className="msg-footer">
                    <span>From: {msg.from}</span>
                    {isLocked ? (
                      <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => handleUnlockClick(msg.id)}>Unlock</button>
                    ) : (
                      <span style={{ color: '#2ecc71', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14}/> Read</span>
                    )}
                  </div>

                  {unlockingId === msg.id && (
                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                      background: 'rgba(255,255,255,0.98)', zIndex: 10, display: 'flex', 
                      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
                    }}>
                      <h4 style={{ marginBottom: '1rem' }}>Enter Password</h4>
                      <input 
                        type="password" 
                        className="search-input" 
                        style={{ padding: '0.8rem', marginBottom: '1rem', fontSize: '0.9rem', border: error ? '1px solid red' : '1px solid #ddd' }}
                        placeholder="Password..."
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                      />
                      {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setUnlockingId(null)}>Cancel</button>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => submitUnlock(msg)}>Unlock</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {hasSearched && filteredResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '20px', border: '1px solid #e0e0e0' }}>
            <Search size={48} color="#e0e0e0" style={{ marginBottom: '1rem' }} />
            <h3>No messages found for "{query}"</h3>
            <p style={{ color: '#666' }}>They might be scheduled for the future or check the spelling.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;