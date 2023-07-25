import { Link, useMatch } from "react-router-dom";
import Typography from "@mui/material/Typography";

export default function LoginHeader() {
  const signUpMatch = useMatch("/sign-up");
  const isSignUp = Boolean(signUpMatch);
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
                color: "#fff",
              }}
            >
                Trust Group
            </Typography>
          </Link>
          <div className='ml-5 pl-5 text-xl lg:text-2xl border-0 border-l-[1px] border-white border-solid '>{isSignUp ? "Login" : "Sign Up"}</div>
        </nav>
      </div>
    </header>
  );
}
