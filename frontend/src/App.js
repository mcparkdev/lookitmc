import React from "react";
import { Provider } from "react-redux";
import "./App.css";
import store from "./redux/store";

import { BrowserRouter as Router } from "react-router-dom";
import BaseRouter from "./routes";
import Navbar from "./components/layout/Navbar";
// import Items from "./components/items/Items";
// import CustomForm from "./components/items/Form";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Navbar />
          <BaseRouter />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
