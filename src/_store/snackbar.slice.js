import { createSlice } from "@reduxjs/toolkit";
import { SNACKBAR_TYPES, SNACKBAR_POSITION } from "_constants/snackbarMessages";

const initialState = {
  isOpen: false,
  message: "",
  type: SNACKBAR_TYPES.INFO,
  position: SNACKBAR_POSITION.TOP_CENTER,
  autoClose: true,
  autoCloseDelay: 3000,
  minWidth: 300,
  maxWidth: 600,
  showCloseButton: true,
  showUndoButton: false,
  undoButtonText: "Undo",
  animation: "slideIn", // slideIn, fadeIn, bounceIn, zoomIn
  animationDuration: 300,
  multiline: false,
  closeButtonAlignment: "top", // top, center, bottom
  richText: false, // Enable HTML/rich text support
  actions: [], // Array of action buttons
  onUndo: null, // Function to call on undo
  onClose: null, // Function to call on close
  onAction: null, // Function to call on action button click
  persistent: false, // If true, won't auto-close
  priority: 1, // Higher number = higher priority
  id: null, // Unique identifier for the snackbar
  timestamp: null,
  showProgress: false, // Show progress bar
  progressColor: null, // Custom progress bar color
  customStyles: {}, // Custom CSS styles
  customClassName: "", // Custom CSS class
  showIcon: true, // Show type icon
  icon: null, // Custom icon
  title: "", // Optional title
  subtitle: "", // Optional subtitle
  showTimestamp: false, // Show when the alert was created
  dismissible: true, // Can be dismissed by clicking outside
  pauseOnHover: true, // Pause auto-close on hover
  pauseOnFocus: true, // Pause auto-close on focus
  rtl: false, // Right-to-left support
  theme: "light", // light, dark, custom
  sound: null, // Audio notification
  vibration: false, // Mobile vibration
  accessibility: {
    ariaLabel: "",
    role: "alert",
    liveRegion: "polite"
  }
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      const {
        message,
        type = SNACKBAR_TYPES.INFO,
        position = SNACKBAR_POSITION.TOP_CENTER,
        autoClose = true,
        autoCloseDelay = 3000,
        minWidth = 300,
        maxWidth = 600,
        showCloseButton = true,
        showUndoButton = false,
        undoButtonText = "Undo",
        animation = "slideIn",
        animationDuration = 300,
        multiline = false,
        closeButtonAlignment = "top",
        richText = false,
        actions = [],
        onUndo = null,
        onClose = null,
        onAction = null,
        persistent = false,
        priority = 1,
        id = null,
        showProgress = false,
        progressColor = null,
        customStyles = {},
        customClassName = "",
        showIcon = true,
        icon = null,
        title = "",
        subtitle = "",
        showTimestamp = false,
        dismissible = true,
        pauseOnHover = true,
        pauseOnFocus = true,
        rtl = false,
        theme = "light",
        sound = null,
        vibration = false,
        accessibility = {
          ariaLabel: "",
          role: "alert",
          liveRegion: "polite"
        }
      } = action.payload;

      return {
        ...state,
        isOpen: true,
        message,
        type,
        position,
        autoClose,
        autoCloseDelay,
        minWidth,
        maxWidth,
        showCloseButton,
        showUndoButton,
        undoButtonText,
        animation,
        animationDuration,
        multiline,
        closeButtonAlignment,
        richText,
        actions,
        onUndo,
        onClose,
        onAction,
        persistent,
        priority,
        id: id || Date.now().toString(),
        timestamp: Date.now(),
        showProgress,
        progressColor,
        customStyles,
        customClassName,
        showIcon,
        icon,
        title,
        subtitle,
        showTimestamp,
        dismissible,
        pauseOnHover,
        pauseOnFocus,
        rtl,
        theme,
        sound,
        vibration,
        accessibility
      };
    },
    closeSnackbar: (state) => {
      state.isOpen = false;
    },
    updateSnackbar: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearSnackbar: () => initialState,
  },
});

export const { showSnackbar, closeSnackbar, updateSnackbar, clearSnackbar } = snackbarSlice.actions;
export const snackbarReducer = snackbarSlice.reducer;
