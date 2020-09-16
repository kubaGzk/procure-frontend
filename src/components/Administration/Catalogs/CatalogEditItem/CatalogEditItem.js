import React from "react";
import Button from "../../../UI/Button/Button";
import Input from "../../../Forms/Input/Input";
import classes from "./CatalogEditItem.module.css";

const CatalogEditItem = (props) => {
  const inputs = Object.keys(props.inputs).map((key) => (
    <Input
      key={props.itemId + key}
      uniqueKey={key}
      value={props.inputs[key].value}
      type={props.inputs[key].type}
      placeholder={props.inputs[key].placeholder}
      change={(e) => props.inputChange(e, key)}
      valid={props.inputs[key].valid}
      errorMessages={props.inputs[key].errorMessages}
      touched={props.inputs[key].touched}
      legendText={props.inputs[key].text}
      label={props.inputs[key].label}
      options={props.inputs[key].options}
      readOnly={props.inputs[key].readOnly}
      showModal={props.inputs[key].showModal}
      toggleModal={props.inputToggleModal}
      modalSelect={props.inputModalSelect}
      addFile={(e) => props.inputAddFile(e, key)}
      accept={props.inputs[key].accept}
    />
  ));

  return (
    <div className={classes.FormContainer}>
      <form onSubmit={props.sendItem}>
        {inputs}
        <Button disabled={props.buttonDisabled}>Confirm</Button>
      </form>
    </div>
  );
};

export default CatalogEditItem;
