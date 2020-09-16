import React, { useEffect, useRef, useCallback } from "react";
import classes from "./DropdownMenu.module.css";
import DropdownMenuItem from "./DropdownMenuItem/DropdownMenuItem";

const DropdownMenu = (props) => {
  const menuClasses = [];

  if (props.alignRight) {
    menuClasses.push(classes.Right);
  }

  if (props.classicMenu) {
    menuClasses.push(classes.ClassicMenu);
  } else {
    menuClasses.push(classes.DropdownMenu);
  }

  if (props.classicMenu && !props.showMenu) {
    menuClasses.push(classes.Hidden);
  }

  const ref = useRef();

  const { buttonRef, showMenu, toggleDropdown } = props;

  const handleClick = useCallback(
    (e) => {
      if (
        // !ref.current.contains(e.target) &&
        !buttonRef.current.contains(e.target) &&
        showMenu
      ) {
        toggleDropdown();
      } else {
        return;
      }
    },
    [buttonRef, showMenu, toggleDropdown]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [props.showMenu, handleClick]);

  return (
    <div ref={ref} className={menuClasses.join(" ")}>
      <ul className={classes.List}>
        {props.dropdownElements.map((el) => {
          let clickFun = el.function;

          if (props.classicMenu) {
            clickFun = () => el.function(props.uniqueKey);
          }

          return (
            <DropdownMenuItem
              showItem={props.showMenu}
              clicked={clickFun}
              key={el.title + props.uniqueKey}
              classicMenu={props.classicMenu}
            >
              {el.title}
            </DropdownMenuItem>
          );
        })}
      </ul>
    </div>
  );
};

export default DropdownMenu;
