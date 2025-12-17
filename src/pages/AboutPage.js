import React from 'react';
import { Heart, Mail, Star, CheckCircle, Search, Send, Clock, Shield, Globe } from 'lucide-react';

const AboutPage = ({ setPage }) => (
  <div style={{ padding: '4rem 0', background: '#fff9fa' }} className="animate-fade-in">
    <div className="container">
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          width: 60, height: 60, background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          margin: '0 auto 1.5rem', color: 'white', boxShadow: '0 4px 15px rgba(255, 117, 140, 0.4)'
        }}>
          <Heart size={28} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#2d3436' }}>
          The Story Behind the Platform
        </h1>
        <p style={{ color: '#636e72', fontSize: '1.1rem' }}>
          Born from the universal truth that the most important words are often the hardest to say
        </p>
      </div>

      {/* Story Content */}
      <div style={{ 
        background: 'white', borderRadius: '30px', padding: '3rem', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.05)', display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem',
        alignItems: 'center', marginBottom: '4rem'
      }}>
        <div>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: '#4a5568' }}>
            TellYouSomeday was born from a simple yet profound human truth: sometimes the most important words are the hardest to say. Whether it's because of fear, distance, timing, or even death, there are messages that deserve to be heard, even when we can't deliver them ourselves.
          </p>
          <p style={{ lineHeight: '1.8', color: '#4a5568' }}>
            This platform gives voice to the unspoken - the love letters never sent, the gratitude never expressed, the final words that deserve to be heard, and the wisdom that should be passed down through generations.
          </p>
        </div>

        <div style={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '20%', right: '20%', background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', padding: '12px 24px', borderRadius: '50px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(255, 117, 140, 0.4)', transform: 'rotate(-5deg)' }}>
            <Mail size={18} /> <span style={{ fontWeight: 600 }}>"I love you"</span>
          </div>
          <div style={{ position: 'absolute', bottom: '30%', left: '10%', background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', padding: '12px 24px', borderRadius: '50px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(255, 94, 98, 0.4)', transform: 'rotate(5deg)' }}>
            <Star size={18} /> <span style={{ fontWeight: 600 }}>"Thank you"</span>
          </div>
           <div style={{ position: 'absolute', bottom: '15%', right: '5%', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', padding: '12px 24px', borderRadius: '50px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(253, 160, 133, 0.4)', transform: 'rotate(-10deg)', zIndex: 0 }}>
            <CheckCircle size={18} /> <span style={{ fontWeight: 600 }}>"Proud of you"</span>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white', boxShadow: '0 4px 15px rgba(255, 117, 140, 0.4)' }}>
          <Heart size={28} />
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#2d3436' }}>Our Mission</h2>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', borderLeft: '5px solid #ff758c', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto 2rem', position: 'relative' }}>
          <p style={{ fontStyle: 'italic', fontSize: '1.2rem', color: '#ff758c', fontWeight: 500 }}>
            "To ensure that no important message goes undelivered, no love goes unexpressed, and no truth remains buried in silence."
          </p>
        </div>
        <p style={{ color: '#636e72', maxWidth: '700px', margin: '0 auto 4rem', fontSize: '1.1rem' }}>
          We believe that every person deserves to know how they've impacted others, and every heart deserves to be heard.
        </p>
      </div>

      {/* Core Features */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '4rem' }}>
        <div className="container">
          <h3 style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '2rem' }} className="section-header">Core Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div className="card"><div style={{ marginBottom: '1rem' }}><Shield className="text-gradient" size={32} /></div><h4>End-to-End Encryption</h4><p style={{ fontSize: '0.9rem', color: '#888' }}>Your deepest secrets are safe with us.</p></div>
            <div className="card"><div style={{ marginBottom: '1rem' }}><Clock className="text-gradient" size={32} /></div><h4>Time Travel</h4><p style={{ fontSize: '0.9rem', color: '#888' }}>Send messages to the future.</p></div>
            <div className="card"><div style={{ marginBottom: '1rem' }}><Globe className="text-gradient" size={32} /></div><h4>Legacy</h4><p style={{ fontSize: '0.9rem', color: '#888' }}>Leave a mark that lasts forever.</p></div>
          </div>
        </div>
      </div>

      {/* Journey Card (Moved to Bottom) */}
      <div style={{ background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', borderRadius: '30px', padding: '3rem', color: 'white', maxWidth: '600px', margin: '5rem auto 0', boxShadow: '0 20px 50px rgba(255, 94, 98, 0.3)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Start Your Journey</h2>
        <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Ready to share what's in your heart?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setPage('write')} style={{ background: 'white', color: '#ff5e62', border: 'none', padding: '1rem 2rem', borderRadius: '50px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <Send size={18} /> Write Your First Message
          </button>
          <button onClick={() => setPage('search')} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', padding: '0.8rem 2rem', borderRadius: '50px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <Search size={18} /> Search for Messages
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;