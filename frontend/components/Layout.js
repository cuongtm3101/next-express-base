import React from "react";
import { Header } from "./index";
const Layout = (props) => {
  const { children } = props;
  return (
    <React.Fragment>
      <Header />

      <div>{children}</div>

      <div>Footer</div>
    </React.Fragment>
  );
};

export default Layout;
