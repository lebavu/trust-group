import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error: ", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className="flex h-[80vh] w-full flex-col items-center justify-center">
          <h1 className="text-9xl font-extrabold tracking-widest text-gray-900">500</h1>
          <div className="absolute rotate-12 rounded bg-secondary px-2 text-sm text-white">Error!</div>
          <button className="mt-5">
            <a
              href="/"
              className="active:text-secondary/[.7] group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring"
            >
              <span className="relative flex bg-secondary h-[3.5rem] h-[2.5rem] font-medium min-w-[8rem] nowrap text-[1.4rem] w-full items-center justify-center py-0 px-6 rounded-[.5rem] text-white hover:bg-secondary/[.8]">
                <Link to={"/"}>Go Home</Link>
              </span>
            </a>
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
