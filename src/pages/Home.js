import React from 'react';
import { Heart, Search, PenTool, Lock, Sparkles, Star, Clock, Eye, Shield, Users, Mail, MessageCircle, Calendar, Camera, Smile, Globe, Send } from 'lucide-react';

const Home = ({ setPage }) => {
  return (
    <div className="animate-fade-in">
      <section className="hero">
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="bg-bubble" style={{ left: '5%', animationDelay: '0s', animationDuration: '18s', top: '20%' }}>
            <Heart size={16} fill="#ff758c" color="#ff758c" style={{ display: 'inline', marginRight: 8 }} /> 
            Thinking of you...
          </div>
          <div className="bg-bubble" style={{ right: '10%', animationDelay: '3s', animationDuration: '22s', top: '15%' }}>
            Open in 2030 <Lock size={14} color="#ff758c" style={{ display: 'inline', marginLeft: 8 }} />
          </div>
          <div className="bg-bubble" style={{ left: '15%', animationDelay: '6s', animationDuration: '20s', top: '60%' }}>
            I'm sorry for everything
          </div>
          <div className="bg-bubble" style={{ right: '20%', animationDelay: '2s', animationDuration: '16s', top: '70%' }}>
            For my daughter ❤️
          </div>
          <div className="bg-bubble" style={{ left: '50%', animationDelay: '9s', animationDuration: '25s', top: '40%', marginLeft: '-80px' }}>
            <Star size={16} fill="#FFD700" color="#FFD700" style={{ display: 'inline', marginRight: 8 }} /> 
            Thank you!
          </div>
           <div className="bg-bubble" style={{ left: '80%', animationDelay: '5s', animationDuration: '19s', top: '50%' }}>
            Miss you 🥺
          </div>
        </div>

        <div className="container">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: '#fff0f3', color: '#ff758c', padding: '6px 16px', 
            borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1.5rem',
            position: 'relative', zIndex: 2
          }}>
            <Sparkles size={16} /> The Most Beautiful Way to Leave a Message
          </div>
          <h1>
            Write Now. <span className="text-gradient">Read Someday.</span><br />
            Forever Kept.
          </h1>
          <p>
            A digital time capsule for your thoughts, confessions, and love letters. 
            Schedule messages for the future or leave them to be found by the right person.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', position: 'relative', zIndex: 2 }}>
            <button className="btn btn-primary" onClick={() => setPage('write')}>
              <PenTool size={18} /> Write a Message
            </button>
            <button className="btn btn-secondary" onClick={() => setPage('search')}>
              <Search size={18} /> Find a Message
            </button>
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-val">10,000+</span>
              <span className="stat-label">Messages</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">5,000+</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">100%</span>
              <span className="stat-label">Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Connect Beyond Time Section --- */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #ffffff 0%, #fff9fa 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 className="section-header" style={{ fontSize: '2.5rem', color: '#2d3436', marginBottom: '1rem' }}>
              Connect Beyond Time
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#636e72', letterSpacing: '0.5px' }}>
              A space where feelings find their way.
            </p>
          </div>

          <div className="responsive-row">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', animation: 'float-slow 6s ease-in-out infinite' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#fff0f3', border: '4px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                <div style={{ background: '#ffcccb', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>👩</span>
                </div>
              </div>
              <span style={{ fontWeight: 'bold', color: '#888', letterSpacing: '1px', fontSize: '0.8rem' }}>SENDER</span>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '300px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', opacity: 0.1, zIndex: 0 }}>
                <Heart size={200} fill="#ff758c" color="transparent" />
              </div>
              <div className="msg-bubble-mobile" style={{ background: 'white', padding: '12px 25px', borderRadius: '25px 25px 0 25px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', color: '#666', fontSize: '0.95rem', position: 'absolute', top: '20%', left: '10%', animation: 'float-slow 5s ease-in-out infinite', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 8, height: 8, background: '#ff758c', borderRadius: '50%' }}></span>I miss you so much...
              </div>
              <div className="msg-bubble-mobile" style={{ background: '#ff477e', padding: '15px 30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(255, 71, 126, 0.3)', color: 'white', fontWeight: '500', fontSize: '1.1rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'float-3d 4s ease-in-out infinite', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
                I'm always with you <Heart size={16} fill="white" color="white" /><span style={{ width: 8, height: 8, background: 'white', borderRadius: '50%', marginLeft: '5px', opacity: 0.8 }}></span>
              </div>
              <div className="msg-bubble-mobile" style={{ background: 'white', padding: '12px 25px', borderRadius: '25px 25px 25px 0', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', color: '#666', fontSize: '0.95rem', position: 'absolute', bottom: '20%', right: '10%', animation: 'float-reverse 7s ease-in-out infinite', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 8, height: 8, background: '#ff758c', borderRadius: '50%' }}></span>Reading this makes me smile.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', animation: 'float-reverse 6s ease-in-out infinite' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f0f8ff', border: '4px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                 <div style={{ background: '#add8e6', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>🧔</span>
                </div>
              </div>
              <span style={{ fontWeight: 'bold', color: '#888', letterSpacing: '1px', fontSize: '0.8rem' }}>RECEIVER</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Visual Memories Section --- */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ background: '#e0f7fa', color: '#00bcd4', padding: '8px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={16} /> Visual Memories
            </div>
            <h2 className="section-header" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2d3436' }}>
              A Picture is Worth <span className="text-gradient">Forever</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#636e72', maxWidth: '700px' }}>
              Words are powerful, but sometimes a moment needs to be seen. Attach your most cherished photos to your time capsules.
            </p>
          </div>

          <div className="photo-stack-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '4rem' }}>
            <div style={{ position: 'relative', width: '300px', height: '350px' }}>
              <div className="photo-card" style={{ transform: 'rotate(-10deg)', zIndex: 1, left: 0 }}>
                <div className="photo-inner" style={{ background: '#ffcccb' }}><Heart size={48} color="white" fill="white" style={{ opacity: 0.8 }} /></div>
                <div style={{ position: 'absolute', bottom: '15px', left: '0', width: '100%', textAlign: 'center', fontFamily: 'cursive', color: '#555' }}>Our Wedding Day</div>
              </div>
              <div className="photo-card" style={{ transform: 'rotate(5deg) translate(20px, -20px)', zIndex: 2, left: '20px' }}>
                <div className="photo-inner" style={{ background: '#add8e6' }}><Smile size={48} color="white" style={{ opacity: 0.8 }} /></div>
                <div style={{ position: 'absolute', bottom: '15px', left: '0', width: '100%', textAlign: 'center', fontFamily: 'cursive', color: '#555' }}>First Smile</div>
              </div>
              <div className="photo-card" style={{ transform: 'rotate(-2deg) translate(40px, 20px)', zIndex: 3, left: '40px' }}>
                <div className="photo-inner" style={{ background: '#90ee90' }}><Users size={48} color="white" fill="white" style={{ opacity: 0.8 }} /></div>
                <div style={{ position: 'absolute', bottom: '15px', left: '0', width: '100%', textAlign: 'center', fontFamily: 'cursive', color: '#555' }}>Family Trip 2024</div>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px', maxWidth: '500px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#fff0f3', padding: '12px', borderRadius: '15px', color: '#ff758c' }}><Camera size={24} /></div>
                  <div><h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Upload Memories</h3><p style={{ color: '#666', fontSize: '0.95rem' }}>Easily attach photos.</p></div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '15px', color: '#2196f3' }}><Shield size={24} /></div>
                  <div><h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Secure Storage</h3><p style={{ color: '#666', fontSize: '0.95rem' }}>Encrypted and stored safely.</p></div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#f3e5f5', padding: '12px', borderRadius: '15px', color: '#9c27b0' }}><Sparkles size={24} /></div>
                  <div><h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Perfect Quality</h3><p style={{ color: '#666', fontSize: '0.95rem' }}>Preserve original quality.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 0', background: '#fff9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-header" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How TellYouSomeday Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><PenTool size={28} /></div>
              <h3>Write Your Message</h3>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Pour your heart out.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><Clock size={28} /></div>
              <h3>Choose When</h3>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Set a future date.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><Lock size={28} /></div>
              <h3>Protect with Love</h3>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Add a hint or password.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><Heart size={28} /></div>
              <h3>Deliver the Truth</h3>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Your message reaches them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-header" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>When Words Matter Most</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}><div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><Heart size={28} /></div><h4>Unspoken Love</h4><p style={{ color: '#666' }}>Tell someone how you feel.</p></div>
            <div className="card" style={{ textAlign: 'center' }}><div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><Users size={28} /></div><h4>Family Legacy</h4><p style={{ color: '#666' }}>Leave wisdom and stories.</p></div>
            <div className="card" style={{ textAlign: 'center' }}><div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><Clock size={28} /></div><h4>Special Moments</h4><p style={{ color: '#666' }}>Messages for birthdays.</p></div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <div style={{ borderTop: '1px solid #eee', padding: '4rem 0' }}>
        <div className="container">
          <h3 style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '2rem' }} className="section-header">Security and Privacy</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div className="card"><div style={{ marginBottom: '1rem' }}><Shield className="text-gradient" size={32} /></div><h4>End-to-End Encryption</h4><p style={{ fontSize: '0.9rem', color: '#888' }}>Your deepest secrets are safe.</p></div>
            <div className="card"><div style={{ marginBottom: '1rem' }}><Clock className="text-gradient" size={32} /></div><h4>Time Travel</h4><p style={{ fontSize: '0.9rem', color: '#888' }}>Send messages to the future.</p></div>
            <div className="card"><div style={{ marginBottom: '1rem' }}><Globe className="text-gradient" size={32} /></div><h4>Legacy</h4><p style={{ fontSize: '0.9rem', color: '#888' }}>Leave a mark that lasts forever.</p></div>
          </div>
        </div>
      </div>

      {/* Journey Card */}
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
  );
};

export default Home;