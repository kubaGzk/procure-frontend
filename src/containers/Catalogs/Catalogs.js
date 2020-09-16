import React from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import * as utility from "./catalogs-utility";
import * as actions from "../../store/actions/index";

import Filter from "../../components/Filter/Filter";
import CatalogItems from "../../components/CatalogItems/CatalogItems";
import Spinner from "../../components/UI/Spinner/Spinner";
import Button from "../../components/UI/Button/Button";
import Pages from "../../components/CatalogItems/Pages/Pages";
import MobileButtons from "../../components/CatalogItems/MobileButtons/MobileButtons";
import Modal from "../../components/UI/Modal/Modal";

import classes from "./Catalogs.module.css";
import Toast from "../../components/UI/Toast/Toast";


class Catalogs extends React.Component {

  constructor(props){
    super(props);

    this.timerTimeout = null;

  }
  
  state = {
    catalogViewOptions: {
      itemsPerPage: {
        header: "Items per page",
        type: "radio",
        show: true,
        options: [
          { name: "12 items", checked: false, id: 12 },
          { name: "24 items", checked: false, id: 24 },
          { name: "48 items", checked: false, id: 48 },
          { name: "60 items", checked: false, id: 60 },
        ],
      },
      sortType: {
        header: "Sort",
        type: "radio",
        show: true,
        options: [
          { name: "Alphabetic A-Z", checked: false, id: "alphabeticAZ" },
          { name: "Alphabetic Z-A", checked: false, id: "alphabeticZA" },
          { name: "Price ascending", checked: false, id: "priceAscending" },
          { name: "Price descending", checked: false, id: "priceDescending" },
        ],
      },
    },
    filters: {
      category: {
        header: "Category",
        type: "checkbox",
        show: false,
      },
      supplier: {
        header: "Supplier",
        type: "checkbox",
        show: false,
      },
      priceRange: {
        header: "Price",
        type: "price-range",
        show: true,
      },
    },
    showFiltersModal: false,
    showViewModal: false,
    toastVisible: false,
    toastMessage: "",
  };

  componentDidMount() {
    const queryData = utility.parseQueryData(
      this.props.history.location.search
    );

    this.props.initCatalogs(queryData);
    this.setState({ ...utility.setViewOptions(this.state, queryData) });
  }

  componentDidUpdate() {
    const queryData = utility.parseQueryData(
      this.props.history.location.search
    );
    const { activeItemsPerPage, activeSort } = utility.getActiveItems(
      this.state
    );

    if (
      (queryData.itemsPerPage !== activeItemsPerPage ||
        queryData.sortType !== activeSort ||
        queryData.currentPage !== this.props.currentPage ||
        queryData.filters !== this.props.activeFilters) &&
      !this.props.loading
    ) {
      this.props.initCatalogs(queryData);
    }

    if (
      activeItemsPerPage !== queryData.itemsPerPage ||
      activeSort !== queryData.sortType
    ) {
      this.setState({ ...utility.setViewOptions(this.state, queryData) });
    }
  }

  componentWillUnmount(){
    if(this.timerTimeout){
      clearTimeout(this.timerTimeout)
    }
  }

  toggleFilter = (filter) => {
    this.setState((prevState) => {
      return {
        filters: {
          ...prevState.filters,
          [filter]: {
            ...prevState.filters[filter],
            show: !prevState.filters[filter].show,
          },
        },
      };
    });
  };

  catalogViewHandler = (e, id, parentKey) => {
    const queryData = {
      itemsPerPage: this.props.itemsPerPage,
      sortType: this.props.sortType,
      filters: this.props.activeFilters,
      currentPage: 1,
    };
    queryData[parentKey] = id;

    this.props.history.push(
      this.props.match.path + "?" + queryString.stringify(queryData)
    );
  };

  applyFilterHandler = () => {
    const queryData = {
      itemsPerPage: this.props.itemsPerPage,
      sortType: this.props.sortType,
      filters: utility.stringifyFilters(this.props.filters),
      currentPage: 1,
    };

    if (this.state.showViewModal || this.state.showFiltersModal) {
      this.setState({ showViewModal: false, showFiltersModal: false });
    }
    this.props.history.push(
      this.props.match.path + "?" + queryString.stringify(queryData)
    );
  };

  pageChangeHandler = (e, pageId) => {
    const queryData = {
      itemsPerPage: this.props.itemsPerPage,
      sortType: this.props.sortType,
      filters: this.props.activeFilters,
      currentPage: pageId,
    };
    this.props.history.push(
      this.props.match.path + "?" + queryString.stringify(queryData)
    );
  };

  clearFilters = () => {
    const queryData = {
      itemsPerPage: this.props.itemsPerPage,
      sortType: this.props.sortType,
      filters: "",
      currentPage: 1,
    };
    this.props.history.push(
      this.props.match.path + "?" + queryString.stringify(queryData)
    );
    this.props.clearFilters();
    if (this.state.showViewModal || this.state.showFiltersModal) {
      this.setState({ showViewModal: false, showFiltersModal: false });
    }
  };

  toggleViewModal = () => {
    this.setState((prevState) => ({ showViewModal: !prevState.showViewModal }));
  };

  toggleFiltersModal = () => {
    this.setState((prevState) => ({
      showFiltersModal: !prevState.showFiltersModal,
    }));
  };

  addItemWithToast = (item, countItem) => {
    this.setState({ toastVisible: true, toastMessage: "Item has been added!" });
    this.props.addItem(item, countItem);

    if(this.timerTimeout){
      clearTimeout(this.timerTimeout)
    }
    
    this.timerTimeout = setTimeout(() => {

      this.setState({ toastVisible: false, toastMessage: "" });
    }, 1000);
  };

  render() {
    let catView = Object.keys(this.state.catalogViewOptions).map((key) => {
      return (
        <Filter
          type={this.state.catalogViewOptions[key].type}
          header={this.state.catalogViewOptions[key].header}
          show={this.state.catalogViewOptions[key].show}
          filterOptions={this.state.catalogViewOptions[key].options}
          change={this.catalogViewHandler}
          key={"view" + key}
          parentKey={key}
          uniqueId="desktop"
        ></Filter>
      );
    });

    let catMobileView = Object.keys(this.state.catalogViewOptions).map(
      (key) => {
        return (
          <Filter
            type={this.state.catalogViewOptions[key].type}
            header={this.state.catalogViewOptions[key].header}
            show={this.state.catalogViewOptions[key].show}
            filterOptions={this.state.catalogViewOptions[key].options}
            change={this.catalogViewHandler}
            key={"mobile_view" + key}
            parentKey={key}
            uniqueId="mobile"
          ></Filter>
        );
      }
    );

    let catFilters = Object.keys(this.state.filters).map((key, ind) => {
      return (
        <Filter
          type={this.state.filters[key].type}
          header={this.state.filters[key].header}
          show={this.state.filters[key].show}
          filterOptions={this.props.filters[key]}
          toggleFilter={() => this.toggleFilter(key)}
          key={"filter" + key}
          loading={this.props.loading}
          filterHandler={this.props.filterHandler}
          parentKey={key}
        >
          {Object.keys(this.state.filters).length - 1 === ind ? (
            <Button clicked={this.applyFilterHandler}>Apply filters</Button>
          ) : (
            ""
          )}
        </Filter>
      );
    });

    let catItems = <Spinner />;
    if (!this.props.loading) {
      catItems = (
        <CatalogItems
          catalogData={this.props.catalogData}
          inputFocusOut={this.inputFocusOut}
          addItem={this.addItemWithToast}
          currentPage={this.props.currentPage}
          numberPages={this.props.numberPages}
          pageChange={this.pageChangeHandler}
          loading={this.props.loading}
          catalogLength={
            this.props.catalogData ? this.props.catalogData.length : 0
          }
        />
      );
    }

    return (
      <div className={classes.Catalogs}>
        <div className={classes.Filters}>
          {this.props.activeFilters !== "" && (
            <Button clicked={this.clearFilters}>Clear filters</Button>
          )}
          <h2 style={{ marginBottom: "0", marginTop: "4px" }}>Catalog view</h2>
          {catView}
          <h2 style={{ marginBottom: "0", marginTop: "4px" }}>Filters</h2>
          {catFilters}
        </div>

        <div className={classes.Container}>
          <Pages
            currentPage={this.props.currentPage}
            numberPages={this.props.numberPages}
            pageChange={this.pageChangeHandler}
            catalogLength={
              this.props.catalogData ? this.props.catalogData.length : 0
            }
          />
          <MobileButtons
            toggleView={this.toggleViewModal}
            toggleFilters={this.toggleFiltersModal}
          />
          {catItems}
          <Pages
            currentPage={this.props.currentPage}
            numberPages={this.props.numberPages}
            pageChange={this.pageChangeHandler}
            catalogLength={
              this.props.catalogData ? this.props.catalogData.length : 0
            }
            loading={this.props.loading}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <Modal
          show={this.state.showViewModal}
          modalClosed={this.toggleViewModal}
          style={{
            overflow: "auto",
            textAlign: "center",
            paddingBottom: "10px",
          }}
          crossEnabled
        >
          <h2 style={{ marginBottom: "0", marginTop: "4px" }}>Catalog view</h2>
          {catMobileView}
        </Modal>
        <Modal
          show={this.state.showFiltersModal}
          modalClosed={this.toggleFiltersModal}
          style={{
            overflow: "auto",
            textAlign: "center",
            paddingBottom: "10px",
          }}
          crossEnabled
        >
          {this.props.activeFilters !== "" && (
            <Button clicked={this.clearFilters}>Clear filters</Button>
          )}
          <h2 style={{ marginBottom: "0", marginTop: "4px" }}>Filters</h2>
          {catFilters}
        </Modal>

        <Toast
          message={this.state.toastMessage}
          show={this.state.toastVisible}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.catalog.loading,
    catalogData: state.catalog.catalogs,
    itemsPerPage: state.catalog.itemsPerPage,
    sortType: state.catalog.sortType,
    filters: state.catalog.filters,
    currentPage: state.catalog.currentPage,
    numberPages: state.catalog.numberPages,
    activeFilters: state.catalog.activeFilters,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initCatalogs: (queryData) => dispatch(actions.catalogFetchInit(queryData)),
    addItem: (catItem, itemCount) =>
      dispatch(actions.addItem(catItem, itemCount)),
    filterHandler: (parentKey, filter, value, eventType) =>
      dispatch(actions.catalogSetFilter(parentKey, filter, value, eventType)),
    clearFilters: () => dispatch(actions.catalogClearFilters()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Catalogs);
