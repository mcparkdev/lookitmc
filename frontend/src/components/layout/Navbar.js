import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getItems, getInput, postInput } from "../../redux/index";
// import Snackbar from "@material-ui/core/Snackbar";
// import IconButton from "@material-ui/core/IconButton";
// import CloseIcon from "@material-ui/icons/Close";
import { Redirect } from "react-router";
// import LinearProgress from "@material-ui/core/LinearProgress";

class Navbar extends Component {
  state = { redirect: false, searchInput: "" };
  static propTypes = {
    input: PropTypes.string,
    loadingPOST: PropTypes.bool.isRequired,
    loadingGET: PropTypes.bool.isRequired,
    items: PropTypes.array,
    getItems: PropTypes.func.isRequired,
    getInput: PropTypes.func.isRequired,
    postInput: PropTypes.func.isRequired,
  };

  _handleKeyDown_get = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      this.props.getInput(e.target.value);
      this.setState({
        searchInput: `/items/${e.target.value}`,
        redirect: true,
      });
    }
  };

  // _handleKeyDown_post = (e) => {
  //   if (e.key === "Enter" && e.target.value !== "") {
  //     this.props.postInput(e.target.value);
  //     this.setState({ open: true });
  //   }
  // };

  // handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   this.setState({ open: false });
  // };
  setRedirectFalse = () => {
    this.setState({ redirect: false });
  };
  render() {
    console.log(this.props);
    console.log(this.state);
    const { redirect, searchInput } = this.state;
    return (
      <React.Fragment>
        {redirect && <Redirect push to={searchInput} />}
        <div className="navbar">
          <div className="navbar-title">
            <span className="navbar-title-1">Look</span>
            <span className="navbar-title-2">IT</span>
          </div>
          <div className="navbar-search">
            <input
              id="navbar-searcy-input"
              className="navbar-search-input"
              type="text"
              placeholder="Looking for something?"
              onKeyDown={this._handleKeyDown_get}
            />
            <i className="fas fa-search"></i>
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

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onUnauthenticated: () => dispatch({ type: actionTypes.UNAUTHENTICATED }),
//     fetchSetupData: () => dispatch(fetchSetup()),
//   };
// };

export default connect(mapStateToProps, { getItems, getInput, postInput })(
  Navbar
);
