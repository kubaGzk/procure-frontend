import React from "react";
import classes from "./Pages.module.css";
const Pages = (props) => {
  const pagesClasses = [classes.Pages];

  if (props.position === "top") {
    pagesClasses.push(classes.Top);
  }

  if (props.position === "bottom") {
    pagesClasses.push(classes.Bottom);
  }

  const pageItems = [];
  const numbers = [];

  for (let i = 1; i <= props.numberPages; i++) {
    if (
      (i === 1 ||
        i === props.currentPage - 1 ||
        i === props.currentPage ||
        i === props.currentPage + 1 ||
        i === props.numberPages) &&
      numbers.indexOf(i) === -1
    ) {
      numbers.push(i);
    }
  }

  for (const ind in numbers) {

    if (numbers[ind] - numbers[ind - 1] !== 1 && ind!=0) {
      pageItems.push(<span key={'brake'+ind}>. . .</span>);

      pageItems.push(
        <span
          key={"page" + numbers[ind]}
          className={
            props.currentPage === numbers[ind]
              ? [classes.PageItem, classes.Active].join(" ")
              : classes.PageItem
          }
          onClick={(e) => props.pageChange(e, numbers[ind])}
        >
          {numbers[ind]}
        </span>
      );
    } else {
      pageItems.push(
        <span
          key={"page" + numbers[ind]}
          className={
            props.currentPage === numbers[ind]
              ? [classes.PageItem, classes.Active].join(" ")
              : classes.PageItem
          }
          onClick={(e) => props.pageChange(e, numbers[ind])}
        >
          {numbers[ind]}
        </span>
      );
    }
  }


  if (props.catalogLength === 0 || props.loading) {
    pagesClasses.push(classes.None);
  }

  return (
    <div className={pagesClasses.join(" ")}>
      <h3>Page</h3> {pageItems}
    </div>
  );
};

export default Pages;
