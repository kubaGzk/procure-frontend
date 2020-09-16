import React from "react";
import classes from "./Input.module.css";
import Modal from "../../UI/Modal/Modal";
import Button from "../../UI/Button/Button";
import Table from "../../Table/Table";

const ERROR_MSG = {
  regularExp: "Incorrect format",
  minLength: "Too short",
  maxLength: "Too long",
  minValue: "Min value not match",
  maxValue: "Max value not match",
  notEmpty: "Cannot be empty",
};

const Input = (props) => {
  const pushedClass = [classes.InputElement];

  if (!props.valid && props.touched) {
    pushedClass.push(classes.Invalid);
  }

  let input;

  switch (props.type) {
    case "text":
      input = (
        <input
          value={props.value}
          type="text"
          className={pushedClass.join(" ")}
          onChange={props.change}
          placeholder={props.placeholder || ""}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={props.focusOut}
          spellCheck="false"
          disabled={props.disabled}
          readOnly={props.readOnly}
        />
      );
      break;

    case "number":
      input = (
        <input
          value={props.value}
          type="number"
          className={pushedClass.join(" ")}
          onChange={props.change}
          placeholder={props.placeholder}
          style={{ paddingRight: "0px" }}
          min={props.minVal}
          onBlur={props.focusOut}
          readOnly={props.readOnly}
        />
      );
      break;

    case "select":
      if (props.readOnly) {
        input = (
          <input
            value={props.value}
            type="text"
            className={pushedClass.join(" ")}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
          />
        );
      } else {
        const options =
          props.options.length !== 0 ? (
            props.options.map((el) => {
              return (
                <option value={el.value} onChange={props.change} key={el.value}>
                  {el.name}
                </option>
              );
            })
          ) : (
            <option value="No value">No value</option>
          );

        input = (
          <select
            className={pushedClass.join(" ")}
            onChange={props.change}
            value={props.value || ""}
          >
            <option disabled value="">
              -- select an option --
            </option>
            {options}
          </select>
        );
      }
      break;

    case "legend":
      input = (
        <legend className={classes.Legend}>
          <span className={classes.Indicator}>{props.indicator}</span>
          {props.legendText}
        </legend>
      );
      break;

    case "password":
      input = (
        <input
          value={props.value}
          type="password"
          className={pushedClass.join(" ")}
          onChange={props.change}
          onBlur={props.focusOut}
          placeholder={props.placeholder}
          spellCheck="false"
          disabled={props.disabled}
          readOnly={props.readOnly}
        />
      );
      break;

    case "checkbox":
      input = (
        <input
          type="checkbox"
          onChange={props.change}
          id={props.id}
          disabled={props.disabled}
          checked={props.checked}
        />
      );
      break;

    case "file":
      input = (
        <input
          type="file"
          onChange={props.addFile}
          id={props.id}
          accept={props.accept}
        />
      );
      break;

    case "radio":
      input = (
        <input
          type="radio"
          onChange={props.change}
          id={props.id}
          disabled={props.disabled}
          name={props.name}
          checked={props.checked}
        />
      );
      break;

    case "textarea":
      input = (
        <textarea
          onChange={props.change}
          id={props.id}
          disabled={props.disabled}
          name={props.name}
          checked={props.checked}
          className={pushedClass.join(" ")}
          readOnly={props.readOnly}
          value={props.value}
          style={{resize: "none"}}
        />
      );
      break;

    case "modal":
      if (props.readOnly) {
        input = (
          <input
            value={props.value}
            type="text"
            className={pushedClass.join(" ")}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
          />
        );
      } else {
        const options = props.options.map((el) => {
          return (
            <option value={el.value} key={el.value} style={{ display: "none" }}>
              {el.name}
            </option>
          );
        });

        const tableData = props.options.map((el) => {
          const select = (
            <Button
              clicked={() => props.modalSelect(props.uniqueKey, el.value)}
              style={{ margin: "0" }}
            >
              Select
            </Button>
          );
          return {
            name: el.name,
            select: select,
          };
        });

        input = (
          <>
            <select
              className={pushedClass.join(" ")}
              onMouseDown={(e) => {
                e.preventDefault();
                props.toggleModal(props.uniqueKey);
              }}
              value={props.value}
              readOnly
            >
              {options}
              <option disabled value="">
                -- select an option --
              </option>
            </select>

            <Modal
              show={props.showModal}
              modalClosed={() => props.toggleModal(props.uniqueKey)}
              crossEnabled
              style={{height: "70%"}}
            >
              <Table
                headers={["name", "select"]}
                data={tableData}
                scroll
                style={{ height: "90%", width: "90%", marginBottom: "20px" }}
              />
            </Modal>
          </>
        );
      }
      break;

    default:
      input = (
        <input
          value={props.value}
          type="text"
          onChange={props.change}
          placeholder={props.placeholder}
          className={pushedClass.join(" ")}
          readOnly={props.readOnly}
        />
      );
      break;
  }

  let errList = null;

  if (props.errorMessages) {
    errList = Object.keys(ERROR_MSG).map((el) => {
      return props.errorMessages[el] ? (
        <p key={el} className={classes.FieldError}>
          {ERROR_MSG[el]}
        </p>
      ) : (
        <p key={el} className={classes.FieldErrorNone}>
          {ERROR_MSG[el]}
        </p>
      );
    });
  }

  const inputClass =
    props.type !== "checkbox" && props.type !== "radio"
      ? classes.Input
      : classes.Checkbox;

  return (
    <div className={inputClass} style={props.style}>
      <label className={classes.Label} htmlFor={props.id}>
        {props.label}
      </label>
      {input}
      {errList}
    </div>
  );
};

export default Input;
