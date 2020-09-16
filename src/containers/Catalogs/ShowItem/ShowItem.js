import React from "react";
import queryString from "querystring";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import axios from "../../../axios/axios-catalog";

import withError from "../../../hoc/withErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/Forms/Input/Input";

import classes from "./ShowItem.module.css";

class ShowItem extends React.Component {
  state = { inputValue: 1, itemData: null };

  componentDidMount() {
    const { id } = queryString.parse(
      this.props.location.search.replace("?", "")
    );
    axios
      .get(`/item/${id}`, {
        headers: { Authorization: `Bearer ${this.props.token}` },
      })
      .then((resp) =>
        this.setState({
          itemData: { ...resp.data },
        })
      )
      .catch((err) => {
        console.log(err);
      });
  }

  inputChange = (e) => {
    if (e.target.value >= 1 || e.target.value === "") {
      this.setState({ inputValue: e.target.value });
    }
  };

  inputFocusOut = (e) => {
    if (e.target.value === "") {
      this.setState({ inputValue: 1 });
    }
  };

  render() {
    let item = <Spinner />;

    if (this.state.itemData) {
      item = (
        <div className={classes.Item}>
          <span onClick={() => this.props.history.goBack()}>
            {"<-"} Back to catalogs
          </span>
          <div className={classes.ImageContainer}>
            <img
              src={
                process.env.REACT_APP_BACKEND_URL+'/' + this.state.itemData.image
              }
              alt={`Item ${this.state.itemData.id}`}
            ></img>
          </div>
          <div className={classes.DetailsContainer}>
            <div>
              <h2>{this.state.itemData.name}</h2>
              <p>{this.state.itemData.description}</p>
              <p>{`Price: ${this.state.itemData.price}`}</p>
              <div className={classes.InfoContainer}>
                <p>{`Category: ${this.state.itemData.category.name}`}</p>
                <p>{`Supplier: ${this.state.itemData.supplier.name}`}</p>
                <p>{`Supplier ID: ${this.state.itemData.supplier.supplierId}`}</p>
              </div>
            </div>
            <div>
              <div className={classes.AddSection}>
                <Input
                  label={"Number of items:"}
                  minVal="0"
                  type="number"
                  change={(e) => this.inputChange(e)}
                  value={this.state.inputValue}
                  focusOut={this.inputFocusOut}
                ></Input>
                <Button
                  clicked={() => {
                    this.props.addItem(
                      this.state.itemData,
                      this.state.inputValue
                    );
                  }}
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.props.catalogData) {
      item = <div>NIE MAMY TEGO</div>;
    }

    return <div className={classes.ItemContainer}>{item}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (itemToAdd, countItem) =>
      dispatch(actions.addItem(itemToAdd, countItem)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withError(ShowItem, axios));
