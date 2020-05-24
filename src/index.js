import React from "react";
import ReactDOM from "react-dom";

import PomodoroClock from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <PomodoroClock />
  </React.StrictMode>,
  rootElement
);
