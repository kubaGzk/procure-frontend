import React from "react";

import TableHeader from "./TableHeader/TableHeader";
import TableBody from "./TableBody/TableBody";

import classes from "./Table.module.css";

const Table = (props) => {
  return (
    <table className={classes.Table}>
      <TableHeader headers={props.headers} scroll={props.scroll} />
      <TableBody
        data={props.data}
        headers={props.headers}
        unique={props.unique}
        scroll={props.scroll}
      />
    </table>
  );
};

export default Table;
