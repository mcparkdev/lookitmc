import React from "react";
import { Route } from "react-router-dom";
import ItemContainer from "./components/items/ItemContainer";
import Item from "./components/items/Item";
// import ItemHooks from "./components/items/ItemHooks";

const BaseRouter = () => (
  <div>
    <Route exact path="/items/" component={ItemContainer} />
    <Route exact path="/items/:itemName" component={Item} />
  </div>
);

export default BaseRouter;
