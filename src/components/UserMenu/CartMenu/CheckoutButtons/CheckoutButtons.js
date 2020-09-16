import React, { useState } from "react";
import { Redirect } from "react-router";

import Button from "../../../UI/Button/Button";
import LayoutContext from "../../../../containers/Layout/LayoutContext";

import classes from "./CheckoutButtons.module.css";

const CheckoutButtons = (props) => {
  let [clickedState, setClickedState] = useState(false);

  const checkoutHandler = (checkout) => {
    setClickedState(true);
    checkout();
    props.closeModal();
  };

  let buttons = (layoutContext) => (
    <>
      {props.userRole.indexOf("admin") !== -1 ||
      props.userRole.indexOf("request") !== -1 ? (
        props.itemsLength !== 0 && (
          <Button
            className={classes.Button}
            clicked={() =>
              !layoutContext.loading && checkoutHandler(layoutContext.checkout)
            }
          >
            Checkout
          </Button>
        )
      ) : (
        <p>You are not authorized to create requests</p>
      )}
      <Button clicked={props.closeModal}>Continue Shopping</Button>
    </>
  );

  return (
    <LayoutContext.Consumer>
      {(layoutContext) => (
        <div className={classes.Buttons}>
          {buttons(layoutContext)}
          {layoutContext.requestId !== "" && clickedState && (
            <Redirect to={`/view/request/${layoutContext.requestId}`} />
          )}
        </div>
      )}
    </LayoutContext.Consumer>
  );
};

export default CheckoutButtons;
