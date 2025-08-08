import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeSnackbar } from '_store/snackbar.slice';
import { Alert, Button, Progress } from 'reactstrap';
import { 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaExclamationCircle,
  FaUndo,
  FaLink
} from 'react-icons/fa';
import './EnhancedSnackbar.scss';

export const EnhancedSnackbar = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const timeoutRef = useRef(null);
  const progressRef = useRef(null);
  const audioRef = useRef(null);

  // Get icon based on type
  const getIcon = () => {
    // If custom icon is provided, use it
    if (snackbar.icon) return snackbar.icon;
    
    // If showIcon is false, don't show any icon
    if (!snackbar.showIcon) return null;
    
    switch (snackbar.type) {
      case 'success':
        return <FaCheck />;
      case 'danger':
        return <FaExclamationCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  // Map snackbar type to Reactstrap Alert color
  const getAlertColor = () => {
    switch (snackbar.type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  // Get close button alignment class
  const getCloseButtonAlignment = () => {
    if (snackbar.multiline) {
      return `snackbar-close-${snackbar.closeButtonAlignment}`;
    }
    return 'snackbar-close-center';
  };

  // Handle rich text rendering
  const renderRichText = (text) => {
    if (!snackbar.richText) return text;

    // Replace markdown-like syntax with HTML
    let processedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="snackbar-link">$1</a>')
      .replace(/`(.*?)`/g, '<code>$1</code>');

    return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  // Handle action button click
  const handleActionClick = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    if (snackbar.onAction) {
      snackbar.onAction(action);
    }
    dispatch(closeSnackbar());
  };

  // Handle undo
  const handleUndo = () => {
    if (snackbar.onUndo) {
      snackbar.onUndo();
    }
    dispatch(closeSnackbar());
  };

  // Handle close
  const handleClose = () => {
    if (snackbar.onClose) {
      snackbar.onClose();
    }
    dispatch(closeSnackbar());
  };

  // Handle outside click
  const handleOutsideClick = (e) => {
    if (snackbar.dismissible && e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Progress should not pause on hover/focus; no-op handlers removed

  // Progress bar effect (animate on visible, auto-close at zero)
  useEffect(() => {
    if (!snackbar.isOpen || !snackbar.showProgress) return;

    const startTime = Date.now();
    const duration = snackbar.autoCloseDelay || 3000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(newProgress);

      if (newProgress > 0) {
        progressRef.current = requestAnimationFrame(updateProgress);
      } else {
        // Auto close when reaches zero regardless of autoClose flag
        handleClose();
      }
    };

    progressRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (progressRef.current) {
        cancelAnimationFrame(progressRef.current);
      }
    };
  }, [snackbar.isOpen, snackbar.showProgress, snackbar.autoCloseDelay]);

  // Reset progress on open so it starts full regardless of autoClose setting
  useEffect(() => {
    if (snackbar.isOpen && snackbar.showProgress) {
      setProgress(100);
    }
  }, [snackbar.isOpen, snackbar.showProgress]);

  // Auto-close functionality (only when no progress bar)
  useEffect(() => {
    if (snackbar.isOpen && snackbar.autoClose && !snackbar.persistent && !snackbar.showProgress) {
      setIsVisible(true);
      setProgress(100);

      if (snackbar.sound && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      if (snackbar.vibration && navigator.vibrate) {
        navigator.vibrate(200);
      }

      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, snackbar.autoCloseDelay);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else if (!snackbar.isOpen) {
      setIsVisible(false);
    }
  }, [snackbar.isOpen, snackbar.autoClose, snackbar.autoCloseDelay, snackbar.persistent, snackbar.showProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (progressRef.current) {
        cancelAnimationFrame(progressRef.current);
      }
    };
  }, []);

  if (!snackbar.isOpen) return null;

  return (
    <div
      className={`enhanced-snackbar enhanced-snackbar--${snackbar.position} enhanced-snackbar--${snackbar.theme} ${snackbar.customClassName}`}
      style={{
        minWidth: `${snackbar.minWidth}px`,
        maxWidth: `${snackbar.maxWidth}px`,
        direction: snackbar.rtl ? 'rtl' : 'ltr',
        ...snackbar.customStyles
      }}
      onClick={handleOutsideClick}
      role={snackbar.accessibility.role}
      aria-live={snackbar.accessibility.liveRegion}
      aria-label={snackbar.accessibility.ariaLabel || snackbar.message}
    >
      <div className={`enhanced-snackbar__container enhanced-snackbar__container--${snackbar.animation}`}>
        <Alert
          color={getAlertColor()}
          className={`enhanced-snackbar__alert ${snackbar.multiline ? 'enhanced-snackbar__alert--multiline' : ''}`}
        >
          <div className="enhanced-snackbar__content">
            {getIcon() && (
              <div className="enhanced-snackbar__icon">
                {getIcon()}
              </div>
            )}
            
            <div className="enhanced-snackbar__text">
              {snackbar.title && (
                <div className="enhanced-snackbar__title">
                  {renderRichText(snackbar.title)}
                </div>
              )}
              
              <div className="enhanced-snackbar__message">
                {renderRichText(snackbar.message)}
              </div>
              
              {snackbar.subtitle && (
                <div className="enhanced-snackbar__subtitle">
                  {renderRichText(snackbar.subtitle)}
                </div>
              )}
              
              {snackbar.showTimestamp && (
                <div className="enhanced-snackbar__timestamp">
                  {new Date(snackbar.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className={`enhanced-snackbar__actions ${getCloseButtonAlignment()}`}>
              {snackbar.actions.map((action, index) => (
                <Button
                  key={index}
                  color="link"
                  size="sm"
                  onClick={() => handleActionClick(action)}
                  className="enhanced-snackbar__action-btn"
                >
                  {action.icon && <span className="enhanced-snackbar__action-icon">{action.icon}</span>}
                  {action.text}
                </Button>
              ))}
              
              {snackbar.showUndoButton && (
                <Button
                  color="link"
                  size="sm"
                  onClick={handleUndo}
                  className="enhanced-snackbar__undo-btn"
                >
                  <FaUndo />
                  {snackbar.undoButtonText}
                </Button>
              )}
              
              {snackbar.showCloseButton && (
                <Button
                  color="link"
                  size="sm"
                  onClick={handleClose}
                  className="enhanced-snackbar__close-btn"
                  aria-label="Close notification"
                >
                  <FaTimes />
                </Button>
              )}
            </div>
          </div>

          {snackbar.showProgress && (
            <div className="enhanced-snackbar__progress">
              <Progress
                value={progress}
                color={snackbar.progressColor || snackbar.type}
                className="enhanced-snackbar__progress-bar"
              />
            </div>
          )}
        </Alert>
      </div>

      {snackbar.sound && (
        <audio ref={audioRef} src={snackbar.sound} preload="auto" />
      )}
    </div>
  );
};
