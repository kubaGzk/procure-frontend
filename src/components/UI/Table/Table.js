import React from "react";
import classes from "./Table.module.css";
import TableHeader from "./TableHeader/TableHeader";
import TableBody from "./TableBody/TableBody";
import Spinner from "../Spinner/Spinner";

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
