import React from "react";

import Input from "../../Input/Input";
import classes from "./RequestForm.module.css";

const RequestForm = (props) => {
  const inputStyle = { width: "240px" };

  const ccList = [];

  if (props.costCentersList) {
    for (let cc of props.costCentersList) {
      ccList.push({ value: cc.id, name: cc.name });
    }
  }



  return (
    <form className={classes.Form}>
      <div className={classes.FormGroup}>
        <h2>Details</h2>
        <Input
          label="Title"
          placeholder=""
          type="text"
          style={inputStyle}
          value={
            typeof props.title === "object" ? props.title.value : props.title
          }
          change={(e) => props.editForm(e.target.value, "title")}
          readOnly={props.readOnly}
          errorMessages={props.title.errorMessages}
        />

        <Input
          label="Description"
          type="textarea"
          style={inputStyle}
          value={
            typeof props.description === "object"
              ? props.description.value
              : props.description
          }
          change={(e) => props.editForm(e.target.value, "description")}
          readOnly={props.readOnly}
          placeholder=""
          errorMessages={props.description.errorMessages}
        />
      </div>
      <div className={classes.FormGroup}>
        <h2>Accounting</h2>
        <Input
          label="Cost Center"
          placeholder=""
          type="select"
          options={ccList}
          style={inputStyle}
          value={
            props.readOnly ? props.costCenter.name : props.costCenter.value.id
          }
          change={(e) =>
            props.editForm(
              props.costCentersList.find((el) => el.id === e.target.value),
              "costCenter"
            )
          }
          readOnly={props.readOnly}
          errorMessages={props.costCenter.errorMessages}
        />
        {/* worst solution ever */}
        {props.costCenter && props.costCenter.owner ? (
          <p style={{ paddingLeft: "5px" }}>
            Reviewed by: {props.costCenter.owner.name}
          </p>
        ) : (
          props.costCenter.value &&
          props.costCenter.value.owner && (
            <p style={{ paddingLeft: "5px" }}>
              Reviewed by: {props.costCenter.value.owner.name}
            </p>
          )
        )}
      </div>
      <div className={classes.FormGroup}>
        <h2>Address</h2>

        <Input
          label="Country"
          type="text"
          placeholder=""
          style={inputStyle}
          value={
            typeof props.address.country === "object"
              ? props.address.country.value
              : props.address.country
          }
          change={(e) => props.editForm(e.target.value, "address", "country")}
          readOnly={props.readOnly}
          errorMessages={props.address.country.errorMessages}
        />

        <Input
          label="City"
          type="text"
          placeholder=""
          style={inputStyle}
          value={
            typeof props.address.city === "object"
              ? props.address.city.value
              : props.address.city
          }
          change={(e) => props.editForm(e.target.value, "address", "city")}
          readOnly={props.readOnly}
          errorMessages={props.address.city.errorMessages}
        />
        <Input
          label="Postal code"
          type="text"
          placeholder=""
          style={inputStyle}
          value={
            typeof props.address.postalCode === "object"
              ? props.address.postalCode.value
              : props.address.postalCode
          }
          change={(e) =>
            props.editForm(e.target.value, "address", "postalCode")
          }
          readOnly={props.readOnly}
          errorMessages={props.address.postalCode.errorMessages}
        />

        <Input
          label="Street"
          type="text"
          placeholder=""
          style={inputStyle}
          value={
            typeof props.address.street === "object"
              ? props.address.street.value
              : props.address.street
          }
          change={(e) => props.editForm(e.target.value, "address", "street")}
          readOnly={props.readOnly}
          errorMessages={props.address.street.errorMessages}
        />
        <Input
          label="House number"
          type="text"
          placeholder=""
          style={inputStyle}
          value={
            typeof props.address.houseNumber === "object"
              ? props.address.houseNumber.value
              : props.address.houseNumber
          }
          change={(e) =>
            props.editForm(e.target.value, "address", "houseNumber")
          }
          readOnly={props.readOnly}
          errorMessages={props.address.houseNumber.errorMessages}
        />
      </div>
    </form>
  );
};

export default RequestForm;
