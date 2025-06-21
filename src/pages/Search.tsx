import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search as SearchIcon, Heart, Lock, Users, Globe, User, ArrowLeft, Clock, Eye } from 'lucide-react'
import type { Message } from '../api/client.d.ts'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchSuggestions] = useState(['family messages', 'love letters', 'graduation messages', 'birthday wishes'])
  const [showSuggestions, setShowSuggestions] = useState(false)
  // Mock data for demonstration
  const mockMessages: Message[] = [    {
      id: '1',
      senderName: 'Dushara Kalubowila',
      recipientType: 'person',
      recipientName: 'Thathsara',
      isPrivate: true,
      passwordHint: 'Thathsara... You won\'t see this yet — just wait for the day.',
      previewText: 'There are things I never got to tell you...',
      deliveryType: 'immediate',
      views: 0,
      createdAt: '2024-06-15T12:00:00Z',
      canRead: false
    },
    {
      id: '2',
      senderName: 'Dushara Kalubowila',
      recipientType: 'family',
      recipientName: 'My Family',
      isPrivate: false,
      previewText: 'To my beautiful family, these are the things I want you to remember...',
      deliveryType: 'immediate',
      views: 3,
      createdAt: '2024-06-15T12:00:00Z',
      canRead: true
    },
    {
      id: '3',
      senderName: 'Dushara Kalubowila',
      recipientType: 'world',
      isPrivate: false,
      previewText: 'If you\'re reading this, maybe you knew me, maybe you didn\'t...',
      deliveryType: 'immediate',
      views: 12,
      createdAt: '2024-06-15T12:00:00Z',
      canRead: true
    }
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      const results = mockMessages.filter(msg => 
        msg.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }
  const handleUnlockMessage = (message: Message) => {
    if (password.toLowerCase().trim() === 'sunset cove') { // Mock correct answer
      const messageWithFullText = {
        ...message,
        message: `Dear Thathsara,

If you're reading this, it means you found your way here. I wrote this because there were so many things I wanted to tell you but couldn't find the right moment, or maybe I was too scared.

You've always been more than just a friend to me. You were the person who understood my dreams when I couldn't even explain them to myself. You believed in me when I didn't believe in myself.

I want you to know that every conversation we had, every moment we shared, meant everything to me. Your friendship shaped who I became as a person.

If something happened to me, or if we drifted apart, I want you to know that you made my life brighter. You were one of the best parts of my story.

Keep being the amazing person you are. Keep dreaming. Keep inspiring others the way you inspired me.

With all my love and gratitude,
Dushara

P.S. Remember that sunset at the beach? That was one of the happiest moments of my life.`
      }
      setSelectedMessage(messageWithFullText)
      setPassword('')
      setPasswordError('')
    } else {
      setPasswordError('That\'s not quite right. Think about our special memories together.')
    }
  }
  const getMessageIcon = (type: 'person' | 'family' | 'world') => {
    switch (type) {
      case 'person': return <User size={20} />
      case 'family': return <Users size={20} />
      case 'world': return <Globe size={20} />
      default: return <Heart size={20} />
    }
  }

  const getMessageTypeLabel = (type: 'person' | 'family' | 'world') => {
    switch (type) {
      case 'person': return 'Personal Message'
      case 'family': return 'Family Message'
      case 'world': return 'Public Message'
      default: return 'Message'
    }
  }

  if (selectedMessage) {
    return (
      <div className="search-page">
        <header className="header">
          <div className="container">
            <Link to="/" className="logo">
              <Heart className="logo-icon" />
              <h1>TellYouSomeday</h1>
            </Link>
          </div>
        </header>

        <div className="message-viewer">
          <div className="container">
            <button 
              onClick={() => setSelectedMessage(null)}
              className="back-btn"
            >
              <ArrowLeft size={20} />
              Back to Search
            </button>
              <div className="message-card full-message">
              <div className="message-header">
                <div className="sender-info">
                  <h3>Message from {selectedMessage.senderName}</h3>
                  <p>To: {selectedMessage.recipientName || 'The World'}</p>
                  <span className="message-type">
                    {getMessageIcon(selectedMessage.recipientType)}
                    {getMessageTypeLabel(selectedMessage.recipientType)}
                  </span>
                </div>
              </div>
              
              <div className="message-content">
                <div className="message-text">
                  {selectedMessage.message?.split('\n').map((line: string, index: number) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="search-page">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <Heart className="logo-icon" />
            <h1>TellYouSomeday</h1>
          </Link>
          <nav className="nav">
            <Link to="/write" className="nav-link">Write Message</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>
        </div>
      </header>

      <div className="search-container">
        <div className="container">
          <div className="search-header">
            <h2>Find Messages Left for You</h2>
            <p>Search by someone's name to see if they left you a message</p>
          </div>          <div className="search-box">
            <div className="search-input-wrapper">
              <div className="search-input-group">
                <SearchIcon size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Enter someone's name (e.g., Dushara Kalubowila)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="search-input"
                />
                <button 
                  onClick={handleSearch}
                  className="search-btn"
                  disabled={isSearching}
                  aria-label="Search for messages"
                >
                  {isSearching ? (
                    <div className="loading-spinner" aria-label="Searching..."></div>
                  ) : (
                    <>
                      <SearchIcon size={20} />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  <div className="suggestions-header">
                    <span>Popular searches:</span>
                  </div>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                      }}
                      aria-label={`Search for ${suggestion}`}
                    >
                      <SearchIcon size={16} />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Options */}
            <div className="search-filters">
              <span className="filter-label">Filter by type:</span>
              <div className="filter-buttons">
                {[
                  { key: 'all', label: 'All Messages', icon: Heart },
                  { key: 'person', label: 'Personal', icon: User },
                  { key: 'family', label: 'Family', icon: Users },
                  { key: 'world', label: 'Public', icon: Globe }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    className={`filter-btn ${filterType === key ? 'active' : ''}`}
                    onClick={() => setFilterType(key)}
                    aria-label={`Filter ${label.toLowerCase()}`}
                    aria-pressed={filterType === key}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>{searchResults.length > 0 && (
            <div className="search-results">
              <div className="results-header">
                <h3>{searchResults.length} message(s) found from "{searchQuery}"</h3>
                <div className="results-stats">
                  <span className="stat">
                    <Eye size={16} />
                    {searchResults.reduce((acc, msg) => acc + (msg.views || 0), 0)} total views
                  </span>
                  <span className="stat">
                    <Clock size={16} />
                    Latest: {new Date(searchResults[0]?.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
              </div>              <div className="messages-grid">
                {searchResults.map((message) => (
                  <div key={message.id} className="message-card">
                    <div className="message-header">
                      <div className="sender-info">
                        <h4>{message.senderName}</h4>
                        <p>To: {message.recipientName || 'The World'}</p>
                        <span className="message-type">
                          {getMessageIcon(message.recipientType)}
                          <span>{getMessageTypeLabel(message.recipientType)}</span>
                        </span>
                      </div>
                      {message.isPrivate && (
                        <div className="lock-indicator" title="This message is private">
                          <Lock size={16} />
                        </div>
                      )}
                    </div>
                    
                    <div className="message-preview">
                      <p>{message.previewText}</p>
                    </div>
                    
                    {message.isPrivate ? (
                      <div className="unlock-section">
                        <div className="hint">
                          <strong>Hint:</strong> {message.passwordHint}
                        </div>
                        <div className="password-input-group">
                          <input
                            type="text"
                            placeholder="Enter your answer"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleUnlockMessage(message)}
                            className="password-input"
                            aria-label="Enter password to unlock message"
                          />
                          <button 
                            onClick={() => handleUnlockMessage(message)}
                            className="unlock-btn"
                            aria-label="Unlock message"
                            disabled={!password.trim()}
                          >
                            <Lock size={18} />
                            <span>Unlock Message</span>
                          </button>
                        </div>
                        {passwordError && (
                          <div className="error-message" role="alert">{passwordError}</div>
                        )}
                      </div>
                    ) : (
                      <div className="unlock-section">
                        <button 
                          onClick={() => setSelectedMessage({
                            ...message,
                            message: message.previewText + '\n\n[This would be the full message content...]'
                          })}
                          className="read-btn"
                          aria-label={`Read message from ${message.senderName}`}
                        >
                          <Eye size={18} />
                          <span>Read Full Message</span>
                        </button>
                      </div>
                    )}
                    
                    <div className="message-meta">
                      <span>Created: {new Date(message.createdAt).toLocaleDateString()}</span>
                      {message.views !== undefined && (
                        <span> • {message.views} view{message.views !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}          {searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="no-results">
              <div className="no-results-icon">
                <SearchIcon size={48} />
              </div>
              <h3>No messages found</h3>
              <p>We couldn't find any messages from "<strong>{searchQuery}</strong>"</p>
              <p>They might not have written anything yet, or their messages might be scheduled for later delivery.</p>
              <div className="no-results-actions">
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                >
                  <ArrowLeft size={16} />
                  <span>Try Another Search</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
