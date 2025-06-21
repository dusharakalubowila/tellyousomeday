import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, PenTool, Clock, Lock, Users, Star, Sparkles, MessageCircle } from 'lucide-react'

const Home = () => {
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Testimonial rotation
  const testimonials = [
    { text: "I never told you how proud I am...", author: "To my daughter" },
    { text: "When you're ready to hear this...", author: "For the future" },
    { text: "For your wedding day ♥", author: "Mom's message" },
    { text: "Thank you for believing in me", author: "To my mentor" },
    { text: "I hope you find your happiness", author: "To an old friend" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const ripple = document.createElement('span')
    ripple.className = 'btn-ripple'
    e.currentTarget.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Heart className="logo-icon" />
            <h1>TellYouSomeday</h1>
          </div>
          <nav className="nav">
            <Link to="/search" className="nav-link">
              <Search size={18} />
              Find Messages
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </nav>
        </div>
      </header>      {/* Hero Section */}
      <section className="hero">
        {/* Interactive background elements */}
        <div className="hero-bg-effects">
          <div className="floating-particles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}>
                <Star size={16} />
              </div>
            ))}
          </div>
          <div 
            className="mouse-glow" 
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`
            }}
          />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Share Your Heart</span>
              <Sparkles size={16} />
            </div>
            
            <h2 className="hero-title">
              Some things are too important<br />
              <span className="gradient-text">to be left unsaid</span>
            </h2>
            
            <p className="hero-subtitle">
              Leave a message. Deliver it when the time is right.<br />
              For the words that matter most, even when we can't say them now.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <MessageCircle size={20} />
                <span>1000+ Messages</span>
              </div>
              <div className="stat">
                <Heart size={20} />
                <span>Hearts Connected</span>
              </div>
              <div className="stat">
                <Lock size={20} />
                <span>Safely Stored</span>
              </div>
            </div>
            
            <div className="hero-actions">
              <Link 
                to="/write" 
                className="btn btn-primary btn-large"
                onMouseEnter={() => setIsHovered('write')}
                onMouseLeave={() => setIsHovered(null)}
                onClick={handleButtonClick}
              >
                <PenTool size={20} />
                Write Your Message
                {isHovered === 'write' && <span className="btn-shimmer"></span>}
              </Link>
              <Link 
                to="/search" 
                className="btn btn-secondary btn-large"
                onMouseEnter={() => setIsHovered('search')}
                onMouseLeave={() => setIsHovered(null)}
                onClick={handleButtonClick}
              >
                <Search size={20} />
                Search for Messages
              </Link>
            </div>
          </div>
            <div className="hero-visual">
            {/* Floating Messages - positioned relative to full hero */}
            <div className="floating-messages">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div key={index} className={`message-bubble message-${index + 1}`}>
                  <p>"{testimonial.text}"</p>
                </div>
              ))}
            </div>
            
            <div className="message-showcase">
              <div className="message-preview">
                <div className="message-header">
                  <div className="message-avatar">
                    <Heart size={16} />
                  </div>
                  <div className="message-info">
                    <span className="message-author">{testimonials[currentTestimonial].author}</span>
                    <span className="message-time">For someday...</span>
                  </div>
                </div>
                <div className="message-content">
                  <p>"{testimonials[currentTestimonial].text}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h3>How TellYouSomeday Works</h3>
          <div className="steps">
            <div className="step">
              <div className="step-icon">
                <PenTool />
              </div>
              <h4>Write Your Message</h4>
              <p>Pour your heart out. Write to someone specific, your family, or the world.</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <Clock />
              </div>
              <h4>Choose When</h4>
              <p>Set a future date, or let it be found when someone searches for you.</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <Lock />
              </div>
              <h4>Protect with Love</h4>
              <p>Add a hint or password that only they would know - a shared memory, a secret place.</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <Heart />
              </div>
              <h4>Deliver the Truth</h4>
              <p>Your message reaches them when the time is right, even if you're not there to say it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases">
        <div className="container">
          <h3>When Words Matter Most</h3>
          <div className="cases">
            <div className="case">
              <div className="case-icon">
                <Heart />
              </div>
              <h4>Unspoken Love</h4>
              <p>Tell someone how you feel, even if you can't say it now</p>
            </div>
            <div className="case">
              <div className="case-icon">
                <Users />
              </div>
              <h4>Family Legacy</h4>
              <p>Leave wisdom, stories, and love for future generations</p>
            </div>
            <div className="case">
              <div className="case-icon">
                <Clock />
              </div>
              <h4>Special Moments</h4>
              <p>Messages for birthdays, graduations, weddings - even after you're gone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Heart className="footer-icon" />
              <span>TellYouSomeday</span>
            </div>
            <p className="footer-tagline">
              "Because some messages can't wait forever."
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
