import React, { ReactElement, ComponentType } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "@/routes";
import DefaultLayout from "@/layouts/DefaultLayout";

interface RouteConfig {
  path: string;
  component: ComponentType;
  layout?: ComponentType<any> | null;
}

function App(): ReactElement {
  return (
    <Router>
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

            return <Route key={index} path={route.path} element={<Layout>{<Page />}</Layout>} />;
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
