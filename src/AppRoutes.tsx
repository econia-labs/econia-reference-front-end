import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { NotFound } from "./pages/NotFound";
import { Trade } from "./pages/Trade";

export const AppRoutes: React.FC = () => {
  const location = useLocation();
  const prevLocationRef = React.useRef(location.pathname);
  if (location.pathname !== prevLocationRef.current) {
    window.scrollTo(0, 0);
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Trade />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
