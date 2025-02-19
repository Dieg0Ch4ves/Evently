import PropTypes from "prop-types";
import Header from "../Header/Header";
import { Stack } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Stack marginTop={4} padding={2}>
        {children}
      </Stack>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
