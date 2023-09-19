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
const UpdateUser = lazy(() => import("@/pages/Users/EditUser"));
const EValuations = lazy(() => import("@/pages/EValuations"));
const UpdateEValuation = lazy(() => import("@/pages/EValuations/Update"));
const EValuationCategories = lazy(() => import("@/pages/EValuationCategories"));
const ProductCategories = lazy(() => import("@/pages/ProductCategories"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const InstalmentPlans = lazy(() => import("@/pages/InstalmentPlans"));
const PawnTickets = lazy(() => import("@/pages/PawnTickets"));
const UpdatePawnTicket = lazy(() => import("@/pages/PawnTickets/Update"));
const Products = lazy(() => import("@/pages/Products"));
const Profile = lazy(() => import("@/pages/Profile"));
const Projects = lazy(() => import("@/pages/Projects"));
const Roles = lazy(() => import("@/pages/Roles"));
const Stories = lazy(() => import("@/pages/Stories"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));

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
          path: path.UpdateUser,
          element: (
            <MainLayout>
              <Suspense>
                <UpdateUser />
              </Suspense>
            </MainLayout>
          )
        },
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
        {
          path: path.Stories,
          element: (
            <MainLayout>
              <Suspense>
                <Stories />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.Branches,
          element: (
            <MainLayout>
              <Suspense>
                <Branches />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.Blogs,
          element: (
            <MainLayout>
              <Suspense>
                <Blogs />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.EValuations,
          element: (
            <MainLayout>
              <Suspense>
                <EValuations />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.UpdateEValuation,
          element: (
            <MainLayout>
              <Suspense>
                <UpdateEValuation />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.EValuationCategories,
          element: (
            <MainLayout>
              <Suspense>
                <EValuationCategories />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.ProductCategories,
          element: (
            <MainLayout>
              <Suspense>
                <ProductCategories />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.InstalmentPlans,
          element: (
            <MainLayout>
              <Suspense>
                <InstalmentPlans />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.PawnTickets,
          element: (
            <MainLayout>
              <Suspense>
                <PawnTickets />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.UpdatePawnTicket,
          element: (
            <MainLayout>
              <Suspense>
                <UpdatePawnTicket />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.Products,
          element: (
            <MainLayout>
              <Suspense>
                <Products />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.Projects,
          element: (
            <MainLayout>
              <Suspense>
                <Projects />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.Roles,
          element: (
            <MainLayout>
              <Suspense>
                <Roles />
              </Suspense>
            </MainLayout>
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
    },
    {
      path: path.Unauthorized,
      element: (
        <NoneLayout>
          <Suspense>
            <Unauthorized />
          </Suspense>
        </NoneLayout>
      )
    }
  ]);
  return routeElements;
};
