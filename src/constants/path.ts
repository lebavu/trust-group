const path = {
  Home: "/",
  Blogs: "/blogs",
  Branches: "/branches",
  EValuationCategories: "/e-valuation-categories",
  EValuations: "/evaluations",
  InstalmentPlans: "/instalment-plans",
  PawnTickets: "/pawn-tickets",
  UpdatePawnTicket: "/update-pawn-ticket/:id",
  ProductCategories: "/product-categories",
  Products: "/products",
  Projects: "/projects",
  Roles: "/roles",
  Stories: "/stories",
  Users: "/users",
  Login: "/login",
  SignUp: "/sign-up",
  Profile: "/profile",
  ForgotPassword: "/forgot-password",
  ResetPassword: "/reset-password",
  NotFound: "/not-found",
  UpdateUser: "/update-user/:id",
  UpdateEValuation: "/update-e-valuation/:id"
} as const;

export default path;
