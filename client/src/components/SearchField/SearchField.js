import React from 'react';
import './SearchField.css';
import debounce from 'lodash/debounce';
import { Search } from 'semantic-ui-react';

const SearchField = (props) => (
    <Search
        className="search-field"
        onResultSelect={props.handleResultSelect}
        onSearchChange={debounce(props.handleSearchChange, 500, {
          leading: true,
        })}
        placeholder="Search for Anything"
        results={[]}
    />
);

export default SearchField;
