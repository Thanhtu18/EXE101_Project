import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You could log to an external service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl text-center bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-2">
              Unexpected Application Error
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Sorry — something went wrong. Try refreshing the page or contact
              support.
            </p>
            <pre className="text-xs text-left bg-gray-100 p-3 rounded max-h-48 overflow-auto">
              {String(this.state.error)}
            </pre>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
