import React from "react";
import classes from "./CatalogItems.module.css";
import CatalogItem from "./CatalogItem/CatalogItem";

const catalogItems = (props) => {
  let catItems = [];

  if (!props.catalogData || props.catalogData.length === 0) {
    catItems = (
      <h2>
        No item found, please try to adjust filters to find matching items.
      </h2>
    );
  } else {
    for (let item of props.catalogData) {
      catItems.push(
        <CatalogItem
          key={item.id}
          id={item.id}
          parent={item.catalog.id}
          picture={process.env.REACT_APP_S3_URL+'/' + item.image}
          productName={item.name}
          productDescription={item.description}
          supplier={item.supplier.name}
          price={item.price}
          itemToAdd={item}
          addItem={props.addItem}
        />
      );
    }
  }
  return <div className={classes.CatalogItems}>{catItems}</div>;
};

export default catalogItems;
