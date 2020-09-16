import React from "react";
import LayoutContext from "../../../../containers/Layout/LayoutContext";

import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import Input from "../../Input/Input";
import Table from "../../../Table/Table";

import classes from "./RequestItems.module.css";

const RequestItems = (props) => {


    let price = props.items.reduce((acc, item) => {
        return (acc += item.price * item.quantity);
      }, 0);

  const generateData = (layoutContext) =>
    props.items.map((el) => {
      const item = {
        name: el.name,
        description: el.description,
        price: el.price,
      };

      if (props.readOnly) {
        item.quantity = el.quantity;
      } else {
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
              style={{ width: "50px" }}
            />
            <p>{el.quantity}</p>
            <FiPlus onClick={() => layoutContext.plusItemCount(el.id)} />
            <FiTrash2 onClick={() => layoutContext.removeItem(el.id)} style={{marginLeft:"12px"}}/>
          </span>
        );
      }

      return item;
    });

  let headers = [];

  if (props.readOnly) {
    headers = ["name", "description", "price", "quantity"];
  } else {
    headers = ["name", "description", "price", "edit"];
  }

  return (
    <LayoutContext.Consumer>
      {(layoutContext) => (
        <div className={classes.Container} style={props.style}>
          <h2>Request Items</h2>

          <Table headers={headers} data={generateData(layoutContext)} />
          <p
            style={{
              textAlign: "right",
              marginRight: "20px",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Total price: {price.toFixed(2)}
          </p>
        </div>
      )}
    </LayoutContext.Consumer>
  );
};

export default RequestItems;
