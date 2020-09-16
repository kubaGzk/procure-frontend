import React from "react";
import LayoutContext from "../../../../containers/Layout/LayoutContext";

import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import Input from "../../../Forms/Input/Input";
import Table from "../../../Table/Table";

import classes from "./CheckoutItems.module.css";

const CheckoutItems = (props) => {


    let price = props.items.reduce((acc, item) => {
        return (acc += item.price * item.quantity);
      }, 0);

  const generateData = (layoutContext) =>
    props.items.map((el) => {
      const item = {
        name: el.name,
        price: el.price,
      };

        item.edit = (
          <span className={classes.ItemMenu}>
            <FiMinus onClick={() => layoutContext.minusItemCount(el.id)} />
            <Input
              type="number"
              value={el.quantity}
              change={(e) =>
                layoutContext.changeItemCount(el.id, e.target.value)
              }
              minVal="1"
              style={{ width: "50px", margin: "0" }}
            />
            <p>{el.quantity}</p>
            <FiPlus onClick={() => layoutContext.plusItemCount(el.id)} />
            <FiTrash2 onClick={() => layoutContext.removeItem(el.id)} />
          </span>
        );
      

      return item;
    });

  let    headers = ["name", "price", "edit"];


  return (
    <LayoutContext.Consumer>
      {(layoutContext) => (
        <div className={classes.Container} style={props.style}>
          <h3>Request Items</h3>

          <Table headers={headers} data={generateData(layoutContext)}  scroll style={{height: "65%"}}/>
          <p
            style={{
              textAlign: "right",
              marginRight: "10px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              height: "5%"
            }}
          >
            Total price: {price.toFixed(2)}
          </p>
        </div>
      )}
    </LayoutContext.Consumer>
  );
};

export default CheckoutItems;
