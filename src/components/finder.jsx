import PropTypes from 'prop-types';
import { React, useState, useEffect } from 'react';
import { Watch } from 'react-loader-spinner';

import { Searchbar } from './search-bar/search-bar';
import { LoadMoreBtn } from './load-more-btn/load-more-btn';
import { ImageGallery } from './image-gallery/image-gallery';
import { fetchData } from '../services/API-search/APISearch';

const Finder = () => {
  const [data, setData] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [showList, setShowList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);
  const [requestedWord, setRequestedWord] = useState('');
  const [showBtnLoadMore, setShowBtnLoadMore] = useState(false);

  const getWordFromInput = event => {
    event.preventDefault();

    const form = event.currentTarget;
    const searchWord = form.elements.input.value;

    setRequestedWord(searchWord);
    setShowSpinner(true);

    form.reset();
  };

  useEffect(() => {
    if (requestedWord !== '') {
      const renderData = async () => {
        try {
          const data = await fetchData(requestedWord, currentPage);
          if (data.hits.length > 0) {
            setShowSpinner(false);
            setShowList(true);
            setData(data.hits);
            setTotalHits(data.totalHits);
          }
          if (data.totalHits > 12) {
            setShowBtnLoadMore(true);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      renderData();
    }
  }, [requestedWord, currentPage]);

  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  const loadMoreContent = async () => {
    setShowSpinner(true);
    try {
      const data = await fetchData(requestedWord, currentPage + 1);
      if (data.hits.length > 0) {
        setCurrentPage(prev => prev + 1);
        setData(prev => [...prev, ...data.hits]);
        setTotalHits(data.totalHits);
        setShowSpinner(false);
      }

      if (totalHits / 12 - 1 <= currentPage) {
        setShowBtnLoadMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Searchbar fnOnFormSubmit={getWordFromInput} />
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
