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

function jsxForType(type) {
    switch(type.toUpperCase()) {
        case 'RIDES':
            return <span className="badge badge-primary">Ride</span>
        case 'SMOKINGAREAS':
            return <span className="badge badge-primary">Smoking Area</span>
        case 'SHOWS':
            return <span className="badge badge-primary">Smow</span>
        case 'SHOPS':
            return <span className="badge badge-primary">Shop</span>
        case 'SERVICEANIMALRESTAREAS':
            return <span className="badge badge-primary">Service Animal Rest Area</span>
        case 'RESTROOMS':
            return <span className="badge badge-primary">Restroom</span>
        case 'RENTALS':
            return <span className="badge badge-primary">Rental</span>
        case 'NIGHTLIFELOCATIONS':
            return <span className="badge badge-primary">Night Life</span>
        case 'LOSTANDFOUNDSTATIONS':
            return <span className="badge badge-primary">Lost & Found</span>
        case 'LOCKERS':
            return <span className="badge badge-primary">Locker</span>
        case 'HOTELS':
            return <span className="badge badge-primary">Hotel</span>
        case 'GUESTSERVICES':
            return <span className="badge badge-primary">Guest Services</span>
        case 'FIRSTAIDSTATIONS':
            return <span className="badge badge-primary">First Aid</span>
        case 'EVENTS':
            return <span className="badge badge-primary">Event</span>
        case 'DININGLOCATIONS':
            return <span className="badge badge-primary">Dining</span>
        case 'ATMS':
            return <span className="badge badge-primary">ATM</span>
        default:
            return <span className="badge badge-primary">Unknown</span>
    }
}


const TopNavbar = (props) => {
    const source = props.rides.map(ride => ({
        id: ride.Id,
        title: ride.MblDisplayName,
        image: ride.ThumbnailImage,
        wait: `${ride.WaitTime} min`,
        type: 'Ride',
    }));
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
        // console.log('Search Item: ', item);
        return (
            <div className="d-flex align-items-center px-3 py-2 search-row-item">
                {/*<Image avatar height={30} width={30} src={item.images[0]} />*/}
                <div className="d-flex flex-column">
                    {matchSearchQuery(value, item.title)}
                    <small className="text-muted">{item.title}</small>
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