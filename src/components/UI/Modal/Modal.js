import React from "react";
import ReactDOM from 'react-dom'
import Backdrop from "../../Backdrop/Backdrop";
import { FiX } from "react-icons/fi";

import classes from "./Modal.module.css";

class Modal extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.show !== nextProps.show ||
      this.props.children !== nextProps.children
    );
  }

  render() {
    const modalClasses = [classes.Modal];

    if (this.props.className) {
      modalClasses.push(this.props.className);
    }

    const cross = (
      <div className={classes.CloseCross} onClick={this.props.modalClosed}>
        <FiX />
      </div>
    );

    const modal = (
      <>
        <div
          className={modalClasses.join(" ")}
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(-200vh)",
            opacity: this.props.show ? "1" : "0",
            ...this.props.style,
          }}
        >
          {this.props.crossEnabled && cross}
          {this.props.children}
        </div>
        <Backdrop visible={this.props.show} clicked={this.props.modalClosed} />
      </>
    );

    return ReactDOM.createPortal(modal, document.getElementById("modal-root"));
  }
}

export default Modal;
