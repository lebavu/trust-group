import React, { ReactElement, ComponentType } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "@/routes";
import DefaultLayout from "@/layouts/DefaultLayout";
import { QueryClientProvider, QueryClient } from "react-query";
import { StateContextProvider } from "@/context";
import AuthMiddleware from "@/middleware/AuthMiddleware";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RouteConfig {
  path: string;
  component: ComponentType;
  layout?: ComponentType<any> | null;
}

function App(): ReactElement {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <StateContextProvider>
          <AuthMiddleware>
            <div className='App'>
              <Routes>
                {publicRoutes.map((route: RouteConfig, index: number) => {
                  const Page = route.component;
                  let Layout: ComponentType<any> = DefaultLayout;
                  if (route.layout) {
                    Layout = route.layout;
                  } else if (route.layout === null) {
                    Layout = React.Fragment;
                  }

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={<Layout>{<Page />}</Layout>}
                    />
                  );
                })}
              </Routes>
            </div>
          </AuthMiddleware>
        </StateContextProvider>
      </Router>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
