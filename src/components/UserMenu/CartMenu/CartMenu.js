import React from "react";

import { FiShoppingCart } from "react-icons/fi";
import CheckoutButtons from "./CheckoutButtons/CheckoutButtons";
import Modal from "../../UI/Modal/Modal";
import Spinner from "../../UI/Spinner/Spinner";
import classes from "./CartMenu.module.css";
import CheckoutItems from "./CheckoutItems/CheckoutItems";
const cartMenu = (props) => {
  return (
    <>
      <div className={classes.CartMenu} onClick={props.clicked}>
        <FiShoppingCart />
        <h3>{props.requestItems.length}</h3>
      </div>

      <Modal
        show={props.showMenu && !props.loading}
        modalClosed={props.clicked}
        className={classes.Modal}
      >
        <div className={classes.ModalContainer}>
          {props.requestItems.length === 0 ? (
            <h2 className={classes.NoItems}>
              No items, please start adding items
            </h2>
          ) : (
            <CheckoutItems items={props.requestItems} />
          )}
          <CheckoutButtons
            showMenu={props.showMenu}
            itemsLength={props.requestItems.length}
            closeModal={props.clicked}
            userRole={props.userRole}
          />
        </div>
      </Modal>
      <Modal show={props.loading}>
        <div style={{height:"100px", display: "flex", alignItems: "center"}}>
        <Spinner />
        </div>
      </Modal>
    </>
  );
};

export default cartMenu;
