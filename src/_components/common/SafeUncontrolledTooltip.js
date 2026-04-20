import React, { useState, useEffect } from "react";
import { UncontrolledTooltip } from "reactstrap";

/**
 * SafeUncontrolledTooltip guards against a reactstrap race condition where
 * TooltipPopoverWrapper.render crashes with "Cannot read properties of null
 * (reading '0')" when the target DOM element is not yet mounted.
 *
 * This wrapper defers rendering until after mount so the target element is
 * guaranteed to be in the DOM.
 */
const SafeUncontrolledTooltip = ({ target, ...props }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <UncontrolledTooltip target={target} {...props} />;
};

export default SafeUncontrolledTooltip;
