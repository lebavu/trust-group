import useRouteElements from "./useRouteElements";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useContext } from "react";
import { LocalStorageEventTarget } from "./utils/auth";
import { AppContext } from "@/context/app.context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

/**
 * Khi url thay đổi thì các component nào dùng các hook như
 * useRoutes, useParmas, useSearchParams,...
 * sẽ bị re-render.
 * Ví dụ component `App` dưới đây bị re-render khi mà url thay đổi
 * vì dùng `useRouteElements` (đây là customhook của `useRoutes`)
 */

function App() {
  const routeElements = useRouteElements();
  const { reset } = useContext(AppContext);
  useEffect(() => {
    LocalStorageEventTarget.addEventListener("clearLS", reset);
    return () => {
      LocalStorageEventTarget.removeEventListener("clearLS", reset);
    };
  }, [reset]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        {routeElements}
        <ToastContainer />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
