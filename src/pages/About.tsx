import { Link } from 'react-router-dom'
import { Heart, ArrowLeft } from 'lucide-react'

const About = () => {
  return (
    <div className="about-page">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <Heart className="logo-icon" />
            <h1>TellYouSomeday</h1>
          </Link>
        </div>
      </header>

      <div className="about-container">
        <div className="container">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <div className="about-content">
            <h2>About TellYouSomeday</h2>
            
            <div className="about-section">
              <h3>The Story Behind the Platform</h3>
              <p>
                TellYouSomeday was born from a simple yet profound human truth: sometimes the most important words are the hardest to say. 
                Whether it's because of fear, distance, timing, or even death, there are messages that deserve to be heard, even when we can't deliver them ourselves.
              </p>
              <p>
                This platform gives voice to the unspoken - the love letters never sent, the gratitude never expressed, 
                the final words that deserve to be heard, and the wisdom that should be passed down through generations.
              </p>
            </div>

            <div className="about-section">
              <h3>How It Works</h3>
              <p>
                TellYouSomeday is a digital sanctuary where you can leave messages for the people who matter most to you. 
                These messages can be delivered immediately or scheduled for future dates, and they can be protected with personal passwords 
                that only you and the recipient would know.
              </p>
              <p>
                Anyone can search for messages by entering a person's name. If someone has left a message for them, 
                they'll be able to find it - whether it's a simple note or a deeply protected personal message that requires 
                a shared memory to unlock.
              </p>
            </div>

            <div className="about-section">
              <h3>Privacy & Security</h3>
              <p>
                We understand that these messages are deeply personal. That's why we've built TellYouSomeday with privacy at its core:
              </p>
              <ul>
                <li>All messages are encrypted and stored securely</li>
                <li>You control who can see your messages and when</li>
                <li>Private messages can only be unlocked by those who know the answer to your personal hint</li>
                <li>We never share your data with third parties</li>
              </ul>
            </div>

            <div className="about-section">
              <h3>Use Cases</h3>
              <div className="use-case">
                <h4>💌 Unspoken Love</h4>
                <p>Tell someone how you feel when you're not ready to say it in person, or when the timing isn't right.</p>
              </div>
              <div className="use-case">
                <h4>👨‍👩‍👧‍👦 Family Legacy</h4>
                <p>Leave wisdom, stories, and values for your children and grandchildren to discover when they need them most.</p>
              </div>
              <div className="use-case">
                <h4>🕊️ Final Words</h4>
                <p>Ensure your loved ones hear your voice one last time, even after you're gone.</p>
              </div>
              <div className="use-case">
                <h4>🌟 Future Milestones</h4>
                <p>Leave messages for birthdays, graduations, weddings, or any special moment you might not be there to witness.</p>
              </div>
              <div className="use-case">
                <h4>🤝 Reconciliation</h4>
                <p>Bridge gaps in relationships by leaving messages for when someone is ready to hear them.</p>
              </div>
            </div>

            <div className="about-section">
              <h3>Our Mission</h3>
              <p>
                "To ensure that no important message goes undelivered, no love goes unexpressed, and no truth remains buried in silence."
              </p>
              <p>
                We believe that every person deserves to know how they've impacted others, and every heart deserves to be heard.
              </p>
            </div>

            <div className="cta-section">
              <h3>Start Your Journey</h3>
              <p>Ready to share what's in your heart?</p>
              <div className="cta-buttons">
                <Link to="/write" className="btn btn-primary">
                  Write Your First Message
                </Link>
                <Link to="/search" className="btn btn-secondary">
                  Search for Messages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
