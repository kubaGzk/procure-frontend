import React from "react";

import RequestForm from "../RequestForm/RequestForm";
import RequestHistory from "../RequestHistory/RequestHistory";
import RequestItems from "../RequestItems/RequestItems";

import classes from "./RequestBody.module.css";

const RequestBody = (props) => {
  return (
    <div className={classes.Container}>
      <div className={classes.Left}>
        <RequestItems items={props.items} readOnly={props.readOnly} />

        <RequestForm
          title={props.title}
          description={props.description}
          costCenter={props.costCenter}
          address={props.address}
          editForm={props.editForm}
          readOnly={props.readOnly}
          costCentersList={props.costCentersList}
        />
      </div>
      <RequestHistory
        history={props.history}
        orders={props.orders}
        getOrder={props.getOrder}
        markSent={props.markSent}
      />
    </div>
  );
};

export default RequestBody;
