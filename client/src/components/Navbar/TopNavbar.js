import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Logo from "../../resources/images/logo.png";
import { matchSearchQuery } from "../../util";
import SearchField from "../SearchField/SearchField";
import escapeRegExp from 'lodash/escapeRegExp';
import filter from 'lodash/filter';

const mapStateToProps = state => ({
    rides: state.rides.rides,
    filteredRides: state.rides.filteredRides,
});


const TopNavbar = (props) => {
    const source = props.rides.map(ride => ({ id: ride.Id, title: ride.MblDisplayName, image: ride.ThumbnailImage, price: `${ride.WaitTime} min` }));
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const [originalResults] = useState(source);
    const [results, setResults] = useState(source);

    /**
     * Handles a user making a search query
     * @param val
     */
    const handleSearchChange = (val) => {
        setLoading(true);
        setValue(val);

        setTimeout(() => {
            // The user has deleted a character from their query
            if(val.length < value.length) {
                setResults(originalResults);
                return;
            }

            const re = new RegExp(escapeRegExp(value), 'i');
            const isMatch = (result) => re.test(result.title);

            setLoading(false);
            setResults(filter(results, isMatch));
        }, 300)
    };

    /**
     * Renders a single row in the search dropdown
     */
    const renderSearchRow = (item) => {
        console.log('Search Item: ', item);
        return (
            <div className="d-flex align-items-center px-3 py-2 search-row-item">
                {/*<Image avatar height={30} width={30} src={item.images[0]} />*/}
                <div className="d-flex flex-column">
                    {matchSearchQuery(value, item.name)}
                    <small className="text-muted">{item.name}</small>
                </div>
            </div>
        )
    }

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
                  renderSearchRow={(item) => renderSearchRow(item)}
              />
          </Menu.Item>
      </Menu>
  )
};

export default withRouter(connect(mapStateToProps)(TopNavbar));