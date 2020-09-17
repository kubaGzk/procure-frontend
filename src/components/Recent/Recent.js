import React from "react";
import useWindowDimensions from "./window-hook";

import Table from "../UI/Table/Table";
import Spinner from "../UI/Spinner/Spinner";
import StatusBox from "../UI/StatusBox/StatusBox";
import { Link } from "react-router-dom";

import classes from "./Recent.module.css";

const Recent = (props) => {
  const { width } = useWindowDimensions();

  let tableHeaders = [
    { header: "ID", id: "id", mobile: true },
    { header: "Title", id: "title" },
    { header: "Description", id: "description" },
    { header: "Status", id: "status", mobile: true },
  ];

  if (width <= 599) {
    tableHeaders = tableHeaders.filter((el) => el.mobile);
  }

  const tableData = [];

  if (props.requests) {
    for (const req of props.requests) {
      const status = <StatusBox status={req.status} />;
      const id = <Link to={`/view/request/${req.id}`}>{req.requestId}</Link>;

      const reqRow = {
        id,
        title: req.title,
        description: req.description,
        status,
      };

      tableData.push(reqRow);
    }
  }

  return (
    <div className={classes.Recent}>
      <h1>Your documents</h1>
      <div className={classes.TableContainer}>
        {props.loading ? (
          <Spinner />
        ) : (
          <Table
            loading={props.loading}
            headers={tableHeaders}
            data={tableData}
            unique={"dashboard_requests"}
          />
        )}
      </div>
    </div>
  );
};

export default Recent;
