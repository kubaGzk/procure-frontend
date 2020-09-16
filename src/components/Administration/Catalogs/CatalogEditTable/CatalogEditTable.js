import React from "react";
import Table from "../../../Table/Table";

import classes from "./CatalogEditTable.module.css";
import TableDropdownItem from "../../../UI/TableDropdownItem/TableDropdownItem";
import Button from "../../../UI/Button/Button";

const CatalogEditTable = (props) => {
  const headers = ["name", "price", "edit"];

  let data = [{ name: "Cannot find data", price: "", edit: "" }];

  if (props.catalogs) {
    const catalog = props.catalogs.filter((cat) => {
      return cat.id === props.id;
    })[0];

    data = catalog.items.map((item) => {
      const edit = (
        <div className={classes.ItemMenu}>
          <Button clicked={() => props.editItem(item.id)}>Edit</Button>
          <Button clicked={() => props.deleteItem(item.id)}>Delete</Button>
        </div>
      );

      return { name: item.name, price: item.price, edit: edit };
    });
  }

  return (
    <div className={classes.Container} style={props.style}>
      <h3>Catalog Items</h3>
      <div className={classes.TableContainer}>
        <Table headers={headers} data={data}  scroll style={{ height: "65%" }} />
      </div>
    </div>
  );
};

export default CatalogEditTable;
