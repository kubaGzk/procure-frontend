import * as actionTypes from "../actionTypes";

const initialState = {
  catalogs: null,
  err: null,
  loading: false,
  itemsPerPage: 12,
  sortType: "alphabeticAZ",
  filters: {
    category: null,
    supplier: null,
    priceRange: { min: "", max: "", filterSet: false },
  },
  activeFilters: "",
  currentPage: 1,
  numberPages: 1,
};

const setCatalogs = (state, action) => {
  return {
    ...state,
    loading: false,
    catalogs: action.catalogData,
    numberPages: action.numberPages,
  };
};

const setFilters = (state, action) => {
  const activeFilters =
    action.queryData.filters !== ""
      ? JSON.parse(action.queryData.filters)
      : { category: [], supplier: [] };

  const catFilter = action.category.map((fil) => {
    const checked =
      activeFilters.category.indexOf(fil.id) !== -1 ? true : false;

    return { ...fil, checked: checked };
  });

  const supFilter = action.supplier.map((fil) => {
    const checked =
      activeFilters.supplier.indexOf(fil.id) !== -1 ? true : false;

    return { ...fil, checked: checked };
  });

  return {
    ...state,
    filters: {
      ...state.filters,
      category: catFilter,
      supplier: supFilter,
    },
  };
};

const setSingleFilter = (state, action) => {
  if (action.parentKey !== "priceRange") {
    const newFilter = [...state.filters[action.parentKey]];
    newFilter[action.filter].checked = !state.filters[action.parentKey][
      action.filter
    ].checked;
    return {
      ...state,
      filters: { ...state.filters, [action.parentKey]: newFilter },
    };
  } else {
    let val = action.value;

    if (
      action.eventType === "onBlur" &&
      action.filter === "min" &&
      parseFloat(action.value) > parseFloat(state.filters.priceRange.max)
    ) {
      val = state.filters.priceRange.max;
    } else if (
      action.eventType === "onBlur" &&
      action.filter === "min" &&
      (!val || val === "")
    ) {
      val = 0;
    }

    if (
      action.eventType === "onBlur" &&
      action.filter === "max" &&
      parseFloat(action.value.toF) < parseFloat(state.filters.priceRange.min)
    ) {
      val = state.filters.priceRange.min;
    } else if (
      action.eventType === "onBlur" &&
      action.filter === "max" &&
      (!val || val === "")
    ) {
      val = 999999;
    }

    return {
      ...state,
      filters: {
        ...state.filters,
        priceRange: {
          ...state.filters.priceRange,
          [action.filter]: val,
          filterSet: true,
        },
      },
    };
  }
};

const clearFilters = (state, action) => {
  const newCatFilters = state.filters.category.map((item) => {
    return { ...item, checked: false };
  });

  const newSupFilters = state.filters.supplier.map((item) => {
    return { ...item, checked: false };
  });

  const newPriceFilters = { min: "", max: "", filterSet: false };

  const filters = {
    category: newCatFilters,
    supplier: newSupFilters,
    priceRange: newPriceFilters,
  };

  return { ...state, filters: filters };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CATALOG_FETCH_START:
      return { ...state, loading: true, err: null };

    case actionTypes.CATALOG_FETCH_SUCCESS:
      return setCatalogs(state, action);

    case actionTypes.CATALOG_FETCH_FAILED:
      return { ...state, loading: false, err: action.err };

    case actionTypes.CATALOG_SET_ITEMS_PER_PAGE:
      return { ...state, itemsPerPage: action.itemsPerPage };

    case actionTypes.CATALOG_SET_ITEMS_SORT:
      return { ...state, sortType: action.sortType };

    case actionTypes.CATALOG_SET_CURRENT_PAGE:
      return { ...state, currentPage: action.currentPage };

    case actionTypes.CATALOG_SET_FILTER:
      return setSingleFilter(state, action);

    case actionTypes.CATALOG_SET_ACTIVE_FILTERS:
      return { ...state, activeFilters: action.activeFilters };

    case actionTypes.CATALOG_SET_AVAILABLE_FILTERS:
      return setFilters(state, action);

    case actionTypes.CATALOG_CLEAR_FILTERS:
      return clearFilters(state, action);

    default:
      return state;
  }
};

export default reducer;
