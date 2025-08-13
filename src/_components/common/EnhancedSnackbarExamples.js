import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { showSnackbar } from '_store/snackbar.slice';
import { SNACKBAR_TYPES, SNACKBAR_POSITION } from '_constants/snackbarMessages';
import { 
  FaEye, 
  FaDownload, 
  FaBell, 
  FaCheck, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaLink,
  FaUndo,
  FaTimes
} from 'react-icons/fa';

export const EnhancedSnackbarExamples = () => {
  const dispatch = useDispatch();

  // Basic usage examples
  const showBasicSuccess = () => {
    dispatch(showSnackbar({
      message: "Operation completed successfully!",
      type: SNACKBAR_TYPES.SUCCESS,
      showIcon: true
    }));
  };

  const showBasicError = () => {
    dispatch(showSnackbar({
      message: "Something went wrong!",
      type: SNACKBAR_TYPES.DANGER,
      showIcon: true
    }));
  };

  const showBasicWarning = () => {
    dispatch(showSnackbar({
      message: "Please check your input!",
      type: SNACKBAR_TYPES.WARNING,
      showIcon: true
    }));
  };

  const showBasicInfo = () => {
    dispatch(showSnackbar({
      message: "Here's some information for you.",
      type: SNACKBAR_TYPES.INFO,
      showIcon: true
    }));
  };

  // Rich text examples
  const showRichText = () => {
    dispatch(showSnackbar({
      message: "This is a **bold message** with *italic text* and [a link](https://example.com) and `code` formatting",
      type: SNACKBAR_TYPES.INFO,
      richText: true,
      position: SNACKBAR_POSITION.TOP_CENTER,
      autoClose: true,
      autoCloseDelay: 5000,
      multiline: true,
      closeButtonAlignment: "bottom"
    }));
  };

  // With title and subtitle
  const showWithTitle = () => {
    dispatch(showSnackbar({
      message: "Your profile has been updated successfully. All changes have been saved to your account.",
      type: SNACKBAR_TYPES.SUCCESS,
      title: "Profile Updated",
      subtitle: "Changes saved at " + new Date().toLocaleTimeString(),
      showTimestamp: true,
      multiline: true,
      closeButtonAlignment: "center"
    }));
  };

  // With actions
  const showWithActions = () => {
    dispatch(showSnackbar({
      message: "File uploaded successfully",
      type: SNACKBAR_TYPES.SUCCESS,
      actions: [
        {
          text: "View",
          icon: <FaEye />,
          onClick: () => console.log("View clicked")
        },
        {
          text: "Download",
          icon: <FaDownload />,
          onClick: () => console.log("Download clicked")
        }
      ],
      showUndoButton: true,
      undoButtonText: "Undo Upload",
      onUndo: () => console.log("Undo clicked")
    }));
  };

  // With progress bar
  const showWithProgress = () => {
    dispatch(showSnackbar({
      message: "Processing your request...",
      type: SNACKBAR_TYPES.INFO,
      showProgress: true,
      persistent: true,
      autoClose: false,
      showIcon: true,
      onClose: () => console.log("Processing cancelled")
    }));
  };

  // Custom styling
  const showCustomStyled = () => {
    dispatch(showSnackbar({
      message: "Custom styled alert with unique appearance",
      type: SNACKBAR_TYPES.WARNING,
      showIcon: true,
      customStyles: {
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: '2px solid #ff5252',
        borderRadius: '15px'
      },
      customClassName: 'my-custom-snackbar',
      animation: 'bounceIn',
      animationDuration: 500
    }));
  };

  // Without icon
  const showWithoutIcon = () => {
    dispatch(showSnackbar({
      message: "This alert has no icon",
      type: SNACKBAR_TYPES.INFO,
      showIcon: false
    }));
  };

  // With custom icon
  const showWithCustomIcon = () => {
    dispatch(showSnackbar({
      message: "This alert has a custom icon",
      type: SNACKBAR_TYPES.SUCCESS,
      icon: <FaBell style={{color: '#ff6b6b'}} />
    }));
  };

  // With sound and vibration
  const showWithSound = () => {
    dispatch(showSnackbar({
      message: "New message received!",
      type: SNACKBAR_TYPES.INFO,
      sound: '/sounds/notification.mp3', // Add your sound file
      vibration: true,
      showIcon: true,
      icon: <FaBell />
    }));
  };

  // Different positions
  const showTopRight = () => {
    dispatch(showSnackbar("Top right notification", SNACKBAR_TYPES.SUCCESS, {
      position: SNACKBAR_POSITION.TOP_RIGHT
    }));
  };

  const showBottomLeft = () => {
    dispatch(showSnackbar("Bottom left notification", SNACKBAR_TYPES.INFO, {
      position: SNACKBAR_POSITION.BOTTOM_LEFT
    }));
  };

  // Different animations
  const showBounceAnimation = () => {
    dispatch(showSnackbar({
      message: "Bounce animation!",
      type: SNACKBAR_TYPES.SUCCESS,
      animation: 'bounceIn',
      animationDuration: 500
    }));
  };

  const showZoomAnimation = () => {
    dispatch(showSnackbar({
      message: "Zoom animation!",
      type: SNACKBAR_TYPES.WARNING,
      animation: 'zoomIn',
      animationDuration: 300
    }));
  };

  // Persistent notification
  const showPersistent = () => {
    dispatch(showSnackbar({
      message: "This notification will stay until you close it manually",
      type: SNACKBAR_TYPES.DANGER,
      persistent: true,
      autoClose: false,
      showCloseButton: true
    }));
  };

  // RTL support
  const showRTL = () => {
    dispatch(showSnackbar({
      message: "هذا إشعار باللغة العربية",
      type: SNACKBAR_TYPES.INFO,
      rtl: true,
      position: SNACKBAR_POSITION.TOP_RIGHT
    }));
  };

  // Dark theme
  const showDarkTheme = () => {
    dispatch(showSnackbar({
      message: "Dark themed notification",
      type: SNACKBAR_TYPES.SUCCESS,
      theme: 'dark',
      position: SNACKBAR_POSITION.BOTTOM_RIGHT
    }));
  };

  // Complex example with multiple features
  const showComplexExample = () => {
    dispatch(showSnackbar({
      message: "This is a **complex notification** with multiple features including *rich text*, [links](https://example.com), and `code` formatting. It has a title, subtitle, actions, and progress bar.",
      type: SNACKBAR_TYPES.SUCCESS,
      title: "Complex Notification",
      subtitle: "Demonstrating all features",
      richText: true,
      multiline: true,
      showProgress: true,
      showTimestamp: true,
      actions: [
        {
          text: "Action 1",
          icon: <FaCheck />,
          onClick: () => console.log("Action 1 clicked")
        },
        {
          text: "Action 2",
          icon: <FaTimes />,
          onClick: () => console.log("Action 2 clicked")
        }
      ],
      showUndoButton: true,
      undoButtonText: "Undo",
      onUndo: () => console.log("Undo clicked"),
      animation: 'slideIn',
      position: SNACKBAR_POSITION.TOP_CENTER,
      autoClose: true,
      autoCloseDelay: 8000,
      minWidth: 400,
      maxWidth: 600,
      closeButtonAlignment: "bottom"
    }));
  };

  return (
    <div className="enhanced-snackbar-examples">
      <Card>
        <CardHeader>
          <h4>Enhanced Snackbar Examples</h4>
          <p className="text-muted mb-0">
            Comprehensive examples of all available features
          </p>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <h5>Basic Examples</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="success" onClick={showBasicSuccess}>
                  Success
                </Button>
                <Button color="danger" onClick={showBasicError}>
                  Error
                </Button>
                <Button color="warning" onClick={showBasicWarning}>
                  Warning
                </Button>
                <Button color="info" onClick={showBasicInfo}>
                  Info
                </Button>
              </div>

              <h5>Rich Text & Formatting</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="secondary" onClick={showRichText}>
                  Rich Text
                </Button>
                <Button color="secondary" onClick={showWithTitle}>
                  With Title
                </Button>
              </div>

              <h5>Actions & Interactions</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="primary" onClick={showWithActions}>
                  With Actions
                </Button>
                <Button color="primary" onClick={showWithProgress}>
                  With Progress
                </Button>
                <Button color="primary" onClick={showPersistent}>
                  Persistent
                </Button>
              </div>

              <h5>Icon Configuration</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="info" onClick={showWithoutIcon}>
                  Without Icon
                </Button>
                <Button color="info" onClick={showWithCustomIcon}>
                  Custom Icon
                </Button>
              </div>
            </Col>

            <Col md={6}>
              <h5>Positions</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="info" onClick={showTopRight}>
                  Top Right
                </Button>
                <Button color="info" onClick={showBottomLeft}>
                  Bottom Left
                </Button>
              </div>

              <h5>Animations</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="warning" onClick={showBounceAnimation}>
                  Bounce
                </Button>
                <Button color="warning" onClick={showZoomAnimation}>
                  Zoom
                </Button>
              </div>

              <h5>Themes & Special</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="dark" onClick={showDarkTheme}>
                  Dark Theme
                </Button>
                <Button color="secondary" onClick={showRTL}>
                  RTL Support
                </Button>
                <Button color="secondary" onClick={showWithSound}>
                  With Sound
                </Button>
              </div>

              <h5>Custom Styling</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="danger" onClick={showCustomStyled}>
                  Custom Style
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5>Complex Example</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button color="success" size="lg" onClick={showComplexExample}>
                  Show Complex Example
                </Button>
              </div>
              <div className="alert alert-info">
                <h6>Features Demonstrated:</h6>
                <ul className="mb-0">
                  <li>Rich text formatting (bold, italic, underline, links, code)</li>
                  <li>Title and subtitle</li>
                  <li>Multiple action buttons</li>
                  <li>Undo functionality</li>
                  <li>Progress bar</li>
                  <li>Timestamp</li>
                  <li>Custom positioning and sizing</li>
                  <li>Animations</li>
                  <li>Multiline support</li>
                  <li>Close button alignment</li>
                </ul>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};
