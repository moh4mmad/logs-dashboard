import PropTypes from "prop-types";
import { Box, Unstable_Grid2 as Grid } from "@mui/material";

export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
      }}
    >
      <Grid container 
        sx={{ flex: "1 1 auto" }}>
        <Grid
          xs={12}
          lg={12}
          sx={{
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {children}{" "}
        </Grid>{" "}
      </Grid>{" "}
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node,
};
