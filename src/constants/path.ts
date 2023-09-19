const path = {
  Home: "/",
  Blogs: "/blogs",
  Branches: "/branches",
  EValuationCategories: "/e-valuation-categories",
  EValuations: "/evaluations",
  InstalmentPlans: "/instalment-plans",
  PawnTickets: "/pawn-tickets",
  UpdatePawnTicket: "/pawn-tickets/update-pawn-ticket/:id",
  ProductCategories: "/product-categories",
  Products: "/products",
  Projects: "/projects",
  Roles: "/roles",
  Stories: "/stories",
  Users: "/users",
  Login: "/login",
  SignUp: "/sign-up",
  Profile: "/users/profile",
  ForgotPassword: "/forgot-password",
  ResetPassword: "/reset-password",
  NotFound: "/not-found",
  Unauthorized: "/Unauthorized",
  UpdateUser: "/users/update-user/:id",
  UpdateEValuation: "/evaluations/update-e-valuation/:id"
} as const;

export default path;
