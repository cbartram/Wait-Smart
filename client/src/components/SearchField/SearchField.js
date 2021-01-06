import React from 'react';
import './SearchField.css';
import debounce from 'lodash/debounce';
import { Search } from 'semantic-ui-react';

/**
 * Search field component which handles finding rides, restaurants, and other various
 * points of interest and displaying it to users
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SearchField = (props) => (
    <Search
        className="search-field"
        onResultSelect={props.handleResultSelect}
        onSearchChange={debounce(props.handleSearchChange, 500, {
          leading: true,
        })}
        placeholder="Search for Anything"
        resultRenderer={(item) => props.renderSearchRow(item)}
        results={props.results}
    />
);

export default SearchField;
