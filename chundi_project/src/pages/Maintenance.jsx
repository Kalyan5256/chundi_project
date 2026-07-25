import { useState } from 'react'
import logoText from '../assets/logo_text.svg'
import maintenanceVideo from '../assets/now_set_background_only_white.mp4'

function Maintenance() {
  return (
    <div className="maintenance-wrapper">
      {/* Header / Brand Logo (Centered) */}
      <header className="maintenance-header">
        <div className="maintenance-brand">
          <img 
            src={logoText} 
            alt="Chundi Logo" 
            className="maintenance-logo-img"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="maintenance-main">
        {/* Main Heading */}
        <h1 className="maintenance-heading">
          Great minds at work.
        </h1>

        {/* Subheading */}
        <p className="maintenance-subheading">
          We are working on it! We will be back soon with a better experience.
        </p>

        {/* Video Animation (GIF/Lottie style) */}
        <div className="maintenance-video-container">
          <video 
            src={maintenanceVideo} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="maintenance-video"
          />
        </div>
      </main>

      {/* Footer Area */}
      <footer className="maintenance-footer">
        <div className="maintenance-footer-inner">
          {/* Contact Details */}
          <div className="maintenance-contact">
            <span>You can contact us:</span>
            <div className="maintenance-contact-links">
              <span className="maintenance-contact-detail">
                Phone: <a href="tel:+15551234567" className="maintenance-contact-link">+1 (555) 123-4567</a>
              </span>
              <span className="maintenance-contact-detail">
                Email: <a href="mailto:tech@chundi.com" className="maintenance-contact-link">tech@chundi.com</a>
              </span>
            </div>
          </div>

          {/* Social circular buttons */}
          <div className="maintenance-socials">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="maintenance-social-circle"
              aria-label="Facebook"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h3v-9h3.6L18 8h-3V6c0-.5.5-1 1-1h2V2h-3C11.5 2 9 4.5 9 8z" />
              </svg>
            </a>
            
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="maintenance-social-circle"
              aria-label="Twitter"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Telegram */}
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="maintenance-social-circle"
              aria-label="Telegram"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.78 18.65l.28-4.28 7.76-7.01c.34-.3-.07-.47-.52-.17l-9.6 6.04-4.15-1.3c-.9-.28-.92-.9.19-1.33l16.2-6.24c.75-.28 1.4.17 1.15 1.25l-2.75 12.98c-.2.93-.76 1.16-1.53.73l-4.19-3.09-2.02 1.95c-.22.22-.4.4-.82.4z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Maintenance
