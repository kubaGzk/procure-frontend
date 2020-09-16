import React from "react";
import { FiUser } from "react-icons/fi";
import classes from "./UserProfile.module.css";
const userProfile = props => {
  return (
    <div className={classes.UserProfile}>
      <div >
        <FiUser />
      </div>
      <div>{props.userName}</div>
    </div>
  );
};

export default userProfile;
