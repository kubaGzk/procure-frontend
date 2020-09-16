import React from "react";

const layoutContext = React.createContext({
  cartMenuOn: false,
  requestItems: {},
  toggleCartMenu: () => {},
  removeItem: () => {},
  changeItemCount: () => {},
  plusItemCount: () => {},
  minusItemCount: () => {},
  checkout: () => {},
  requestId: "",
  loading: false,
  userRole: [],
});

export default layoutContext;
