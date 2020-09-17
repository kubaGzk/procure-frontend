import * as actionTypes from "../actionTypes";
import axios from "../../axios/axios-catalog";

export const catalogFetchStart = () => {
  return {
    type: actionTypes.CATALOG_FETCH_START,
  };
};

export const catalogFetchSuccess = (catalogData, numberPages) => {
  return {
    type: actionTypes.CATALOG_FETCH_SUCCESS,
    catalogData: catalogData,
    numberPages: numberPages,
  };
};

export const catalogFetchFailed = (err) => {
  return {
    type: actionTypes.CATALOG_FETCH_FAILED,
    err: err,
  };
};

export const catalogSetItemsPerPage = (itemsPerPage) => {
  return {
    type: actionTypes.CATALOG_SET_ITEMS_PER_PAGE,
    itemsPerPage: itemsPerPage,
  };
};

export const catalogSetItemsSort = (sortType) => {
  return {
    type: actionTypes.CATALOG_SET_ITEMS_SORT,
    sortType: sortType,
  };
};

export const catalogSetCurrentPage = (currentPage) => {
  return {
    type: actionTypes.CATALOG_SET_CURRENT_PAGE,
    currentPage: currentPage,
  };
};

export const catalogSetFilter = (parentKey, filter, value, eventType) => {
  return {
    type: actionTypes.CATALOG_SET_FILTER,
    parentKey: parentKey,
    filter: filter,
    value: value,
    eventType: eventType,
  };
};

export const catalogSetActiveFilters = (activeFilters) => {
  return {
    type: actionTypes.CATALOG_SET_ACTIVE_FILTERS,
    activeFilters: activeFilters,
  };
};

export const catalogSetFilters = (filters) => {
  return {
    type: actionTypes.CATALOG_SET_AVAILABLE_FILTERS,
    ...filters,
  };
};

export const catalogClearFilters = () => {
  return {
    type: actionTypes.CATALOG_CLEAR_FILTERS,
  };
};

export const catalogFetchInit = (queryData, dispatch) => {
  return (dispatch, getState) => {
    dispatch(catalogFetchStart());

    dispatch(catalogSetItemsPerPage(queryData.itemsPerPage));
    dispatch(catalogSetItemsSort(queryData.sortType));
    dispatch(catalogSetCurrentPage(queryData.currentPage));

    const state = getState();

    if (!state.catalog.filters.supplier || !state.catalog.filters.category) {
      axios
        .get("/filters", {
          headers: { Authorization: `Bearer ${state.auth.token}` },
        })
        .then((resp) => {
          dispatch(
            catalogSetFilters({
              category: resp.data.category,
              supplier: resp.data.supplier,
              queryData: queryData,
            })
          );
        })
        .catch((err) => {
          console.log(err);
          
          let errMessage = "Unexpected error.";
          if (err.response && err.response.data && err.response.data.message) {
            errMessage = err.response.data.message;
          }
  
          dispatch(catalogFetchFailed(errMessage));
        });
    }

    axios
      .post("/get", queryData, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      })
      .then((resp) => {
        dispatch(catalogSetActiveFilters(queryData.filters));
        dispatch(catalogFetchSuccess(resp.data.items, resp.data.numberPages));
      })
      .catch((err) => {
        console.log(err);

        let errMessage = "Unexpected error.";
        if (err.response && err.response.data && err.response.data.message) {
          errMessage = err.response.data.message;
        }

        dispatch(catalogFetchFailed(errMessage));
      });
  };
};
