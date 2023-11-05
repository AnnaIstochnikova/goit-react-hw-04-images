import PropTypes from 'prop-types';

import { SubmitBtn } from 'components/submit-btn/submit-btn';

export const SearchBar = ({ fnOnFormSubmit }) => {
  const handleSubmit = event => {
    fnOnFormSubmit(event);
  };
  return (
    <header className="searchbar">
      <form className="form" onSubmit={handleSubmit}>
        <SubmitBtn />
        <input
          id="input"
          className="input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

SearchBar.propTypes = {
  fnOnFormSubmit: PropTypes.func,
};
