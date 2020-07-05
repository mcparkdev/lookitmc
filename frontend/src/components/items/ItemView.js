import React, { Component } from "react";

class ItemView extends Component {
  render() {
    return (
      <div className="main-items-view" style={{ width: this.props.width }}>
        <div className="main-items-view-header" style={this.props.border}>
          <div className="main-items-view-header-title">
            <span>{this.props.title}</span>
          </div>
          <div className="main-items-search">
            {/* <i className="fas fa-search"></i> */}
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default ItemView;
