import React from "react";
import {
  Box,
  Breadcrumbs,
  Typography,
  Link,
  Stack,
  Grid,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { DARK_PURPLE } from "./colors";

const formatBreadcrumbName = (name) => {
  // Convert camelCase or kebab-case to separate words and capitalize each word
  return name
    .split(/[-_]|(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const BreadcrumbsHeader = ({ pageTitle }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Box sx={{ mb: 0 }}>
      <Breadcrumbs
        separator={
          <NavigateNextIcon sx={{ fontSize: 16, color: "primary.main" }} />
        }
        aria-label="breadcrumb"
      >
        <Link
          component={RouterLink}
          to="/settings"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "primary.main",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          <img
            src={"./Icons/home.svg"}
            alt="logo"
            style={{ width: 15, height: 20 }}
          />
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const formattedName = formatBreadcrumbName(name);

          return isLast ? (
            <Typography
              key={name}
              sx={{
                color: "primary.main",
                textTransform: "capitalize",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {formattedName.toUpperCase()}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={routeTo}
              key={name}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
                textTransform: "capitalize",
                fontSize: "12px",
              }}
            >
              {formattedName}
            </Link>
          );
        })}
      </Breadcrumbs>
      
      <Grid item xs={12} md={12} lg={12} mt={1}>
        <Stack direction="row" spacing={0}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "28px",
              letterSpacing: "0%",
            }}
            color={DARK_PURPLE}
          >
            {pageTitle}
          </Typography>
        </Stack>
      </Grid>
      <Divider sx={{ mt: 1 }} />
    </Box>
  );
};

export default BreadcrumbsHeader;
