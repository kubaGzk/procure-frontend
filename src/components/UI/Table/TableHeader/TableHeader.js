import React from "react";
import classes from "./TableHeader.module.css";

const tableHeader = (props) => {

  const tdWidth = `${100 / props.headers.length}%`;

  return (
    <thead className={classes.TableHeader}>
      <tr>
        {props.headers.map((el) => (
          <th key={el.header} style={{ width: tdWidth }}>
            {el.header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default tableHeader;
