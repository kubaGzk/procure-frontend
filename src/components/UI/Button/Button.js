import React from "react";
import classes from "./Button.module.css";

const Button = React.forwardRef((props, ref) => {
  let pushedClasses = [classes.Button, classes[props.type]];

  if (props.disabled) {
    pushedClasses.push(classes.Disabled);
  }

  let tooltip;

  if(props.tooltip){
    tooltip=<span className={classes.Tooltip}>
      {props.tooltip}
    </span>
  }

  return (
    <button
      className={[...pushedClasses, props.className].join(" ")}
      onClick={props.clicked}
      disabled={props.disabled}
      style={props.style}
      type={props.type}
      ref={ref}
    >
      {props.children}
      {tooltip}
    </button>
  );
});

export default Button;
