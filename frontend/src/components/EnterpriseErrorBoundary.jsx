import React from 'react';

class EnterpriseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Enterprise Error Boundary caught error:', error);
    console.error('📊 Error Info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    console.log('🔄 Enterprise retry attempt:', this.state.retryCount + 1);
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center space-y-6 p-8">
            <div className="space-y-4">
              <div className="text-6xl">⚠️</div>
              <h1 className="text-3xl font-bold text-red-400">
                Enterprise System Recovery
              </h1>
              <p className="text-lg text-gray-300">
                The game encountered an unexpected issue, but our enterprise-grade recovery system is ready.
              </p>
            </div>
            
            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-800 p-4 rounded-lg text-left space-y-2">
                <h3 className="text-red-400 font-semibold">Error Details:</h3>
                <pre className="text-xs text-red-300 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                </pre>
                <pre className="text-xs text-gray-400 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            
            {/* Recovery Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200"
                >
                  🔄 Retry Game ({this.state.retryCount + 1}/3)
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  🔄 Full Reload
                </button>
              </div>
              
              {this.state.retryCount >= 2 && (
                <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    💡 <strong>Multiple retry attempts detected.</strong> 
                    Try refreshing the entire page or check your browser console for more details.
                  </p>
                </div>
              )}
            </div>
            
            {/* Enterprise Features */}
            <div className="text-sm text-gray-400 space-y-1">
              <p>🔧 Enterprise-grade error recovery</p>
              <p>📊 Detailed error reporting</p>
              <p>🛡️ Automatic issue prevention</p>
              <p>⚡ Optimized for reliability</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnterpriseErrorBoundary;