import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, PenTool, Clock, Lock, Users } from 'lucide-react'

const Home = () => {
  const [isHovered, setIsHovered] = useState<string | null>(null)

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
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">
              Some things are too important<br />
              <span className="gradient-text">to be left unsaid</span>
            </h2>
            <p className="hero-subtitle">
              Leave a message. Deliver it when the time is right.<br />
              For the words that matter most, even when we can't say them now.
            </p>
            <div className="hero-actions">
              <Link 
                to="/write" 
                className="btn btn-primary"
                onMouseEnter={() => setIsHovered('write')}
                onMouseLeave={() => setIsHovered(null)}
              >
                <PenTool size={20} />
                Write Your Message
                {isHovered === 'write' && <span className="btn-ripple"></span>}
              </Link>
              <Link 
                to="/search" 
                className="btn btn-secondary"
                onMouseEnter={() => setIsHovered('search')}
                onMouseLeave={() => setIsHovered(null)}
              >
                <Search size={20} />
                Search for Messages
                {isHovered === 'search' && <span className="btn-ripple"></span>}
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-messages">
              <div className="message-bubble message-1">
                <p>"I never told you how proud I am..."</p>
              </div>
              <div className="message-bubble message-2">
                <p>"When you're ready to hear this..."</p>
              </div>
              <div className="message-bubble message-3">
                <p>"For your wedding day ♥"</p>
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
