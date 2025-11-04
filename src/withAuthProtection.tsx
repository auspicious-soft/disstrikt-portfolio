import React from "react";
import { Navigate } from "react-router-dom";

// Define the HOC
function withAuthProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const token = localStorage.getItem("authToken");

    // Redirect if not authenticated
    if (!token) {
      return <Navigate to="/" replace />;
    }

    // Otherwise, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  // Give a readable name for React DevTools
  ComponentWithAuth.displayName = `withAuthProtection(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithAuth;
}

export default withAuthProtection;
