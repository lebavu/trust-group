import path from "src/constants/path";
import { useContext, lazy, Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { AppContext } from "@/context/app.context";
import MainLayout from "@/layouts/DefaultLayout";
import NoneLayout from "./layouts/NoneLayout";


const Login = lazy(() => import("@/pages/Login"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Blogs = lazy(() => import("@/pages/Blogs"));
const Home = lazy(() => import("@/pages/Home"));
const Branches = lazy(() => import("@/pages/Branches"));
const Users = lazy(() => import("@/pages/Users"));
const EValuations = lazy(() => import("@/pages/EValuations"));
const EValuationCategories = lazy(() => import("@/pages/EValuationCategories"));
const ProductCategories = lazy(() => import("@/pages/ProductCategories"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const InstalmentPlans = lazy(() => import("@/pages/InstalmentPlans"));
const PawnTickets = lazy(() => import("@/pages/PawnTickets"));
const Products = lazy(() => import("@/pages/Products"));
const Profile = lazy(() => import("@/pages/Profile"));
const Projects = lazy(() => import("@/pages/Projects"));
const Roles = lazy(() => import("@/pages/Roles"));
const Stories = lazy(() => import("@/pages/Stories"));
// const ChangePassword = lazy(() => import("@/pages/ChangePassword"));

const NotFound = lazy(() => import("@/pages/NotFound"));

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: "",
          element: <NoneLayout />,
          children: [
            {
              path: path.Login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.ForgotPassword,
              element: (
                <Suspense>
                  <ForgotPassword />
                </Suspense>
              )
            },
            {
              path: path.ResetPassword,
              element: (
                <Suspense>
                  <ResetPassword />
                </Suspense>
              )
            },

          ]
        }
      ]
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.Users,
          element: (
            <MainLayout>
              <Suspense>
                <Users />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.Profile,
          element: (
            <MainLayout>
              <Suspense>
                <Profile />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: "",
          index: true,
          element: (
            <MainLayout>
              <Suspense>
                <Home />
              </Suspense>
            </MainLayout>
          )
        },
      ]
    },
    {
      path: "",
      element: <MainLayout />,
      children: [
        {
          path: path.Stories,
          element: (
            <Suspense>
              <Stories />
            </Suspense>
          )
        },
        {
          path: path.Branches,
          element: (
            <Suspense>
              <Branches />
            </Suspense>
          )
        },
        {
          path: path.Blogs,
          element: (
            <Suspense>
              <Blogs />
            </Suspense>
          )
        },
        {
          path: path.EValuations,
          element: (
            <Suspense>
              <EValuations />
            </Suspense>
          )
        },
        {
          path: path.EValuationCategories,
          element: (
            <Suspense>
              <EValuationCategories />
            </Suspense>
          )
        },
        {
          path: path.ProductCategories,
          element: (
            <Suspense>
              <ProductCategories />
            </Suspense>
          )
        },
        {
          path: path.InstalmentPlans,
          element: (
            <Suspense>
              <InstalmentPlans />
            </Suspense>
          )
        },
        {
          path: path.PawnTickets,
          element: (
            <Suspense>
              <PawnTickets />
            </Suspense>
          )
        },
        {
          path: path.Products,
          element: (
            <Suspense>
              <Products />
            </Suspense>
          )
        },
        {
          path: path.Projects,
          element: (
            <Suspense>
              <Projects />
            </Suspense>
          )
        },
        {
          path: path.Roles,
          element: (
            <Suspense>
              <Roles />
            </Suspense>
          )
        },
      ]
    },
    {
      path: "*",
      element: (
        <NoneLayout>
          <Suspense>
            <NotFound />
          </Suspense>
        </NoneLayout>
      )
    }
  ]);
  return routeElements;
};
