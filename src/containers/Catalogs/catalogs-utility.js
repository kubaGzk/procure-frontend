import queryString from "query-string";

export const stringifyFilters = (filters) => {
  const categoryFilters = filters.category.reduce((acc, el) => {
    el.checked && acc.push(el.id);
    return acc;
  }, []);

  const supplierFilters = filters.supplier.reduce((acc, el) => {
    el.checked && acc.push(el.id);
    return acc;
  }, []);

  const returnedFilters = {
    category: categoryFilters,
    supplier: supplierFilters
  };

  if(filters.priceRange.filterSet){

    const minPrice = filters.priceRange.min !== '' ? filters.priceRange.min : 0;
    const maxPrice = filters.priceRange.max !== '' ? filters.priceRange.max : 999999;

    returnedFilters.priceRange = {min: minPrice, max: maxPrice};
  }

  let rule = false;
  if(Object.keys(returnedFilters.category).length>0 ||Object.keys(returnedFilters.supplier).length>0 ||filters.priceRange.filterSet){
    rule = true;
  }
  
  return rule ? JSON.stringify(returnedFilters) : '';
};

export const setViewOptions = (state, queryData) => {

  const newItemsOptions = [
    ...state.catalogViewOptions.itemsPerPage.options,
  ].reduce((acc, el) => {
    if (queryData.itemsPerPage === el.id) {
      acc.push({ ...el, checked: true });
    } else {
      acc.push({ ...el, checked: false });
    }
    return acc;
  }, []);

  const newSortOptions = [...state.catalogViewOptions.sortType.options].reduce(
    (acc, el) => {
      if (queryData.sortType === el.id) {
        acc.push({ ...el, checked: true });
      } else {
        acc.push({ ...el, checked: false });
      }
      return acc;
    },
    []
  );

  return {
    ...state,
    catalogViewOptions: {
      ...state.catalogViewOptions,
      itemsPerPage: {
        ...state.catalogViewOptions.itemsPerPage,
        options: newItemsOptions,
      },
      sortType: {
        ...state.catalogViewOptions.sortType,
        options: newSortOptions,
      },
    },
  };
};

export const parseQueryData = (querySearch) => {
  const queryData = queryString.parse(querySearch);
  queryData.itemsPerPage = parseInt(queryData.itemsPerPage);
  queryData.currentPage = parseInt(queryData.currentPage);

  return queryData;
}

export const getActiveItems = (state) =>
{
  const activeItemsPerPage = state.catalogViewOptions.itemsPerPage.options.filter(
    (el) => el.checked === true
  )[0].id;
  const activeSort = state.catalogViewOptions.sortType.options.filter(
    (el) => el.checked === true
  )[0].id;

  return {activeItemsPerPage: activeItemsPerPage, activeSort: activeSort}
} 
 