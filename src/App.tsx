import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { publicRoutes } from "@/routes";
import DefaultLayout from "@/layouts/DefaultLayout";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout: React.ComponentType = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = React.Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
