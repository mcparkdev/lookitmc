import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getItems, getInput, postInput } from "../../redux/index";
import DetailItem from "./DetailItem";
import QuickItem from "./QuickItem";
import ItemView from "../layout/ItemView";
import RelativeTime from "./RelativeTime";
import PriceFilter from "./PriceFilter";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const UpdateButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#0071e3"),
    backgroundColor: "#0071e3",
    "&:hover": {
      backgroundColor: "#007FFF;",
    },
  },
}))(Button);

function ItemHooks({ props, match }) {
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [includeText, setIncludeText] = useState("");
  const [excludeText, setExcludeText] = useState("");
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState([]);
  const [itemsFiltered, setItemsFiltered] = useState([]);

  useEffect(() => {
    console.log(props);
    setItemName(props.match.params.itemName);
    setItems(props.items);
    console.log(itemName);
    getInput(itemName);
    console.log("items");
  }, []);

  useEffect(() => {
    const itemsPriceFiltered = items.filter((item) => {
      if (minValue)
        if (maxValue)
          return (
            item.price >= parseInt(minValue) && item.price <= parseInt(maxValue)
          );
        else return item.price >= parseInt(minValue);
      else if (maxValue) return item.price <= parseInt(maxValue);
      else return items;
    });
    const itemsIncludeFiltered = itemsPriceFiltered.filter((item) => {
      const result = Object.values(item).join(" ").toLowerCase();
      return result.includes(includeText.toLowerCase());
    });
    // const exclude = exclude.split(",").toLowerCase();
    const itemsExcludeFiltered = itemsIncludeFiltered.filter((item) => {
      if (excludeText !== "") {
        const result = Object.values(item).join(" ").toLowerCase();
        return !result.includes(excludeText.toLowerCase());
      } else return true;
    });
    setItemsFiltered(itemsExcludeFiltered);
  }, [items, minValue, maxValue, includeText, excludeText]);

  const handleChangeMinValue = (event) => setMinValue(event.target.value);
  const handleChangeMaxValue = (event) => setMaxValue(event.target.value);

  // const handleChangeIncludeText = (event) => {
  //   console.log(event.key);
  //   // if (event.keyCode === )
  //   setState({
  //     includeText: event.target.value,
  //   });
  // };

  // const handleChangeExcludeText = (event) => {
  //   setState({
  //     excludeText: event.target.value,
  //   });
  // };

  const handleChangeUpdate = () => {
    const itemName = props.match.params.itemName;
    props.postInput(itemName);
  };

  // console.log(items);
  return (
    <React.Fragment>
      <div className="main">
        <div className="main-summary-filter">
          <div className="main-summary">
            <div className="main-summary-title">
              {props.input ? props.input : "All"}
            </div>
            <div className="main-summary-num">
              <div className="main-summary-num-stores">
                <span className="main-summary-num-stores-num">6 </span>
                <span className="main-summary-num-stores-text">stores</span>
              </div>
              <div className="main-summary-num-items">
                <span className="main-summary-num-items-num">
                  {itemsFiltered.length}{" "}
                </span>
                <span className="main-summary-num-items-text">items</span>
              </div>
            </div>
            <div className="main-summary-update">
              <UpdateButton
                variant="contained"
                color="primary"
                size="small"
                onClick={handleChangeUpdate}
              >
                Update
              </UpdateButton>
              <span className="main-summary-last-update">
                Last Update: <RelativeTime createdAt={props.createdAt} />
              </span>
            </div>
          </div>
          <div className="main-filter">
            <div className="main-filter-title">Filters</div>
            <div className="main-filter-price-text-store">
              <div className="main-filter-price">
                <div className="main-filter-price-min">
                  <PriceFilter
                    label="Minimum Price"
                    value={minValue}
                    onChange={handleChangeMinValue}
                  />
                </div>
                <div className="main-filter-price-max">
                  <PriceFilter
                    label="Maximum Price"
                    value={maxValue}
                    onChange={handleChangeMaxValue}
                  />
                </div>
              </div>
              <div className="main-filter-text">
                <div className="main-filter-text-field">
                  <Autocomplete
                    multiple
                    id="include-tag"
                    options={[]}
                    value={includeText}
                    onChange={(e, newval, reason) => {
                      setIncludeText(newval);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // variant="outlined"
                        style={{ minWidth: "20vw" }}
                        label="Include tag"
                        placeholder="Include"
                        onKeyDown={(e) => {
                          if (e.keyCode === 13 && e.target.value) {
                            setIncludeText(includeText.concat(e.target.value));
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="main-filter-text-field">
                  <Autocomplete
                    multiple
                    id="exclude-tag"
                    options={[]}
                    value={includeText}
                    onChange={(e, newval, reason) => {
                      setExcludeText(newval);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // variant="outlined"
                        style={{ minWidth: "20vw" }}
                        label="Include tag"
                        placeholder="Include"
                        onKeyDown={(e) => {
                          if (e.keyCode === 13 && e.target.value) {
                            setExcludeText(excludeText.concat(e.target.value));
                          }
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-items">
          <ItemView
            title="DetailedView"
            width="70%"
            border={{ borderRight: 0, borderBottom: 0 }}
          >
            <div className="main-items-view-content" style={{ borderRight: 0 }}>
              {itemsFiltered.map((item) => (
                <DetailItem
                  key={item.id}
                  item={item}
                  loadingPOST={props.loadingPOST}
                  loadingGET={props.loadingGET}
                />
              ))}
            </div>
          </ItemView>
          <ItemView title="QuickView" width="30%" border={{ borderBottom: 0 }}>
            <div className="main-items-view-content">
              <QuickItem
                items={items}
                loadingPOST={props.loadingPOST}
                loadingGET={props.loadingGET}
              />
            </div>
          </ItemView>
        </div>
      </div>
    </React.Fragment>
  );
}

ItemHooks.propTypes = {
  createdAt: PropTypes.string.isRequired,
  input: PropTypes.string,
  loadingPOST: PropTypes.bool.isRequired,
  loadingGET: PropTypes.bool.isRequired,
  items: PropTypes.array,
  getItems: PropTypes.func.isRequired,
  getInput: PropTypes.func.isRequired,
  postInput: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  input: state.item.input,
  loadingPOST: state.item.loadingPOST,
  loadingGET: state.item.loadingGET,
  items: state.item.items,
  createdAt: state.item.createdAt,
});

export default connect(mapStateToProps, { getItems, getInput, postInput })(
  ItemHooks
);
