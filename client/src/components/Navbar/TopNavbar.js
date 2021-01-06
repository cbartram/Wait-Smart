import React, {useState} from "react";
import {Menu} from "semantic-ui-react";
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Fuse from 'fuse.js'
import Logo from "../../resources/images/logo.png";
import {matchSearchQuery, parkNameForId} from "../../util";
import SearchField from "../SearchField/SearchField";
import escapeRegExp from 'lodash/escapeRegExp';
import filter from 'lodash/filter';

const mapStateToProps = state => ({
    rides: state.rides.rides,
    poi: state.poi,
    filteredRides: state.rides.filteredRides,
});

/**
 * Navigation bar on the top of the page housing the search bar within it.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const TopNavbar = (props) => {

    // Creates an index on all of the points of interst including, atms, restaurants,
    // rides, restrooms, etc... and reduces it all down to 1 array with a consistent structure
    // to display within the search results.
    const source = Object.keys(props.poi).reduce((acc, key) => {
        const items = props.poi[key];
        if (items === null) return acc;
        if (items.length === 0) return acc;
        const updatedItems = items.map(item => {
            const searchablePoiData = {
                id: item.Id,
                title: item.MblDisplayName,
                image: item.ThumbnailImage,
                category: <span className="ui label">{item.Category.replace(/([A-Z])/g, ' $1').trim()}</span>,
                park: <span className="ui label secondary">{parkNameForId(item.LandId)}</span>
            };

            if (item.Category === "Rides") searchablePoiData['wait'] = `${item.WaitTime} min`;
            return searchablePoiData;
        });
        return [...acc, ...updatedItems];
    }, []);
    const fuse = new Fuse(source, {
        includeScore: false,
        keys: ['title']
    });
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
            if (val.length < value.length) {
                setResults(originalResults);
                return;
            }
            setLoading(false);
            const itemResults = fuse.search(val);
            setResults(itemResults.slice(0, itemResults.length >= 5 ? 5 : itemResults.length).map(({ item }) => item));
        }, 300)
    };

    /**
     * Renders a single row in the search dropdown
     */
    const renderSearchRow = (item) => {
        return (
            <div className="d-flex align-items-center px-3 py-2 search-row-item">
                {/*<Image avatar height={30} width={30} src={item.images[0]} />*/}
                <div className="d-flex flex-column">
                    {matchSearchQuery(value, item.title)}
                    {item.category}
                    {item.park}
                </div>
            </div>
        )
    }

    return (
        <Menu style={{marginBottom: 0}}>
            <Menu.Item>
                <img src={Logo} alt="logo" onClick={() => props.history.push('/')}/>
            </Menu.Item>
            <Menu.Item>
                <SearchField
                    loading={loading}
                    results={results}
                    handleResultSelect={(e, {result}) => props.history.push(`/ride/${result.id}`)}
                    handleSearchChange={({target}) => handleSearchChange(target.value)}
                    renderSearchRow={(item) => renderSearchRow(item)}
                />
            </Menu.Item>
        </Menu>
    )
};

export default withRouter(connect(mapStateToProps)(TopNavbar));