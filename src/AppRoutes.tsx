import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { Faucet } from "./pages/Faucet";
import { NotFound } from "./pages/NotFound";
import { Swap } from "./pages/Swap";
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
        <Route path="/" element={<Swap />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/faucet" element={<Faucet />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
