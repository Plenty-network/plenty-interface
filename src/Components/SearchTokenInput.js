import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputGroup } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

const SearchTokenInput = ({ value, onChange, inputRef }) => {
  return (
    <div className="mt-1 flex flex-row w-100">
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text className="search-icon border-right-0">
            <BsSearch />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          ref={inputRef}
          placeholder="Search"
          className={'shadow-none border-left-0 search-box'}
          value={value}
          onChange={onChange}
        />
      </InputGroup>
    </div>
  );
};

SearchTokenInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  inputRef: PropTypes.object,
};

export default SearchTokenInput;
