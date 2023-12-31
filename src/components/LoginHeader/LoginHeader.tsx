import { Link, useMatch } from "react-router-dom";
import Typography from "@mui/material/Typography";

export default function LoginHeader() {
  const forgotPasswordMatch = useMatch("/forgot-password");
  const resetPasswordMatch = useMatch("/reset-password");
  const loginMatch = useMatch("/login");
  const isLogin = Boolean(loginMatch);
  const isforgotPassword = Boolean(forgotPasswordMatch);
  const isresetPassword = Boolean(resetPasswordMatch);
  return (
    <header className='h-[64px] bg-[#1e2f8d] text-white flex items-center px-[24px]'>
      <div className='container'>
        <nav className='flex items-center'>
          <Link to='/'>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontWeight: "bold",
                color: "#fff!important",
              }}
            >
                Trust Group
            </Typography>
          </Link>
          <div className='ml-5 pl-5 text-xl lg:text-2xl border-0 border-l-[1px] border-white border-solid '>
            {isforgotPassword && "Forgot Password"}
            {isresetPassword && "Reset Password"}
            {isLogin && "Login"}
            {isforgotPassword || isresetPassword || isLogin  ? "" : "Page Not Found"}
          </div>
        </nav>
      </div>
    </header>
  );
}
