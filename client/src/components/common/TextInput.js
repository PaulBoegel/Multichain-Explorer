import React from "react";
import PropTypes from "prop-types";

const TextInput = (props) => {
  return (
    <input
      className="form-control"
      type="text"
      placeholder={props.placeholder}
      aria-label={props.ariaLabel}
      onChange={props.onChange}
    />
  );
};

TextInput.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default TextInput;