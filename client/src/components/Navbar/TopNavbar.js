import {Menu} from "semantic-ui-react";
import { withRouter } from 'react-router-dom';
import Logo from "../../resources/images/logo.png";
import SearchField from "../SearchField/SearchField";
import React from "react";

const TopNavbar = (props) => {
  return (
      <Menu style={{ marginBottom: 0 }}>
          <Menu.Item>
              <img src={Logo}  alt="logo" onClick={() => props.history.push('/')} />
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

export default withRouter(TopNavbar);