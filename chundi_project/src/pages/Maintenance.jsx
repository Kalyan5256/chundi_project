import { useState } from 'react'
import logoText from '../assets/logo_text.svg'
import maintenanceVideo from '../assets/now_set_background_only_white.mp4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faXTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons'

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
              <FontAwesomeIcon icon={faFacebook} size="sm" />
            </a>
            
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="maintenance-social-circle"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faXTwitter} size="sm" />
            </a>

            {/* Telegram */}
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="maintenance-social-circle"
              aria-label="Telegram"
            >
              <FontAwesomeIcon icon={faTelegram} size="sm" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Maintenance
