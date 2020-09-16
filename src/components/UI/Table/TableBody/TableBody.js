import React from "react";

import classes from "./TableBody.module.css";

const TableBody = (props) => {
  let style = {};

  if (props.data.length === 0) {
    style = { overflowY: "hidden" };
  }

  const tdWidth = `${100 / props.headers.length}%`;

  const rows = props.data.map((row, ind) => {
    return (
      <tr key={`row_${props.unique}_${ind}`}>
        {props.headers.map((el) => {
          let tdClass = "";
          if (el.mobile) tdClass = classes.Mobile;

          return (
            <td
              key={el.id}
              className={tdClass}
              style={{ width: tdWidth, overflow: el.overflow }}
            >
              {row[el.id]}
            </td>
          );
        })}
      </tr>
    );
  });

  const noItems = (
    <tr
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <td>No items to display</td>
    </tr>
  );

  return (
    <tbody className={classes.TableBody} style={style}>
      {props.data.length !== 0 ? rows : noItems}
    </tbody>
  );
};

export default TableBody;
