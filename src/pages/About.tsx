import { Link } from 'react-router-dom'
import { 
  Heart, 
  ArrowLeft, 
  Shield, 
  Clock, 
  Users, 
  MessageCircle, 
  Star,
  Sparkles,
  Globe,
  Lock,
  Send,
  Eye
} from 'lucide-react'
import { usePageTracking } from '../utils/analytics'

const About = () => {
  // Track page view
  usePageTracking('About')
  return (
    <div className="about-page">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <Heart className="logo-icon" />
            <h1>TellYouSomeday</h1>
          </Link>
          <nav className="nav">
            <Link to="/write" className="nav-link">Write Message</Link>
            <Link to="/search" className="nav-link">Find Messages</Link>
          </nav>
        </div>
      </header>

      <div className="about-hero">
        <div className="container">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Connecting Hearts Across Time</span>
            </div>
            <h1>About TellYouSomeday</h1>
            <p className="hero-subtitle">
              A digital sanctuary where unspoken words find their voice, 
              and important messages transcend time and distance.
            </p>
          </div>
        </div>
      </div>

      <div className="about-container">
        <div className="container">
          
          {/* Story Section */}
          <section className="story-section">
            <div className="section-header">
              <div className="section-icon">
                <Heart size={32} />
              </div>
              <h2>The Story Behind the Platform</h2>
              <p className="section-subtitle">Born from the universal truth that the most important words are often the hardest to say</p>
            </div>
            
            <div className="story-content">
              <div className="story-card">
                <div className="story-text">
                  <p>
                    TellYouSomeday was born from a simple yet profound human truth: sometimes the most important words are the hardest to say. 
                    Whether it's because of fear, distance, timing, or even death, there are messages that deserve to be heard, even when we can't deliver them ourselves.
                  </p>
                  <p>
                    This platform gives voice to the unspoken - the love letters never sent, the gratitude never expressed, 
                    the final words that deserve to be heard, and the wisdom that should be passed down through generations.
                  </p>
                </div>
                <div className="story-visual">
                  <div className="floating-messages">
                    <div className="message-bubble">💌 "I love you"</div>
                    <div className="message-bubble">🌟 "I'm proud of you"</div>
                    <div className="message-bubble">🙏 "Thank you"</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works-section">
            <div className="section-header">
              <div className="section-icon">
                <MessageCircle size={32} />
              </div>
              <h2>How It Works</h2>
              <p className="section-subtitle">Simple steps to share what matters most</p>
            </div>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon">
                  <Send size={24} />
                </div>
                <h3>Write Your Message</h3>
                <p>Compose heartfelt messages for individuals, family, or the world. Set delivery preferences and privacy settings.</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon">
                  <Clock size={24} />
                </div>
                <h3>Choose When to Deliver</h3>
                <p>Send immediately or schedule for future milestones. Perfect for birthdays, anniversaries, or special moments.</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon">
                  <Eye size={24} />
                </div>
                <h3>Let Them Discover</h3>
                <p>Recipients can search by your name to find messages waiting for them. Private messages require special knowledge to unlock.</p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <div className="section-header">
              <div className="section-icon">
                <Shield size={32} />
              </div>
              <h2>Privacy & Security</h2>
              <p className="section-subtitle">Your messages are protected with enterprise-grade security</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Lock size={24} />
                </div>
                <h3>End-to-End Encryption</h3>
                <p>All messages are encrypted and stored securely with military-grade protection.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Users size={24} />
                </div>
                <h3>Access Control</h3>
                <p>You decide who can see your messages and when they become available.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield size={24} />
                </div>
                <h3>Private Messages</h3>
                <p>Protect intimate messages with personal hints that only special people would know.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Globe size={24} />
                </div>
                <h3>No Data Sharing</h3>
                <p>We never share your data with third parties. Your privacy is our priority.</p>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="use-cases-section">
            <div className="section-header">
              <div className="section-icon">
                <Star size={32} />
              </div>
              <h2>Ways to Use TellYouSomeday</h2>
              <p className="section-subtitle">Every message has the power to change someone's life</p>
            </div>
            
            <div className="use-cases-grid">
              <div className="use-case-card">
                <div className="use-case-emoji">💌</div>
                <h3>Unspoken Love</h3>
                <p>Tell someone how you feel when you're not ready to say it in person, or when the timing isn't right.</p>
              </div>
              
              <div className="use-case-card">
                <div className="use-case-emoji">👨‍👩‍👧‍👦</div>
                <h3>Family Legacy</h3>
                <p>Leave wisdom, stories, and values for your children and grandchildren to discover when they need them most.</p>
              </div>
              
              <div className="use-case-card">
                <div className="use-case-emoji">🕊️</div>
                <h3>Final Words</h3>
                <p>Ensure your loved ones hear your voice one last time, even after you're gone.</p>
              </div>
              
              <div className="use-case-card">
                <div className="use-case-emoji">🌟</div>
                <h3>Future Milestones</h3>
                <p>Leave messages for birthdays, graduations, weddings, or any special moment you might not be there to witness.</p>
              </div>
              
              <div className="use-case-card">
                <div className="use-case-emoji">🤝</div>
                <h3>Reconciliation</h3>
                <p>Bridge gaps in relationships by leaving messages for when someone is ready to hear them.</p>
              </div>
              
              <div className="use-case-card">
                <div className="use-case-emoji">🎓</div>
                <h3>Mentorship</h3>
                <p>Share knowledge, encouragement, and guidance for someone's journey ahead.</p>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="mission-section">
            <div className="mission-card">
              <div className="mission-icon">
                <Heart size={48} />
              </div>
              <h2>Our Mission</h2>
              <blockquote>
                "To ensure that no important message goes undelivered, no love goes unexpressed, and no truth remains buried in silence."
              </blockquote>
              <p>
                We believe that every person deserves to know how they've impacted others, and every heart deserves to be heard.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="cta-card">
              <h2>Start Your Journey</h2>
              <p>Ready to share what's in your heart?</p>
              <div className="cta-buttons">
                <Link to="/write" className="btn btn-primary">
                  <Send size={20} />
                  <span>Write Your First Message</span>
                </Link>
                <Link to="/search" className="btn btn-secondary">
                  <Eye size={20} />
                  <span>Search for Messages</span>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default About
