import {Menu} from "semantic-ui-react";
import Logo from "../../resources/images/logo.png";
import SearchField from "../SearchField/SearchField";
import React from "react";

const TopNavbar = () => {
  return (
      <Menu>
          <Menu.Item>
              <img src={Logo}  alt="logo" />
          </Menu.Item>
          <Menu.Item>
              <SearchField
                  handleResultSelect={() => {}}
                  handleSearchChange={() => {}}
              />
          </Menu.Item>
      </Menu>
  )
};

export default TopNavbar;