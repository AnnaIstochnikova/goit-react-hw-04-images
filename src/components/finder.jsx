import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Watch } from 'react-loader-spinner';

import { Searchbar } from './search-bar/search-bar';
import { LoadMoreBtn } from './load-more-btn/load-more-btn';
import { ImageGallery } from './image-gallery/image-gallery';
import {
  fetchData,
  requestedWord,
  currentPage,
} from '../services/API-search/APISearch';

class Finder extends Component {
  state = {
    requestedWord: requestedWord,
    currentPage: currentPage,
    data: [],
    showList: false,
    showSpinner: false,
    showBtnLoadMore: false,
    totalHits: 0,
  };

  getWordFromInput = event => {
    event.preventDefault();
    const form = event.currentTarget;
    const searchWord = form.elements.input.value;
    this.setState(() => ({
      showSpinner: true,
      requestedWord: searchWord,
    }));
    this.renderData(searchWord);
    form.reset();
  };

  renderData = async searchWord => {
    try {
      const data = await fetchData(searchWord, this.state.currentPage);
      if (data.hits.length > 0) {
        this.setState({
          showSpinner: false,
          showList: true,
          data: data.hits,
          totalHits: data.totalHits,
        });
      }
      if (data.totalHits > 12) {
        this.setState({
          showBtnLoadMore: true,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  loadMoreContent = async () => {
    this.setState({
      showSpinner: true,
    });
    try {
      const data = await fetchData(
        this.state.requestedWord,
        this.state.currentPage + 1
      );

      if (data.hits.length > 0) {
        this.setState(
          prevState => ({
            currentPage: prevState.currentPage + 1,
            data: [...prevState.data, ...data.hits],
            totalHits: data.totalHits,
            showSpinner: false,
          }),
          () => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            });
          }
        );
      }
      if (this.state.totalHits / 12 - 1 <= this.state.currentPage) {
        this.setState({
          showBtnLoadMore: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <>
        <Searchbar fnOnFormSubmit={this.getWordFromInput} />
        {this.state.showList && <ImageGallery data={this.state.data} />}
        {this.state.showSpinner && (
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
        {this.state.showBtnLoadMore && (
          <LoadMoreBtn onButtonClick={this.loadMoreContent} />
        )}
      </>
    );
  }
}

export default Finder;

Finder.propTypes = {
  state: PropTypes.shape({
    requestedWord: PropTypes.string,
    currentPage: PropTypes.number,
    showList: PropTypes.bool,
    showSpinner: PropTypes.bool,
    showBtnLoadMore: PropTypes.bool,
    totalHits: PropTypes.number,
    data: PropTypes.array,
  }),
  getWordFromInput: PropTypes.func,
  renderData: PropTypes.func,
  componentDidMount: PropTypes.func,
  loadMoreContent: PropTypes.array,
};
