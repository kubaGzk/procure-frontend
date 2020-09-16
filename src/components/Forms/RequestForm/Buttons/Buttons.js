import React from "react";
import Button from "../../../UI/Button/Button";
import {
  FiSave,
  FiEdit,
  FiSend,
  FiShoppingCart,
  FiDelete,
  FiTrash2,
  FiDownload
} from "react-icons/fi";
import classes from "./Buttons.module.css";

const Buttons = (props) => {
  const buttons = [];

  for (let type of props.type) {
    switch (type.name) {
      case "edit":
        buttons.push(
          <Button className={classes.Button} clicked={type.onClick} key={`buttons_${type.name}`}>
            Edit <FiEdit />
          </Button>
        );
        break;
      case "save":
        buttons.push(
          <Button className={classes.Button} clicked={type.onClick} key={`buttons_${type.name}`} disabled={type.disabled}>
            Save <FiSave />{" "}
          </Button>
        );
        break;
      case "submit":
        buttons.push(
          <Button className={classes.Button} clicked={type.onClick} key={`buttons_${type.name}`} disabled={props.submitDisabled||type.disabled}>
            Submit <FiSend />
          </Button>
        );
        break;
      case "toStore":
        buttons.push(
          <Button className={classes.Button} clicked={type.onClick} key={`buttons_${type.name}`}>
            Back to store <FiShoppingCart />
          </Button>
        );
        break;
      case "withdraw":
        buttons.push(
          <Button className={classes.Button} clicked={type.onClick} key={`buttons_${type.name}`}>
            Withdraw <FiDelete />
          </Button>
        );
        break;

      case "delete":
        buttons.push(
          <Button className={classes.Button} clicked={type.onClick} key={`buttons_${type.name}`}>
            Delete <FiTrash2 />
          </Button>
        );
        break;
        case "orders":
          buttons.push(
            <Button className={classes.Button} clicked={type.onClick} key={`buttons_${type.name}`}>
              Orders PDF <FiDownload />
            </Button>
          );
          break;
      default:
        throw new Error("Incorrect Request Button type.");
    }
  }

  return <div className={classes.Buttons}>{buttons}</div>;
};

export default Buttons;
