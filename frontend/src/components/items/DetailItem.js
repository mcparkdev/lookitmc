import React, { Component } from "react";

import RelativeTime from "./RelativeTime";
import ItemSkeleton from "./ItemSkeleton";

import NumberFormat from "react-number-format";

class DetailItem extends Component {
  formatDate(string) {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }
  render() {
    return (
      <div className="main-items-view-detail-item">
        <div className="detail-item-image">
          <ItemSkeleton
            loading={this.props.loadingGET}
            variant="rect"
            width="100%"
            height="100%"
          >
            <img src={this.props.item.imageURL} alt="new"></img>
          </ItemSkeleton>
        </div>
        <div className="detail-item-bottom">
          <div className="detail-item-avatar">
            <ItemSkeleton
              loading={this.props.loadingGET}
              variant="circle"
              height="36px"
              width="36px"
            >
              <img
                src={this.props.item.logo}
                className="avatar"
                alt="Avatar"
              ></img>
            </ItemSkeleton>
          </div>

          <div className="detail-item-description">
            <ItemSkeleton
              loading={this.props.loadingGET}
              variant="rect"
              width="100%"
              height="30%"
            >
              <span className="detail-item-name">{this.props.item.name}</span>

              <a
                className="detail-item-store"
                href={this.props.item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.item.store}
              </a>
              <div className="detail-item-price-container">
                <div className="detail-item-price">
                  <NumberFormat
                    value={this.props.item.price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </div>
                <div className="detail-item-price-update">
                  <RelativeTime createdAt={this.props.item.createdAt} />
                </div>
              </div>
            </ItemSkeleton>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailItem;
