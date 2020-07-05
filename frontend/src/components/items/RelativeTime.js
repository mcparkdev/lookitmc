import React from "react";
import Moment from "react-moment";

const RelativeTime = (props) => {
  return (
    <React.Fragment>
      <span>
        {props.createdAt === "" ? (
          "Request required"
        ) : (
          <React.Fragment>
            <Moment fromNow ago>
              {props.createdAt}
            </Moment>{" "}
            ago
          </React.Fragment>
        )}
      </span>
    </React.Fragment>
  );
};

export default RelativeTime;
