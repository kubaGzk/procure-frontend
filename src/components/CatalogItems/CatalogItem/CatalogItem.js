import React, { useState } from "react";
import classes from "./CatalogItem.module.css";
import Button from "../../UI/Button/Button";
import Input from "../../Forms/Input/Input";
import { Link } from "react-router-dom";

const CatalogItem = (props) => {
  const [countItem, setCountItem] = useState(1);
  const setCountHandler = (e) => {
    if (parseInt(e.target.value) === 0 || e.target.value === "") {
      setCountItem(1);
    } else {
      setCountItem(e.target.value);
    }
  };

  return (
    <div className={classes.CatalogItem}>
      <Link
        className={classes.ImgSection}
        to={"/create/request/show/item?id=" + props.id}
      >
        <img src={props.picture} alt={`Item ${props.id}`}></img>
      </Link>
      <div className={classes.ProductSection}>
        <Link to={"/create/request/show/item?id=" + props.id}>
          <h4>{props.productName}</h4>
        </Link>
        <p>Price: {props.price}</p>
        <p>Supplier: {props.supplier} </p>
      </div>

      <div className={classes.AddSection}>
        {" "}
        <Input
          label={"Number of items:"}
          minVal="0"
          type="number"
          change={(e) => setCountHandler(e)}
          value={countItem}
          focusOut={(e) => setCountHandler(e)}
        ></Input>
        <Button clicked={() => props.addItem(props.itemToAdd, countItem)}>
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default CatalogItem;
