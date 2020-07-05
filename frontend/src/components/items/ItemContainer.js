import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getItems, getInput, postInput } from "../../redux/index";
import DetailItem from "./DetailItem";
import QuickItem from "./QuickItem";
import ItemView from "./ItemView";
import PriceFilter from "./PriceFilter";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";

class ItemContainer extends Component {
  state = { minValue: null, maxValue: null };

  static propTypes = {
    input: PropTypes.string,
    loadingPOST: PropTypes.bool.isRequired,
    loadingGET: PropTypes.bool.isRequired,
    items: PropTypes.array,
    getItems: PropTypes.func.isRequired,
    getInput: PropTypes.func.isRequired,
    postInput: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getInput(this.props.input);
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

  render() {
    const UpdateButton = withStyles((theme) => ({
      root: {
        color: theme.palette.getContrastText("#0071e3"),
        backgroundColor: "#0071e3",
        "&:hover": {
          backgroundColor: "#007FFF;",
        },
      },
    }))(Button);
    const { minValue, maxValue } = this.state;
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
                <UpdateButton variant="contained" color="primary" size="small">
                  Request Update
                </UpdateButton>
                <span className="main-summary-last-update">
                  Last Update: 3 days ago
                </span>
              </div>
            </div>
            <div className="main-filter">
              <div className="main-filter-title-toggle">
                <div className="main-filter-title">Filters</div>
                <Button variant="outlined" color="secondary">
                  Apply
                </Button>
                <Checkbox
                  defaultChecked
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              </div>
              <div className="main-filter-price">
                <div className="main-filter-price-min">
                  <PriceFilter
                    value={minValue}
                    onChange={this.handleChangeMinValue}
                  />
                </div>
                <div className="main-filter-price-max">
                  <PriceFilter
                    value={maxValue}
                    onChange={this.handleChangeMaxValue}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="main-items">
            <ItemView title="DetailedView">
              <div className="main-items-view-content">
                {this.props.items.map((item) => (
                  <DetailItem
                    key={item.id}
                    item={item}
                    loadingPOST={this.props.loadingPOST}
                    loadingGET={this.props.loadingGET}
                  />
                ))}
              </div>
            </ItemView>
            <ItemView title="QuickView">
              <div className="main-items-view-content">
                <QuickItem
                  items={this.props.items}
                  loadingPOST={this.props.loadingPOST}
                  loadingGET={this.props.loadingGET}
                />
              </div>
            </ItemView>
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
});

export default connect(mapStateToProps, { getItems, getInput, postInput })(
  ItemContainer
);
