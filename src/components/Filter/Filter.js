import React from "react";
import Input from "../Forms/Input/Input";
import classes from "./Filter.module.css";
import Spinner from "../UI/Spinner/Spinner";

const Filter = (props) => {
  let filterEl;
  const listItemClasses = [classes.ListItem];
  let toggler = (
    <p className={classes.Toggler} onClick={props.toggleFilter}>
      Hide options
    </p>
  );

  if (!props.show) {
    listItemClasses.push(classes.Hidden);
    toggler = (
      <p className={classes.Toggler} onClick={props.toggleFilter}>
        Show options
      </p>
    );
  }

  if (props.noToggler) {
    toggler = "";
  }

  if (!props.filterOptions) {
    return <Spinner />;
  }

  switch (props.type) {
    case "checkbox":
      filterEl = (
        <>
          {toggler}
          <ul className={classes.FilterList}>
            {props.filterOptions.map((fil, ind) => {
              return (
                <li
                  className={listItemClasses.join(" ")}
                  key={"filter_" + props.header + fil.id}
                >
                  <Input
                    type="checkbox"
                    id={"filter_" + props.parentKey + "_" + fil.id}
                    label={fil.name}
                    disabled={!props.show}
                    checked={fil.checked}
                    change={() => props.filterHandler(props.parentKey, ind)}
                  />
                </li>
              );
            })}
          </ul>
        </>
      );
      break;

    case "price-range":
      filterEl = (
        <div className={classes.PriceRange}>
          <Input
            label="Min"
            minVal="0"
            type="number"
            value={props.filterOptions.min}
            change={(e) =>
              props.filterHandler(props.parentKey, "min", e.target.value)
            }
            focusOut={(e) =>
              props.filterHandler(
                props.parentKey,
                "min",
                e.target.value,
                "onBlur"
              )
            }
          />
          <span>-</span>
          <Input
            label="Max"
            minVal="0"
            type="number"
            value={props.filterOptions.max}
            change={(e) =>
              props.filterHandler(props.parentKey, "max", e.target.value)
            }
            focusOut={(e) =>
              props.filterHandler(
                props.parentKey,
                "max",
                e.target.value,
                "onBlur"
              )
            }
          />
        </div>
      );
      break;

    case "radio":
      filterEl = (
        <div>
          <ul className={classes.FilterList}>
            {props.filterOptions.map((el, ind) => {
              return (
                <li
                  className={listItemClasses.join(" ")}
                  key={"filter_" + props.header + ind}
                >
                  <Input
                    type="radio"
                    id={"radio" + el.name + ind}
                    label={el.name}
                    name={props.header + "_" + props.uniqueId}
                    checked={el.checked}
                    change={(e) => props.change(e, el.id, props.parentKey)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      );
      break;

    default:
      console.log("Wrong filter type, cannot process.");
      break;
  }

  return (
    <div className={classes.Filter}>
      <h4 className={classes.ListHeader}>{props.header}</h4>
      {filterEl}
      {props.children}
    </div>
  );
};

export default Filter;
