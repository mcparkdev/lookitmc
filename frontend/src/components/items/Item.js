import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getItems, getInput, postInput } from "../../redux/index";
import DetailItem from "./DetailItem";
import QuickItem from "./QuickItem";
import DetailView from "./DetailView";
import QuickView from "./QuickView";
import RelativeTime from "./RelativeTime";
import PriceFilter from "./PriceFilter";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { CircularProgress } from "@material-ui/core";
import CustomizedDialogs from "./ExpandedView";

class Item extends Component {
  state = {
    minValue: null,
    maxValue: null,
    includeText: "",
    excludeText: "",
    applyFilterDisabled: true,
    itemsFiltered: [],
  };

  static propTypes = {
    createdAt: PropTypes.string.isRequired,
    input: PropTypes.string,
    loadingPOST: PropTypes.bool.isRequired,
    loadingGET: PropTypes.bool.isRequired,
    items: PropTypes.array,
    getItems: PropTypes.func.isRequired,
    getInput: PropTypes.func.isRequired,
    postInput: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const itemName = this.props.match.params.itemName;
    this.props.getInput(itemName);
    console.log(this.props);
  }

  handleChangeMinValue = (event) => {
    this.setState({
      minValue: event.target.value,
    });
  };

  handleChangeMaxValue = (event) => {
    this.setState({
      maxValue: event.target.value,
    });
  };

  handleChangeIncludeText = (event) => {
    if (event.keyCode === 13 || event.keyCode === 188) {
      this.setState({
        includeText: event.target.value,
      });
    }
  };

  handleChangeExcludeText = (event) => {
    this.setState({
      excludeText: event.target.value,
    });
  };

  handleChangeApplyFiltered = (event) => {
    const currentItems = this.filterItems(
      this.props.items,
      this.state.minValue,
      this.state.maxValue,
      this.state.includeText,
      this.state.excludeText
    );
    this.setState({
      applyFilterDisabled: event.target.checked,
      itemsFiltered: currentItems,
    });
  };

  handleChangeUpdate = () => {
    const itemName = this.props.match.params.itemName;
    this.props.postInput(itemName);
  };

  filterPrice = (items, minValue, maxValue) => {
    let itemsPriceFiltered = items.filter((item) => {
      if (minValue)
        if (maxValue)
          return (
            item.price >= parseInt(minValue) && item.price <= parseInt(maxValue)
          );
        else return item.price >= parseInt(minValue);
      else if (maxValue) return item.price <= parseInt(maxValue);
      else return items;
    });
    return itemsPriceFiltered;
  };

  filterInclude = (items, includeText) => {
    let itemsIncludeFiltered = items.filter((item) => {
      const result = Object.values(item).join(" ").toLowerCase();
      const include = includeText.split(" ");
      if (include.length <= 1)
        return result.includes(includeText.toLowerCase());
      else {
        let includeItem = false;
        include.every((text) => {
          includeItem = result.includes(text.toLowerCase());
          return !includeItem;
        });
        return includeItem;
      }
    });
    return itemsIncludeFiltered;
  };

  filterExclude = (items, excludeText) => {
    let itemsExcludeFiltered = items.filter((item) => {
      if (excludeText !== "") {
        const result = Object.values(item).join(" ").toLowerCase();
        const exclude = excludeText.split(" ");
        if (exclude.length <= 1)
          return !result.includes(excludeText.toLowerCase());
        else {
          let excludeItem = false;
          exclude.every((text) => {
            excludeItem = !result.includes(text.toLowerCase());
            return excludeItem;
          });
          return excludeItem;
        }
      } else return true;
    });
    return itemsExcludeFiltered;
  };

  filterItems = (items, minValue, maxValue, includeText, excludeText) => {
    const itemsPriceFiltered = this.filterPrice(items, minValue, maxValue);
    const itemsIncludeFiltered = this.filterInclude(
      itemsPriceFiltered,
      includeText
    );
    const itemsFiltered = this.filterExclude(itemsIncludeFiltered, excludeText);
    // this.setState({ itemsAutoFiltered: itemsFiltered });
    return itemsFiltered;
  };

  handleApplyFilterButton = () => {
    const itemsFiltered = this.filterItems(
      this.props.items,
      this.state.minValue,
      this.state.maxValue,
      this.state.includeText,
      this.state.excludeText
    );
    this.setState({ itemsFiltered });
  };

  render() {
    const UpdateButton = withStyles((theme) => ({
      root: {
        color: theme.palette.getContrastText("#0071e3"),
        backgroundColor: "#0071e3",
        "&:hover": { backgroundColor: "#007FFF" },
      },
    }))(Button);

    const UpdateCheckbox = withStyles({
      root: {
        color: "#0071e3",
        "&$checked": { color: "#007FFF" },
      },
      checked: {},
    })((props) => <Checkbox color="default" {...props} />);

    const {
      minValue,
      maxValue,
      includeText,
      excludeText,
      applyFilterDisabled,
      itemsFiltered,
    } = this.state;

    const items = applyFilterDisabled
      ? this.filterItems(
          this.props.items,
          minValue,
          maxValue,
          includeText,
          excludeText
        )
      : itemsFiltered;

    console.log(`Manual: ${itemsFiltered.length}`);
    console.log(`Total: ${items.length}`);
    return (
      <React.Fragment>
        <div className="main">
          <div className="main-summary-filter">
            <div className="main-summary">
              <div className="main-summary-title">
                {this.props.input ? this.props.input : "All"}
              </div>
              <div className="main-summary-num">
                <div className="main-summary-num-stores">
                  <span className="main-summary-num-stores-num">6 </span>
                  <span className="main-summary-num-stores-text">stores</span>
                </div>
                <div className="main-summary-num-items">
                  <span className="main-summary-num-items-num">
                    {this.props.items.length}{" "}
                  </span>
                  <span className="main-summary-num-items-text">items</span>
                </div>
              </div>
              <div className="main-summary-update">
                <UpdateButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={this.handleChangeUpdate}
                  disabled={this.props.loadingPOST}
                >
                  Update
                </UpdateButton>
                {this.props.loadingPOST && <CircularProgress />}
                <span className="main-summary-last-update">
                  Last Update: <RelativeTime createdAt={this.props.createdAt} />
                </span>
              </div>
            </div>
            <div className="main-filter">
              <div className="main-filter-title-toggle">
                <div className="main-filter-title">Filters</div>
                <FormControlLabel
                  control={
                    <UpdateCheckbox
                      checked={applyFilterDisabled}
                      // name="applyFliterDisasbled"
                      onChange={this.handleChangeApplyFiltered}
                      // inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  }
                  label="Live Update"
                />
                <UpdateButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={this.handleApplyFilterButton}
                  disabled={applyFilterDisabled}
                >
                  Apply
                </UpdateButton>
                <CustomizedDialogs />
              </div>
              <div className="main-filter-price-text-store">
                <div className="main-filter-price">
                  <div className="main-filter-price-min">
                    <PriceFilter
                      label="Minimum Price"
                      value={minValue}
                      onChange={this.handleChangeMinValue}
                    />
                  </div>
                  <div className="main-filter-price-max">
                    <PriceFilter
                      label="Maximum Price"
                      value={maxValue}
                      onChange={this.handleChangeMaxValue}
                    />
                  </div>
                </div>
                <div className="main-filter-text">
                  <div className="main-filter-text-field">
                    <Autocomplete
                      multiple
                      freeSolo
                      id="include-tag"
                      // value={includeText}
                      options={[
                        "Falabella",
                        "Exito",
                        "Jumbo",
                        "PriceSmart",
                        "Ktronix",
                        "Alkosto",
                      ]}
                      onChange={(e, newval, reason) => {
                        this.setState({ includeText: newval.join(" ") });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // variant="outlined"
                          style={{ minWidth: "25vw" }}
                          label="Include tag"
                          placeholder="Include"
                          helperText="Press Enter after input"
                          // onKeyDown={this.handleChangeIncludeText}
                        />
                      )}
                    />
                  </div>
                  <div className="main-filter-text-field">
                    <Autocomplete
                      multiple
                      freeSolo
                      id="exclude-tag"
                      // value={includeText}
                      options={[
                        "Falabella",
                        "Exito",
                        "Jumbo",
                        "PriceSmart",
                        "Ktronix",
                        "Alkosto",
                      ]}
                      onChange={(e, newval, reason) => {
                        this.setState({ excludeText: newval.join(" ") });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // variant="outlined"
                          style={{ minWidth: "25vw" }}
                          label="Exclude tag"
                          placeholder="Exclude"
                          helperText="Press Enter after input"
                          // onKeyDown={this.handleChangeIncludeText}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-items">
            <DetailView
              title="DetailedView"
              border={{ borderRight: 0, borderBottom: 0 }}
            >
              <div
                className="main-items-view-content"
                style={{ borderRight: 0 }}
              >
                {this.props.items.length === 0 && (
                  <div className="empty">
                    <span className="empty-title">
                      <i className="fas fa-box-open"></i> Oops... No items found
                    </span>
                    <span className="empty-content">
                      Request an update if necessary.
                    </span>
                  </div>
                )}
                {items.map((item) => (
                  <DetailItem
                    key={item.id}
                    item={item}
                    loadingPOST={this.props.loadingPOST}
                    loadingGET={this.props.loadingGET}
                  />
                ))}
              </div>
            </DetailView>
            <QuickView title="QuickView" border={{ borderBottom: 0 }}>
              <div className="main-items-view-content">
                {this.props.items.length === 0 && <div className="empty"></div>}
                <QuickItem
                  items={items}
                  loadingPOST={this.props.loadingPOST}
                  loadingGET={this.props.loadingGET}
                />
              </div>
            </QuickView>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  input: state.item.input,
  loadingPOST: state.item.loadingPOST,
  loadingGET: state.item.loadingGET,
  items: state.item.items,
  createdAt: state.item.createdAt,
});

export default connect(mapStateToProps, { getItems, getInput, postInput })(
  Item
);
