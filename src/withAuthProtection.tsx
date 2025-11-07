import React from "react";
import { Navigate, useParams } from "react-router-dom";

// Define the HOC
function withAuthProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const token = localStorage.getItem("authToken");
    const { authToken } = useParams<{ authToken: string }>();
    // Redirect if not authenticated

    if (!token && !authToken) {
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
