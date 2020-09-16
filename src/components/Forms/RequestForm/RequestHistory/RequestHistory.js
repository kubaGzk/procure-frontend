import React from "react";

import { FiDownload, FiCheckSquare } from "react-icons/fi";
import Button from "../../../UI/Button/Button";

import classes from "./RequestHistory.module.css";

const RequestHistory = (props) => {
  const listItems = [];

  for (let i = props.history.length - 1; i >= 0; i--) {
    const newDate = new Date(props.history[i].date);


    listItems.push(
      <li className={classes.ListItem} key={`history_${i}`}>
        <p>User: {props.history[i].user.name}</p>
        <p>Type: {props.history[i].type}</p>
        <p>
          Date: {newDate.getUTCFullYear()}-{newDate.getUTCMonth() + 1}-
          {newDate.getUTCDate()}
        </p>
      </li>
    );
  }

  let orders;

  if (props.orders && props.orders.length !== 0) {
    orders = (
      <>
        <h2 style={{ marginBottom: "5px" }}>Orders</h2>
        <ul className={classes.OrdersList}>
          {props.orders.map((order) => {
            return (
              <li className={classes.OrdersListItem} key={order.id}>
                <p style={{ margin: "2px 8px", fontWeight: "bold" }}>
                  {order.orderId}
                </p>

                <p className={classes.OrderControls}>
                  <Button clicked={() => props.getOrder(order.id)}>
                    PDF <FiDownload />
                  </Button>
                  {!order.orderSent && (
                    <Button clicked={() => props.markSent(order.id)}>
                      Mark sent <FiCheckSquare />
                    </Button>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
  return (
    <div className={classes.History}>
      {orders}

      <h2 style={{ marginBottom: "5px" }}>History</h2>

      <ul className={classes.List}>{listItems}</ul>
    </div>
  );
};

export default RequestHistory;
