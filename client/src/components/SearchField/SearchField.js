import React from 'react';
import debounce from 'lodash/debounce';
import { Search } from 'semantic-ui-react';

const SearchField = (props) => (
    <Search
        onResultSelect={props.handleResultSelect}
        onSearchChange={debounce(props.handleSearchChange, 500, {
          leading: true,
        })}
        results={[]}
        {...props}
    />
);

export default SearchField;
