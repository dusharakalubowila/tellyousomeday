import React, { useState } from 'react';
import { User, Users, Globe, ArrowLeft, ArrowRight, Upload, X, Clock, Lock, Key, Send, CheckCircle } from 'lucide-react';

const WritePage = ({ setPage, onAddMessage }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ to: '', from: '', type: '', message: '', date: '', private: false, password: '', hint: '' });
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    const newMessage = {
      id: Date.now(),
      to: data.to,
      from: data.from || "Anonymous",
      text: data.message,
      type: data.type,
      private: data.private,
      password: data.password,
      hint: data.hint,
      image: image,
      date: new Date().toISOString()
    };
    
    onAddMessage(newMessage);
    setShowSuccess(true);
    
    setTimeout(() => {
      setPage('home');
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="animate-fade-in" style={{ padding: '6rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="container">
          <div style={{ 
            background: 'white', padding: '4rem', borderRadius: '30px', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ 
              width: 80, height: 80, background: '#e0f7fa', borderRadius: '50%', color: '#00bcd4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
              animation: 'float-slow 3s ease-in-out infinite'
            }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2d3436' }}>Thank You!</h2>
            <p style={{ fontSize: '1.2rem', color: '#636e72' }}>Your legacy has been successfully saved.</p>
            <p style={{ fontSize: '1rem', color: '#ff758c', marginTop: '1rem' }}>Redirecting to home...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="wizard-step">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Who is this message for?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {['person', 'family', 'world'].map(type => (
          <div 
            key={type} 
            className={`option-card ${data.type === type ? 'selected' : ''}`}
            onClick={() => setData({ ...data, type })}
          >
            <div style={{ background: '#f8f9fa', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#2d3436' }}>
              {type === 'person' && <User />}
              {type === 'family' && <Users />}
              {type === 'world' && <Globe />}
            </div>
            <h3 style={{ textTransform: 'capitalize' }}>{type}</h3>
          </div>
        ))}
      </div>
      {data.type && (
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>To (Recipient Name)</label>
            <input 
              type="text" 
              className="search-input" 
              style={{ borderRadius: '12px', padding: '0.8rem' }}
              placeholder={data.type === 'world' ? 'The World' : "e.g. Dushara"}
              value={data.to}
              onChange={e => setData({...data, to: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>From (Your Name)</label>
            <input 
              type="text" 
              className="search-input" 
              style={{ borderRadius: '12px', padding: '0.8rem' }}
              placeholder="e.g. Best Friend"
              value={data.from}
              onChange={e => setData({...data, from: e.target.value})}
            />
          </div>
        </div>
      )}
      <div style={{ textAlign: 'right' }}>
        <button className="btn btn-primary" disabled={!data.type || !data.to} onClick={() => setStep(2)}>Next Step <ArrowRight size={18} /></button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="wizard-step">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Write & Upload</h2>
      <div style={{ 
        border: '2px dashed #e0e0e0', borderRadius: '16px', padding: '2rem', 
        textAlign: 'center', marginBottom: '2rem', cursor: 'pointer',
        background: '#fcfcfc', transition: '0.3s', position: 'relative'
      }}
      onMouseOver={e => e.currentTarget.style.borderColor = '#ff758c'}
      onMouseOut={e => e.currentTarget.style.borderColor = '#e0e0e0'}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
        />
        {image ? (
          <div style={{ position: 'relative' }}>
            <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
            <button 
              onClick={(e) => { e.preventDefault(); setImage(null); }}
              style={{ position: 'absolute', top: -10, right: -10, background: '#ff758c', color: 'white', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div style={{ color: '#888' }}>
            <div style={{ width: 50, height: 50, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <Upload size={24} color="#ff758c" />
            </div>
            <p style={{ fontWeight: 600 }}>Click to upload a memory</p>
            <p style={{ fontSize: '0.85rem' }}>or drag and drop here</p>
          </div>
        )}
      </div>

      <textarea 
        style={{ width: '100%', height: '200px', padding: '1.5rem', borderRadius: '16px', border: '2px solid #e0e0e0', fontSize: '1.1rem', resize: 'none', outline: 'none' }}
        placeholder="Say what you've always wanted to say..."
        value={data.message}
        onChange={e => setData({...data, message: e.target.value})}
      ></textarea>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button className="btn btn-ghost" onClick={() => setStep(1)}><ArrowLeft size={18} /> Back</button>
        <button className="btn btn-primary" disabled={!data.message} onClick={() => setStep(3)}>Next Step <ArrowRight size={18} /></button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="wizard-step">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Delivery & Privacy</h2>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #e0e0e0', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}><Clock size={18} style={{ verticalAlign: 'text-bottom' }} /> When should this unlock?</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className={`btn ${!data.date ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setData({...data, date: ''})}>Immediately</button>
            <input 
              type="date" 
              className="btn btn-secondary" 
              style={{ fontFamily: 'inherit' }} 
              onChange={e => setData({...data, date: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}><Lock size={18} style={{ verticalAlign: 'text-bottom' }} /> Security Level</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className={`option-card ${!data.private ? 'selected' : ''}`} style={{ flex: 1, padding: '1rem' }} onClick={() => setData({...data, private: false})}>
              <h4>Public</h4>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>Anyone can read this</p>
            </div>
            <div className={`option-card ${data.private ? 'selected' : ''}`} style={{ flex: 1, padding: '1rem' }} onClick={() => setData({...data, private: true})}>
              <h4>Protected</h4>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>Requires password/hint</p>
            </div>
          </div>

          {data.private && (
            <div className="animate-fade-in" style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Set Password</label>
                <div style={{ position: 'relative' }}>
                  <Key size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#ff758c' }} />
                  <input 
                    type="password" 
                    className="search-input" 
                    style={{ padding: '10px 10px 10px 35px', borderRadius: '8px', fontSize: '0.95rem' }}
                    placeholder="Enter a secret password"
                    value={data.password}
                    onChange={e => setData({...data, password: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Password Hint (Optional)</label>
                <input 
                  type="text" 
                  className="search-input" 
                  style={{ padding: '10px', borderRadius: '8px', fontSize: '0.95rem' }}
                  placeholder="e.g. Where we first met?"
                  value={data.hint}
                  onChange={e => setData({...data, hint: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={() => setStep(2)}><ArrowLeft size={18} /> Back</button>
        <button className="btn btn-primary" onClick={handleFinish}>
          Finish & Send <Send size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh', background: 'radial-gradient(circle at 50% 50%, #f8f9fa 0%, #fff 70%)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {!showSuccess && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ 
                width: 40, height: 40, borderRadius: '50%', 
                background: step >= s ? '#ff758c' : '#ddd', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', margin: '0 1rem', position: 'relative'
              }}>
                {s}
                {s < 3 && <div style={{ position: 'absolute', right: -32, width: 32, height: 2, background: step > s ? '#ff758c' : '#ddd' }} />}
              </div>
            ))}
          </div>
        )}
        {step === 1 && !showSuccess && renderStep1()}
        {step === 2 && !showSuccess && renderStep2()}
        {step === 3 && !showSuccess && renderStep3()}
      </div>
    </div>
  );
};

export default WritePage;