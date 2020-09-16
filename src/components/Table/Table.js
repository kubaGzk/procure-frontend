import React from "react";
import classes from "./Table.module.css";
const Table = (props) => {
  const tableHead = props.headers.map((el) => {
    return <th key={el}>{el}</th>;
  });

  const tableBody = props.data.map((el, index) => {
    const row = [];
    props.headers.forEach((head) => {
      row.push(<td key={head + index}>{el[head]}</td>);
    });

    return <tr key={index}>{row}</tr>;
  });

  const tableClasses = [classes.Table];

  if (props.scroll) {
    tableClasses.push(classes.Scroll);
  }

  return (
    <div className={classes.Container} style={props.style}>
      <table className={tableClasses.join(" ")}>
        <thead>
          <tr>{tableHead}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </table>
    </div>
  );
};

export default Table;
