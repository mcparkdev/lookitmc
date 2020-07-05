import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";

function ItemSkeleton(props) {
  return (
    <React.Fragment>
      {props.loading ? (
        <Skeleton
          variant={props.variant}
          width={props.width}
          height={props.height}
        >
          {props.children}
        </Skeleton>
      ) : (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ItemSkeleton;
