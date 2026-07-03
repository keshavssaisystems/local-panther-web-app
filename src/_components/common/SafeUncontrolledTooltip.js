import React, { useState, useEffect } from "react";
import { UncontrolledTooltip } from "reactstrap";

/**
 * SafeUncontrolledTooltip — three-layer defence against the Reactstrap
 * TooltipPopoverWrapper crash: "Cannot read properties of null (reading '0')".
 *
 * Layer 1 — Mount delay: never render on the first pass so the target element
 *   is guaranteed to exist in the DOM before Reactstrap queries it.
 *
 * Layer 2 — DOM existence check: re-verify the target element is still in the
 *   DOM on every render. Handles route transitions and lazy-unmounts where the
 *   target disappears after the initial render.
 *
 * Layer 3 — Error boundary: if Reactstrap's internal render crashes anyway
 *   (e.g. timing race during a re-render), catch the error and return null
 *   instead of letting it propagate and white-out the page.
 */

class TooltipErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidUpdate(prevProps) {
    // Reset on target change so a fresh render is attempted
    if (prevProps.targetKey !== this.props.targetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const SafeUncontrolledTooltip = ({ target, ...props }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Verify target element is present in the DOM right now
  const el = typeof target === "string" ? document.getElementById(target) : target;
  if (!el) return null;

  return (
    <TooltipErrorBoundary targetKey={target}>
      <UncontrolledTooltip target={target} {...props} />
    </TooltipErrorBoundary>
  );
};

export default SafeUncontrolledTooltip;
