import { Header } from "layout/Header";

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AppRoutes } from "./AppRoutes";

export const App: React.FC = () => {
  return (
    <div id="approot">
      <Router basename="/">
        <Header />
        <AppRoutes />
      </Router>
    </div>
  );
};
