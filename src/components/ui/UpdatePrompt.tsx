import { useEffect, useState, Component, type ReactNode } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

function UpdatePromptInner() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Check for updates every hour
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    setShowPrompt(needRefresh);
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setNeedRefresh(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] max-w-md mx-auto">
      <div className="bg-gray-900 text-white rounded-xl p-4 shadow-2xl flex items-center gap-3">
        <div className="bg-brand/20 text-brand p-2 rounded-full shrink-0">
          <RefreshCw size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Update Available</p>
          <p className="text-xs text-gray-400">A new version is ready to install</p>
        </div>
        <button
          onClick={handleUpdate}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold shrink-0 active:scale-95 transition-transform"
        >
          Update
        </button>
        <button
          onClick={handleDismiss}
          className="p-2 text-gray-400 hover:text-white shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

// Error boundary wrapper to prevent PWA issues from crashing the app

interface ErrorBoundaryState {
  hasError: boolean;
}

class UpdatePromptErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UpdatePrompt error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Silently fail - PWA update prompt is not critical
      return null;
    }
    return this.props.children;
  }
}

export function UpdatePrompt() {
  return (
    <UpdatePromptErrorBoundary>
      <UpdatePromptInner />
    </UpdatePromptErrorBoundary>
  );
}
