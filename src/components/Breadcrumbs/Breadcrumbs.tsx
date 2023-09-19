import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

function AutoBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb" className="!mt-[3rem] !pb-[5rem]">
      <Link color="inherit" href="/" className="!no-underline hover:!underline">
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography key={name} color="primary" className="capitalize">
            {name}
          </Typography>
        ) : (
          <Link key={name} component={RouterLink} to={routeTo}>
            {name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default AutoBreadcrumb;
