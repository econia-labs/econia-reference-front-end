import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { FlexCol } from "components/FlexCol";
import { Header } from "layout/Header";

import React from "react";
import Modal from "react-modal";
import { BrowserRouter as Router } from "react-router-dom";

import { css } from "@emotion/react";

import { AppRoutes } from "./AppRoutes";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);
Modal.setAppElement("#react-modal");

export const App: React.FC = () => {
  return (
    <FlexCol
      css={css`
        height: 100vh;
      `}
      id="approot"
    >
      <Router basename="/">
        <Header />
        <div
          css={css`
            flex-grow: 1;
          `}
        >
          <AppRoutes />
        </div>
      </Router>
    </FlexCol>
  );
};
