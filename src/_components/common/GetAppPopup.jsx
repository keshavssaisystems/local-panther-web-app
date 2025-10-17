import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import openworxLogo from '../../assets/utils/images/panther-logo.png'; // Path to OpenWorX logo
import googlePlay from '../../assets/utils/images/google-play-badge.png'; // Path to Google Play badge
import appStore from '../../assets/utils/images/app-store-badge.png'; // Path to App Store badge
import qrCode from '../../assets/utils/images/qr-code.png'; // Placeholder for QR code image
import mobileMockup from '../../assets/utils/images/mobile-mockup.png'; // Placeholder for Mobile Mockup image
import './GetAppPopup.scss';

const GetAppPopup = ({ isOpen, toggle }) => {
  return (

    <Modal isOpen={isOpen} toggle={toggle} className="get-app-modal" backdrop="static" keyboard={false}>
      <div className="custom-modal-header">
        <button type="button" className="close" onClick={toggle}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <ModalBody>
        <div className="get-app-container">
          {/* App Content */}
          <div className="app-content">
            <img src={openworxLogo} alt="OpenWorX Logo" className="app-logo" />

            <h2>Grab the app for the best experience - all features, anytime, anywhere!</h2>
            <p className="download-text">Download the app to find your next job</p>

            {/* QR Code Section */}
            <div className="qr-code-section">
              <img src={qrCode} alt="QR Code" className="qr-code-img" />
              <p className="qr-text">Scan this QR code to download the app now!</p>
            </div>

            <p className="or-download-from">Or download from</p>

            {/* App Badges */}
            <div className="app-badges">
              <a href={process.env.REACT_APP_GOOGLE_PLAY_LINK} target="_blank" rel="noopener noreferrer">
                <img src={googlePlay} alt="Get it on Google Play" className="app-badge" />
              </a>
              <a href={process.env.REACT_APP_APP_STORE_LINK} target="_blank" rel="noopener noreferrer">
                <img src={appStore} alt="Download on the App Store" className="app-badge" />
              </a>
            </div>
          </div>

          {/* Mobile Mockup Section */}
          <div className="mobile-mockup-section">
            <img src={mobileMockup} alt="Mobile App Mockup" className="mobile-mockup-img" />
          </div>
        </div>
      </ModalBody>
    </Modal>

  );
};

export default GetAppPopup;
