import React, { useState } from "react";
import {Menu} from "semantic-ui-react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Logo from "../../resources/images/logo.png";
import SearchField from "../SearchField/SearchField";
import escapeRegExp from 'lodash/escapeRegExp';
import filter from 'lodash/filter';

const mapStateToProps = state => ({
    rides: state.rides.rides,
    filteredRides: state.rides.filteredRides,
});


const TopNavbar = (props) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const [results, setResults] = useState(props.rides.map(ride => ({ id: ride.Id, title: ride.MblDisplayName, image: ride.ThumbnailImage, price: `${ride.WaitTime} min` })));

    const handleSearchChange = (val) => {
        setLoading(true);
        setValue(val);

        setTimeout(() => {
            if (val.length < 1) return;

            const re = new RegExp(escapeRegExp(value), 'i');
            const isMatch = (result) => re.test(result.title);

            setLoading(false);
            setResults(filter(results, isMatch));
        }, 300)
    };

    return (
      <Menu style={{ marginBottom: 0 }}>
          <Menu.Item>
              <img src={Logo}  alt="logo" onClick={() => props.history.push('/')} />
          </Menu.Item>
          <Menu.Item>
              <SearchField
                  loading={loading}
                  results={results}
                  handleResultSelect={(e, { result }) => props.history.push(`/ride/${result.id}`)}
                  handleSearchChange={({ target }) => handleSearchChange(target.value)}
              />
          </Menu.Item>
      </Menu>
  )
};

export default withRouter(connect(mapStateToProps)(TopNavbar));