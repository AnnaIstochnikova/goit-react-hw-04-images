import PropTypes from 'prop-types';

export const LoadMoreBtn = ({ onButtonClick }) => {
  return (
    <button className="button--load-more" type="button" onClick={onButtonClick}>
      Load more
    </button>
  );
};

LoadMoreBtn.propTypes = {
  onButtonClick: PropTypes.func,
};
