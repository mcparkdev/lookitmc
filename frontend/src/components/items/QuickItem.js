import React, { Component } from "react";
import NumberFormat from "react-number-format";

class QuickItem extends Component {
  render() {
    return (
      <div className="main-items-view-quick-table">
        <div className="quick-table-body">
          {this.props.items.map((item, index) => (
            <div className="quick-table-item-background" key={index}>
              <div className="quick-table-item">
                <div className="quick-table-item-store">
                  {index + 1}. {item.store}
                </div>
                {index === 0 ? (
                  <div
                    className="quick-table-item-price"
                    style={{ color: "#0071e3", fontWeight: "bold" }}
                  >
                    <NumberFormat
                      value={item.price}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </div>
                ) : (
                  <div className="quick-table-price-item">
                    <NumberFormat
                      value={item.price}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default QuickItem;
