import PropTypes from 'prop-types';
import { React, useState, useEffect } from 'react';
import { Watch } from 'react-loader-spinner';

import { SearchBar } from './search-bar/search-bar';
import { LoadMoreBtn } from './load-more-btn/load-more-btn';
import { ImageGallery } from './image-gallery/image-gallery';
import { fetchData } from '../services/API-search/APISearch';

const Finder = () => {
  const [data, setData] = useState([]);
  const [showList, setShowList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);
  const [requestedWord, setRequestedWord] = useState('');
  const [showBtnLoadMore, setShowBtnLoadMore] = useState(false);

  const getWordFromInput = event => {
    event.preventDefault();

    setCurrentPage(1);
    setData([]);

    const form = event.currentTarget;
    const searchWord = form.elements.input.value;

    setRequestedWord(searchWord);
    setShowSpinner(true);

    form.reset();
  };

  useEffect(() => {
    if (requestedWord !== '') {
      setShowSpinner(true);
      const renderData = async () => {
        try {
          const fetchDataInfo = await fetchData(requestedWord, currentPage);
          if (fetchDataInfo.hits.length > 0) {
            setShowSpinner(true);
            setShowList(true);
            setData(d => [...d, ...fetchDataInfo.hits]);
          }
          if (fetchDataInfo.totalHits > 12) {
            setShowBtnLoadMore(true);
          }
        } catch (error) {
          console.log(error.message);
        } finally {
          setShowSpinner(false);
        }
      };
      renderData();
    }
  }, [currentPage, requestedWord]);

  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentPage, showSpinner]);

  const loadMoreContent = async () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <SearchBar fnOnFormSubmit={getWordFromInput} />
      {showList && <ImageGallery data={data} />}
      {showSpinner && (
        <Watch
          height="80"
          width="80"
          radius="48"
          color="#149eca"
          ariaLabel="watch-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      )}
      {showBtnLoadMore && <LoadMoreBtn onButtonClick={loadMoreContent} />}
    </>
  );
};

export default Finder;

Finder.propTypes = {
  requestedWord: PropTypes.string,
  currentPage: PropTypes.number,
  showList: PropTypes.bool,
  showSpinner: PropTypes.bool,
  showBtnLoadMore: PropTypes.bool,
  totalHits: PropTypes.number,
  data: PropTypes.array,
  getWordFromInput: PropTypes.func,
  componentDidMount: PropTypes.func,
  loadMoreContent: PropTypes.array,
};
