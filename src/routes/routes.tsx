import config from "@/config";

// Pages
import Home from "@/pages/Home";
import Blogs from "@/pages/Blogs";
import Branches from "@/pages/Branches";
import EValuationCategories from "@/pages/EValuationCategories";
import EValuations from "@/pages/EValuations";
import InstalmentPlans from "@/pages/InstalmentPlans";
import PawnTickets from "@/pages/PawnTickets";
import ProductCategories from "@/pages/ProductCategories";
import Products from "@/pages/Products";
import Projects from "@/pages/Projects";
import Roles from "@/pages/Roles";
import Stories from "@/pages/Stories";
import Users from "@/pages/Users";
import Login from "@/pages/Login/Login";
import SignUp from "@/pages/SignUp/SignUp";
import MyAccount from "@/pages/MyAccount";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifiedCodeForgot from "@/pages/VerifiedCodeForgot";

interface Route {
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any> | null;
}

// Public routes
const publicRoutes: Route[] = [
  { path: config.routes.Home, component: Home },
  { path: config.routes.Blogs, component: Blogs },
  { path: config.routes.Branches, component: Branches },
  { path: config.routes.EValuationCategories, component: EValuationCategories },
  { path: config.routes.EValuations, component: EValuations },
  { path: config.routes.InstalmentPlans, component: InstalmentPlans },
  { path: config.routes.PawnTickets, component: PawnTickets },
  { path: config.routes.ProductCategories, component: ProductCategories },
  { path: config.routes.Products, component: Products },
  { path: config.routes.Projects, component: Projects },
  { path: config.routes.Roles, component: Roles },
  { path: config.routes.Stories, component: Stories },
  { path: config.routes.Users, component: Users },
  { path: config.routes.Login, component: Login, layout: null },
  { path: config.routes.SignUp, component: SignUp, layout: null },
  { path: config.routes.MyAccount, component: MyAccount },
  { path: config.routes.ForgotPassword, component: ForgotPassword, layout: null },
  { path: config.routes.VerifiedCodeForgot, component: VerifiedCodeForgot, layout: null },
];

const privateRoutes: Route[] = [];

export { publicRoutes, privateRoutes };
