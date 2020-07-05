import React from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import NumberFormat from "react-number-format";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function PriceFilter(props) {
  return (
    <TextField
      style={{ minWidth: "25vw" }}
      label={props.label}
      value={props.value}
      onChange={props.onChange}
      name="numberformat"
      id="formatted-numberformat-input"
      size="small"
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
    />
  );
}
