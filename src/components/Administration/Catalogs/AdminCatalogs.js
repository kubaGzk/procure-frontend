import React from "react";
import { connect } from "react-redux";
import axios from "../../../axios/axios-default";
import validation from "../../../utility/validation";
import withError from "../../../hoc/withErrorHandler";

import Table from "../../UI/Table/Table";
import Button from "../../UI/Button/Button";
import Spinner from "../../UI/Spinner/Spinner";
import Input from "../../Forms/Input/Input";
import TableDropdownItem from "../../UI/TableDropdownItem/TableDropdownItem";
import Modal from "../../UI/Modal/Modal";

import classes from "./AdminCatalogs.module.css";
import CatalogEditTable from "./CatalogEditTable/CatalogEditTable";
import CatalogEditItem from "./CatalogEditItem/CatalogEditItem";
import Toast from "../../UI/Toast/Toast";

const INITIAL_CATALOG_FORM = {
  name: {
    value: "",
    type: "text",
    label: "Name",
    placeholder: "Catalog name",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      maxLength: 32,
    },
    errorMessages: null,
  },
  supplier: {
    value: "",
    type: "modal",
    label: "Supplier",
    options: [],
    showModal: false,
    valid: false,
    touched: false,
    validationRules: {
      notEmpty: true,
    },
    errorMessages: null,
  },
  image: {
    value: "",
    type: "file",
    label: "Catalog Image",
    valid: false,
    touched: false,
    validationRules: {
      notEmpty: true,
    },
    errorMessages: null,
    accept: ".jpg,.png",
  },
  data: {
    value: "",
    type: "file",
    label: "Catalog Data - csv format",
    valid: false,
    touched: false,
    validationRules: {
      notEmpty: true,
    },
    errorMessages: null,
    accept: ".csv",
  },
};

const INITAL_ITEM_FORM = {
  name: {
    value: "",
    type: "text",
    label: "Name",
    placeholder: "Item name",
    valid: true,
    touched: false,
    validationRules: {
      minLength: 3,
      maxLength: 32,
    },
    errorMessages: null,
  },
  description: {
    value: "",
    type: "text",
    label: "Description",
    placeholder: "Description",
    valid: true,
    touched: false,
    validationRules: {
      minLength: 3,
      maxLength: 32,
    },
    errorMessages: null,
  },
  price: {
    value: 0,
    type: "number",
    label: "Price",
    placeholder: "Price",
    valid: true,
    touched: false,
    validationRules: {
      notEmpty: true,
    },
    errorMessages: null,
  },
  category: {
    value: "",
    type: "modal",
    label: "Category",
    options: [],
    showModal: false,
    valid: true,
    touched: false,
    validationRules: {
      notEmpty: true,
    },
    errorMessages: null,
  },
  image: {
    value: "",
    type: "file",
    label: "Catalog Image",
    valid: true,
    touched: false,
    errorMessages: null,
    accept: ".jpg,.png",
  },
};

class AdminCatalogs extends React.Component {
  constructor() {
    super();
    this.dropdownBtnRef = React.createRef();

    this.timerOut = null;
  }

  state = {
    catalogs: null,
    loading: true,
    modalLoading: false,
    editMode: false,
    catalogId: "",
    catalogRefresh: false,
    btnDisabled: true,
    itemBtnDisabled: false,
    deleting: false,
    deleted: false,
    confirmedDeleted: false,
    deletingItem: "",
    showItemEdit: false,
    itemEdit: false,
    itemId: "",
    catalogForm: INITIAL_CATALOG_FORM,
    itemForm: INITAL_ITEM_FORM,
    toastVisible: false,
    toastMessage: "",
  };

  async componentDidMount() {
    let catalogs, supplierOptions, categoryOptions;
    try {
      catalogs = await axios.get("/catalogs/list", {
        headers: { Authorization: `Bearer ${this.props.token}` },
      });

      const optionsData = await axios.get("/catalogs/filters", {
        headers: { Authorization: `Bearer ${this.props.token}` },
      });

      supplierOptions = optionsData.data.supplier.map((sup) => {
        return { name: sup.name, value: sup.id };
      });

      categoryOptions = optionsData.data.category.map((cat) => {
        return { name: cat.name, value: cat.id };
      });

      for (let catalog of catalogs.data) {
        catalog.dropdown = false;
      }

      this.setState({
        catalogs: catalogs.data,
        catalogForm: {
          ...this.state.catalogForm,
          supplier: {
            ...this.state.catalogForm.supplier,
            options: supplierOptions,
          },
        },
        itemForm: {
          ...this.state.itemForm,
          category: {
            ...this.state.itemForm.category,
            options: categoryOptions,
          },
        },
        loading: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidUpdate() {
    if (
      (this.state.catalogRefresh || this.state.confirmedDeleted) &&
      !this.state.loading &&
      !this.state.err
    ) {
      this.setState({ loading: true });
      let catalogs, supplierOptions, categoryOptions;
      try {
        catalogs = await axios.get("/catalogs/list", {
          headers: { Authorization: `Bearer ${this.props.token}` },
        });

        const optionsData = await axios.get("/catalogs/filters", {
          headers: { Authorization: `Bearer ${this.props.token}` },
        });

        supplierOptions = optionsData.data.supplier.map((sup) => {
          return { name: sup.name, value: sup.id };
        });

        categoryOptions = optionsData.data.category.map((cat) => {
          return { name: cat.name, value: cat.id };
        });

        const newState = { ...this.state };

        if (catalogs) {
          for (let catalog of catalogs.data) {
            catalog.dropdown = false;
          }

          newState.catalogs = catalogs.data;
        }
        if (supplierOptions)
          newState.catalogForm.supplier = {
            ...this.state.catalogForm.supplier,
            options: supplierOptions,
          };

        if (categoryOptions)
          newState.itemForm.category = {
            ...this.state.itemForm.category,
            options: categoryOptions,
          };

        this.setState({
          ...newState,
          catalogRefresh: false,
          confirmedDeleted: false,
          loading: false,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  sendCatalog = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const formData = new FormData();

    formData.append("image", this.state.catalogForm.image.value);
    formData.append("catalog", this.state.catalogForm.data.value);

    let method = "patch";
    let toastMess = 'Catalog has been updated.'

    if (!this.state.editMode) {
      formData.append("name", this.state.catalogForm.name.value);
      formData.append("supplier", this.state.catalogForm.supplier.value);

      method = "post";
      toastMess = 'Catalog has been created.'
    }

    axios({
      url: "/catalogs/" + this.state.catalogId,
      headers: { Authorization: `Bearer ${this.props.token}` },
      method: method,
      data: formData,
    })
      .then((resp) => {
        if (resp) {
          this.setState({
            catalogRefresh: true,
            loading: false,
            catalogId: "",
            editMode: false,
            catalogForm: INITIAL_CATALOG_FORM,
          });

          this.showToast(toastMess)
        }
      })
      .catch((err) => this.setState({ error: err }));
  };

  sendItem = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const formData = new FormData();

    formData.append("catalog", this.state.catalogId);
    formData.append("name", this.state.itemForm.name.value);
    formData.append("description", this.state.itemForm.description.value);
    formData.append("price", this.state.itemForm.price.value);
    formData.append("category", this.state.itemForm.category.value);

    this.state.itemForm.image.value &&
      formData.append("image", this.state.itemForm.image.value);

    axios({
      url: "/catalogs/item/" + this.state.itemId,
      headers: { Authorization: `Bearer ${this.props.token}` },
      method: "patch",
      data: formData,
    })
      .then((resp) => {
        if (resp) {
          this.setState({
            catalogRefresh: true,
            loading: false,
            catalogId: "",
            itemId: "",
            itemEdit: false,
            catalogForm: INITIAL_CATALOG_FORM,
            itemForm: INITAL_ITEM_FORM,
          });

          this.showToast("Item has been updated.")
        }
      })
      .catch((err) => this.setState({ error: err }));
  };

  onInputChange = (e, inpType) => {
    const validObj = validation(
      e.target.value,
      this.state.catalogForm[inpType].validationRules
    );

    const newForm = {
      ...this.state.catalogForm,
      [inpType]: {
        ...this.state.catalogForm[inpType],
        value: e.target.value,
        touched: true,
        valid: validObj.valid,
        errorMessages: validObj.foundErrors,
      },
    };

    if (newForm[inpType].valid && !this.state.catalogForm[inpType].valid) {
      newForm[inpType].errorMessages = validObj.errorMessages;
    }

    const btnDisabled = Object.keys(newForm).every((el) => newForm[el].valid);

    this.setState({
      catalogForm: newForm,
      btnDisabled: !btnDisabled,
    });
  };

  inputToggleModal = (key) => {
    this.setState((prevState) => ({
      catalogForm: {
        ...this.state.catalogForm,
        [key]: {
          ...this.state.catalogForm[key],
          showModal: !prevState.catalogForm[key].showModal,
        },
      },
    }));
  };

  inputModalSelect = (key, value) => {
    this.setState({
      catalogForm: {
        ...this.state.catalogForm,
        [key]: {
          ...this.state.catalogForm[key],
          value: value,
          showModal: false,
          valid: value.length !== 0,
        },
      },
    });
  };

  inputAddFile = (e, key) => {
    if (e.target.files.length === 1) {
      const file = e.target.files[0];

      const newForm = {
        ...this.state.catalogForm,
        [key]: {
          ...this.state.catalogForm[key],
          value: file,
          valid: true,
        },
      };
      const btnDisabled = Object.keys(newForm).every((el) => newForm[el].valid);
      this.setState({
        catalogForm: newForm,
        btnDisabled: !btnDisabled,
      });
    } else {
      const newForm = {
        ...this.state.catalogForm,
        [key]: {
          ...this.state.catalogForm[key],
          value: null,
          valid: false,
        },
      };
      const btnDisabled = Object.keys(newForm).every((el) => newForm[el].valid);

      this.setState({
        catalogForm: newForm,
        btnDisabled: !btnDisabled,
      });
    }
  };

  onInputItemChange = (e, inpType) => {
    const validObj = validation(
      e.target.value,
      this.state.itemForm[inpType].validationRules
    );

    const newForm = {
      ...this.state.itemForm,
      [inpType]: {
        ...this.state.itemForm[inpType],
        value: e.target.value,
        touched: true,
        valid: validObj.valid,
        errorMessages: validObj.foundErrors,
      },
    };

    if (newForm[inpType].valid && !this.state.itemForm[inpType].valid) {
      newForm[inpType].errorMessages = validObj.errorMessages;
    }

    const itemBtnDisabled = Object.keys(newForm).every(
      (el) => newForm[el].valid
    );

    this.setState({
      itemForm: newForm,
      itemBtnDisabled: !itemBtnDisabled,
    });
  };

  inputItemToggleModal = (key) => {
    this.setState((prevState) => ({
      itemForm: {
        ...this.state.itemForm,
        [key]: {
          ...this.state.itemForm[key],
          showModal: !prevState.itemForm[key].showModal,
        },
      },
    }));
  };

  inputItemModalSelect = (key, value) => {
    this.setState({
      itemForm: {
        ...this.state.itemForm,
        [key]: {
          ...this.state.itemForm[key],
          value: value,
          showModal: false,
          valid: value.length !== 0,
        },
      },
    });
  };

  inputItemAddFile = (e, key) => {
    if (e.target.files.length === 1) {
      const file = e.target.files[0];

      const newForm = {
        ...this.state.itemForm,
        [key]: {
          ...this.state.itemForm[key],
          value: file,
          valid: true,
        },
      };
      const itemBtnDisabled = Object.keys(newForm).every(
        (el) => newForm[el].valid
      );
      this.setState({
        itemForm: newForm,
        itemBtnDisabled: !itemBtnDisabled,
      });
    } else {
      const newForm = {
        ...this.state.itemForm,
        [key]: {
          ...this.state.itemForm[key],
          value: null,
          valid: false,
        },
      };
      const itemBtnDisabled = Object.keys(newForm).every(
        (el) => newForm[el].valid
      );

      this.setState({
        itemForm: newForm,
        itemBtnDisabled: !itemBtnDisabled,
      });
    }
  };

  toggleDropdown = (id) => {
    const ind = this.state.catalogs.findIndex((el) => el.id === id);

    this.setState((prevState) => {
      const newCatalogs = [...prevState.catalogs];
      newCatalogs[ind] = {
        ...newCatalogs[ind],
        dropdown: !prevState.catalogs[ind].dropdown,
      };

      return { ...prevState, catalogs: newCatalogs };
    });
  };

  updateCatalog = (id) => {
    const catalog = this.state.catalogs.filter((cat) => cat.id === id)[0];

    const newForm = {
      ...this.state.catalogForm,
      name: {
        ...this.state.catalogForm.name,
        readOnly: true,
        valid: true,
        value: catalog.name,
      },
      supplier: {
        ...this.state.catalogForm.supplier,
        readOnly: true,
        valid: true,
        value: catalog.supplier.name,
      },
    };

    this.setState({ catalogId: id, editMode: true, catalogForm: newForm });
  };

  editItems = (id) => {
    this.setState({ showItemEdit: true, catalogId: id });
  };

  cancelEditItems = () => {
    this.setState({
      showItemEdit: false,
      catalogId: "",
      itemEdit: false,
      itemId: "",
    });
  };

  deleteCatalog = (id) => {
    this.setState({
      deleting: true,
      catalogId: id,
      deletingItem: "catalog",
    });
  };

  confirmDelete = () => {
    this.setState({
      modalLoading: true,
      deleting: false,
    });

    if (this.state.deletingItem === "catalog") {
      axios
        .delete("/catalogs/" + this.state.catalogId, {
          headers: { Authorization: `Bearer ${this.props.token}` },
        })
        .then((resp) => {
          if (resp) {
            this.setState({
              deleted: true,
              modalLoading: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            modalLoading: false,
          });
        });
    }

    if (this.state.deletingItem === "item") {
      axios
        .delete("/catalogs/item/" + this.state.itemId, {
          headers: { Authorization: `Bearer ${this.props.token}` },
        })
        .then((resp) => {
          if (resp) {
            this.setState({
              deleted: true,
              modalLoading: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            modalLoading: false,
          });
        });
    }
  };

  declineDelete = () => {
    this.setState({
      deleting: false,
      catalogId: "",
      itemId: "",
      deletingItem: "",
    });
  };

  confirmDeletionMessage = () => {
    this.setState({ deleted: false, confirmedDeleted: true, deletingItem: "" });
  };

  createNew = () => {
    this.setState({
      catalogId: "",
      editMode: false,
      catalogRefresh: true,
      catalogForm: INITIAL_CATALOG_FORM,
    });
  };

  editItem = (id) => {
    const searchedCatalog = this.state.catalogs.filter(
      (cat) => cat.id === this.state.catalogId
    );
    const searchedItem = searchedCatalog[0].items.filter(
      (item) => item.id === id
    );

    const newItemForm = { ...this.state.itemForm };

    newItemForm.name.value = searchedItem[0].name;
    newItemForm.description.value = searchedItem[0].description;
    newItemForm.price.value = searchedItem[0].price;
    newItemForm.category.value = searchedItem[0].category;

    this.setState({
      itemEdit: true,
      itemId: id,
      showItemEdit: false,
      itemForm: newItemForm,
    });
  };

  deleteItem = (id) => {
    this.setState({
      deleting: true,
      itemId: id,
      deletingItem: "item",
      showItemEdit: false,
    });
  };

  showToast = (message) => {
    this.setState({ toastMessage: message, toastVisible: true });

    if(this.timerOut){
    clearTimeout(this.timerOut);
  }
    this.timerOut = setTimeout(() => {
      this.setState({ toastMessage: "", toastVisible: false });
    }, 3000);
  };

  render() {
    const headers = [
      { header: "Catalog name", id: "name" },
      { header: "Supplier", id: "supplier" },
      { header: "Active", id: "active" },
      { header: "Items", id: "items" },
      { header: "Edit", id: "edit", width: 10, overflow: "visible" },
    ];

    const dropdownElements = [
      { title: "Update catalog", function: this.updateCatalog },
      { title: "Edit items", function: this.editItems },
      { title: "Delete", function: this.deleteCatalog },
    ];

    let data;
    if (this.state.catalogs && !this.state.loading) {
      data = this.state.catalogs.map((cat) => {
        const edit = (
          <TableDropdownItem
            toggleDropdown={() => this.toggleDropdown(cat.id)}
            dropdownElements={dropdownElements}
            uniqueKey={cat.id}
            showMenu={cat.dropdown}
          />
        );

        return {
          name: cat.name,
          supplier: cat.supplier.name,
          active: cat.active.toString(),
          items: cat.items.length,
          edit: edit,
        };
      });
    }
    const inputs = Object.keys(this.state.catalogForm).map((key) => (
      <Input
        key={key}
        uniqueKey={key}
        value={this.state.catalogForm[key].value}
        type={this.state.catalogForm[key].type}
        placeholder={this.state.catalogForm[key].placeholder}
        change={(e) => this.onInputChange(e, key)}
        valid={this.state.catalogForm[key].valid}
        errorMessages={this.state.catalogForm[key].errorMessages}
        touched={this.state.catalogForm[key].touched}
        legendText={this.state.catalogForm[key].text}
        label={this.state.catalogForm[key].label}
        disabled={this.props.loading}
        options={this.state.catalogForm[key].options}
        readOnly={this.state.catalogForm[key].readOnly}
        showModal={this.state.catalogForm[key].showModal}
        toggleModal={this.inputToggleModal}
        modalSelect={this.inputModalSelect}
        addFile={(e) => this.inputAddFile(e, key)}
        accept={this.state.catalogForm[key].accept}
      />
    ));

    return (
      <div className={classes.Catalogs}>
        <Toast
          show={this.state.toastVisible}
          message={this.state.toastMessage}
        />
        {this.state.loading ? (
          <div className={classes.SpinnerContainer}>
            <Spinner />
          </div>
        ) : (
          <>
            <h2>Catalogs</h2>
            <div className={classes.TableContainer}>
              <Table
                loading={this.state.loading}
                headers={headers}
                data={data}
                unique={"catalogs"}
              />
            </div>
            <div
              style={{
                marginTop: "50px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: "initial" }}>
                {this.state.editMode ? "Update catalog" : "Create new catalog"}
              </h2>
              {this.state.editMode && (
                <button style={{ marginLeft: "15px" }} onClick={this.createNew}>
                  New catalog
                </button>
              )}
            </div>
            <form onSubmit={this.sendCatalog}>
              <div className={classes.Inputs}>{inputs}</div>

              <Button
                disabled={this.state.btnDisabled}
                style={{ width: "200px", marginLeft: "15px" }}
                tooltip={"Catalog"}
              >
                {this.state.editMode ? "Update" : "Create"}
              </Button>
            </form>

            <Modal show={this.state.deleting}>
              {this.state.deleting && (
                <div className={classes.ModalContainer}>
                  <h2>
                    Are you sure you want to delete this{" "}
                    {this.state.deletingItem}?
                  </h2>
                  <div>
                    <Button clicked={this.confirmDelete}>Confirm</Button>
                    <Button clicked={this.declineDelete}>Decline</Button>
                  </div>
                </div>
              )}
            </Modal>

            <Modal show={this.state.deleted}>
              <div>
                <h2>
                  <span style={{ textTransform: "capitalize" }}>
                    {this.state.deletingItem}
                  </span>{" "}
                  has been deleted.
                </h2>
                <Button clicked={this.confirmDeletionMessage}>Confirm</Button>
              </div>
            </Modal>

            <Modal show={this.state.modalLoading}>
              {this.state.modalLoading && <Spinner />}
            </Modal>

            <Modal
              show={this.state.showItemEdit}
              crossEnabled
              className={classes.Modal}
              modalClosed={this.cancelEditItems}
            >
              {this.state.showItemEdit && (
                <CatalogEditTable
                  catalogs={this.state.catalogs}
                  id={this.state.catalogId}
                  editItem={this.editItem}
                  deleteItem={this.deleteItem}
                />
              )}
            </Modal>

            <Modal
              show={this.state.itemEdit}
              crossEnabled
              modalClosed={this.cancelEditItems}
            >
              {this.state.itemEdit && (
                <CatalogEditItem
                  catalogs={this.state.catalogs}
                  catalogId={this.state.catalogId}
                  itemId={this.state.itemId}
                  inputs={this.state.itemForm}
                  inputChange={this.onInputItemChange}
                  inputToggleModal={this.inputItemToggleModal}
                  inputModalSelect={this.inputItemModalSelect}
                  inputAddFile={this.inputItemAddFile}
                  buttonDisabled={this.state.itemBtnDisabled}
                  sendItem={this.sendItem}
                />
              )}
            </Modal>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(withError(AdminCatalogs, axios));
