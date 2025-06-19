import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, User, Users, Globe, Lock, Send, ArrowLeft } from 'lucide-react'

const WriteMessage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [messageData, setMessageData] = useState({
    senderName: '',
    recipientType: '' as 'person' | 'family' | 'world' | '',
    recipientName: '',
    message: '',
    deliveryType: 'immediate' as 'immediate' | 'scheduled',
    deliveryDate: '',
    isPrivate: false,
    passwordHint: '',
    password: ''
  })

  const handleNext = () => {
    setCurrentStep(prev => prev + 1)
  }
  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!messageData.recipientType || !messageData.senderName || !messageData.message) {
        alert('Please fill in all required fields');
        return;
      }

      // Import the API client
      const { messageAPI } = await import('../api/client.js');
      
      // Prepare the data with proper typing
      const requestData = {
        senderName: messageData.senderName,
        recipientType: messageData.recipientType as 'person' | 'family' | 'world',
        recipientName: messageData.recipientName,
        message: messageData.message,
        deliveryType: messageData.deliveryType,
        deliveryDate: messageData.deliveryDate,
        isPrivate: messageData.isPrivate,
        passwordHint: messageData.passwordHint,
        password: messageData.password
      };      // Send to API
      console.log('📤 Sending to API:', requestData);
      const response = await messageAPI.createMessage(requestData);
      
      console.log('📥 API Response:', response);
      
      if (response.success) {
        alert('🎉 Your message has been saved successfully!\n\nIt will be delivered according to your settings. Thank you for sharing your heart with TellYouSomeday. ❤️');
        
        // Reset form or redirect
        setCurrentStep(1);
        setMessageData({
          senderName: '',
          recipientType: '' as 'person' | 'family' | 'world' | '',
          recipientName: '',
          message: '',
          deliveryType: 'immediate' as 'immediate' | 'scheduled',
          deliveryDate: '',
          isPrivate: false,
          passwordHint: '',
          password: ''
        });
      } else {
        console.warn('⚠️ API returned success=false:', response);
        throw new Error(response.message || response.error || 'Unknown API error');
      }} catch (error) {
      console.error('Error saving message:', error);
      
      // Show the actual error message from the API
      let errorMessage = '❌ Sorry, there was an error saving your message.';
      
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (errorMsg) {
        // If it's a specific API error, show it
        if (errorMsg.includes('Backend API not deployed') || 
            errorMsg.includes('Cannot connect to backend')) {
          errorMessage = '🔧 Backend service is not available. Please try again in a few minutes.';
        } else if (errorMsg.includes('validation')) {
          errorMessage = '📝 Please check that all required fields are filled correctly.';
        } else {
          errorMessage = `❌ Error: ${errorMsg}`;
        }
      }
      
      alert(`${errorMessage}\n\nIf the problem persists, please contact support.\n\nTechnical details: ${errorMsg || 'Unknown error'}`);
    }
  }
  const updateMessageData = (field: string, value: string | boolean) => {
    setMessageData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getRecipientIcon = (type: string) => {
    switch (type) {
      case 'person': return <User size={20} />
      case 'family': return <Users size={20} />
      case 'world': return <Globe size={20} />
      default: return <Heart size={20} />
    }
  }

  return (
    <div className="write-page">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <Heart className="logo-icon" />
            <h1>TellYouSomeday</h1>
          </Link>
        </div>
      </header>

      <div className="write-container">
        <div className="container">
          <div className="progress-bar">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            <div className={`progress-line ${currentStep >= 4 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>4</div>
          </div>

          {currentStep === 1 && (
            <div className="step-content">
              <h2>Who is this message for?</h2>
              <p>Choose who should receive your heartfelt message</p>
              
              <div className="recipient-options">
                <button 
                  className={`recipient-option ${messageData.recipientType === 'person' ? 'selected' : ''}`}
                  onClick={() => updateMessageData('recipientType', 'person')}
                >
                  <User size={32} />
                  <h3>A specific person</h3>
                  <p>Someone special who deserves to hear your words</p>
                </button>
                
                <button 
                  className={`recipient-option ${messageData.recipientType === 'family' ? 'selected' : ''}`}
                  onClick={() => updateMessageData('recipientType', 'family')}
                >
                  <Users size={32} />
                  <h3>My family</h3>
                  <p>For those who share your blood and your heart</p>
                </button>
                
                <button 
                  className={`recipient-option ${messageData.recipientType === 'world' ? 'selected' : ''}`}
                  onClick={() => updateMessageData('recipientType', 'world')}
                >
                  <Globe size={32} />
                  <h3>The world</h3>
                  <p>A message for anyone who might find it meaningful</p>
                </button>
              </div>

              {messageData.recipientType && (
                <div className="recipient-details">
                  <div className="form-group">
                    <label>Your name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={messageData.senderName}
                      onChange={(e) => updateMessageData('senderName', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  
                  {messageData.recipientType === 'person' && (
                    <div className="form-group">
                      <label>Recipient's name</label>
                      <input
                        type="text"
                        placeholder="Who is this message for?"
                        value={messageData.recipientName}
                        onChange={(e) => updateMessageData('recipientName', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="step-actions">
                <button 
                  onClick={handleNext}
                  disabled={!messageData.recipientType || !messageData.senderName}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <div className="step-header">
                <button onClick={handleBack} className="back-btn">
                  <ArrowLeft size={20} />
                  Back
                </button>
                <div>
                  <h2>Write your message</h2>
                  <p>Pour your heart out. Say what you've always wanted to say.</p>
                </div>
              </div>

              <div className="message-composer">
                <div className="message-header-info">
                  <div className="message-from">
                    From: <strong>{messageData.senderName}</strong>
                  </div>
                  <div className="message-to">
                    To: <strong>
                      {messageData.recipientType === 'person' ? messageData.recipientName : 
                       messageData.recipientType === 'family' ? 'My Family' : 'The World'}
                    </strong>
                    {getRecipientIcon(messageData.recipientType)}
                  </div>
                </div>

                <textarea
                  placeholder="Write your message here... 

Take your time. This is your chance to say everything you've kept in your heart. Whether it's love, gratitude, forgiveness, hopes for their future, or simply the truth you couldn't speak before.

Remember, this message might be the last thing they hear from you, or the first thing they're finally ready to receive."
                  value={messageData.message}
                  onChange={(e) => updateMessageData('message', e.target.value)}
                  className="message-textarea"
                  rows={12}
                />

                <div className="character-count">
                  {messageData.message.length} characters
                </div>
              </div>

              <div className="step-actions">
                <button 
                  onClick={handleNext}
                  disabled={!messageData.message.trim()}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content">
              <div className="step-header">
                <button onClick={handleBack} className="back-btn">
                  <ArrowLeft size={20} />
                  Back
                </button>
                <div>
                  <h2>When should this be delivered?</h2>
                  <p>Choose when your message should reach them</p>
                </div>
              </div>

              <div className="delivery-options">
                <div className="delivery-option">
                  <input
                    type="radio"
                    id="immediate"
                    name="deliveryType"
                    value="immediate"
                    checked={messageData.deliveryType === 'immediate'}
                    onChange={(e) => updateMessageData('deliveryType', e.target.value)}
                  />
                  <label htmlFor="immediate" className="delivery-label">
                    <div className="delivery-info">
                      <h3>Available immediately</h3>
                      <p>They can find and read this message right away when they search for you</p>
                    </div>
                  </label>
                </div>

                <div className="delivery-option">
                  <input
                    type="radio"
                    id="scheduled"
                    name="deliveryType"
                    value="scheduled"
                    checked={messageData.deliveryType === 'scheduled'}
                    onChange={(e) => updateMessageData('deliveryType', e.target.value)}
                  />
                  <label htmlFor="scheduled" className="delivery-label">
                    <div className="delivery-info">
                      <h3>On a specific date</h3>
                      <p>Schedule for a birthday, anniversary, or any meaningful date</p>
                    </div>
                  </label>
                </div>

                {messageData.deliveryType === 'scheduled' && (
                  <div className="date-picker">
                    <label>Delivery date</label>
                    <input
                      type="date"
                      value={messageData.deliveryDate}
                      onChange={(e) => updateMessageData('deliveryDate', e.target.value)}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button onClick={handleNext} className="btn btn-primary">
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content">
              <div className="step-header">
                <button onClick={handleBack} className="back-btn">
                  <ArrowLeft size={20} />
                  Back
                </button>
                <div>
                  <h2>Privacy & Security</h2>
                  <p>Protect your message with something only they would know</p>
                </div>
              </div>

              <div className="privacy-options">
                <div className="privacy-option">
                  <input
                    type="radio"
                    id="public"
                    name="privacy"
                    checked={!messageData.isPrivate}
                    onChange={() => updateMessageData('isPrivate', false)}
                  />
                  <label htmlFor="public" className="privacy-label">
                    <div className="privacy-info">
                      <h3>Open message</h3>
                      <p>Anyone can read this when they search for you</p>
                    </div>
                  </label>
                </div>

                <div className="privacy-option">
                  <input
                    type="radio"
                    id="private"
                    name="privacy"
                    checked={messageData.isPrivate}
                    onChange={() => updateMessageData('isPrivate', true)}
                  />
                  <label htmlFor="private" className="privacy-label">
                    <div className="privacy-info">
                      <Lock size={20} />
                      <h3>Protected message</h3>
                      <p>Require a password or answer to unlock - perfect for personal messages</p>
                    </div>
                  </label>
                </div>

                {messageData.isPrivate && (
                  <div className="password-setup">
                    <div className="form-group">
                      <label>Password hint</label>
                      <input
                        type="text"
                        placeholder="e.g., What did we call our favorite place?"
                        value={messageData.passwordHint}
                        onChange={(e) => updateMessageData('passwordHint', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Correct answer</label>
                      <input
                        type="text"
                        placeholder="e.g., sunset cove"
                        value={messageData.password}
                        onChange={(e) => updateMessageData('password', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="message-summary">
                <h3>Message Summary</h3>
                <div className="summary-item">
                  <strong>From:</strong> {messageData.senderName}
                </div>
                <div className="summary-item">
                  <strong>To:</strong> {messageData.recipientType === 'person' ? messageData.recipientName : 
                                      messageData.recipientType === 'family' ? 'My Family' : 'The World'}
                </div>
                <div className="summary-item">
                  <strong>Delivery:</strong> {messageData.deliveryType === 'immediate' ? 'Available immediately' : 
                                            `Scheduled for ${messageData.deliveryDate}`}
                </div>
                <div className="summary-item">
                  <strong>Privacy:</strong> {messageData.isPrivate ? 'Protected with password' : 'Open message'}
                </div>
              </div>

              <div className="step-actions">
                <button 
                  onClick={handleSubmit}
                  className="btn btn-primary btn-large"
                  disabled={messageData.isPrivate && (!messageData.passwordHint || !messageData.password)}
                >
                  <Send size={20} />
                  Save My Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WriteMessage
