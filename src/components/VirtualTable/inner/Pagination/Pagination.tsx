import Icon from '@latoken-component/icon';
import cn from 'classnames';
import React, { Component, ReactNode } from 'react';
import Devider from './inner/Devider';
import PageView from './inner/PageView';
import styles from './Pagination.styl';

export interface IPaginationProps {
  pageCount: number;
  pageRangeDisplayed: number;
  marginPagesDisplayed: number;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  breakLabel?: ReactNode;
  initialPage?: number;
  forcePage?: number;
  disableInitialCallback?: boolean;
  paginationClassName?: string;
  align?: 'left' | 'right' | 'center';
  pageClassName?: string;
  pageLinkClassName?: string;
  activeClassName?: string;
  activeLinkClassName?: string;
  previousClassName?: string;
  nextClassName?: string;
  previousLinkClassName?: string;
  nextLinkClassName?: string;
  disabledClassName?: string;
  breakClassName?: string;
  extraAriaContext?: string;

  onPageChange(page: { selected: number }): any;
  hrefBuilder?(pageIndex: number): any;
}

interface IPaginationState {
  selected: number;
}

export default class PaginationBoxView extends Component<IPaginationProps, IPaginationState> {
  static defaultProps = {
    pageCount: 10,
    pageRangeDisplayed: 2,
    marginPagesDisplayed: 3,
    activeClassName: 'selected',
    previousClassName: 'previous',
    nextClassName: 'next',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    breakLabel: '...',
    align: 'left',
    disabledClassName: styles.disabled,
    disableInitialCallback: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.initialPage ? props.initialPage : props.forcePage ? props.forcePage : 0,
    };
  }

  componentDidMount() {
    const { initialPage, disableInitialCallback } = this.props;
    // Call the callback with the initialPage item:

    if (typeof initialPage !== 'undefined' && !disableInitialCallback) {
      this.callCallback(initialPage);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.forcePage !== 'undefined' &&
      this.props.forcePage !== nextProps.forcePage
    ) {
      this.setState({ selected: nextProps.forcePage });
    }
  }

  handlePreviousPage = (evt: Event | any) => {
    const { selected } = this.state;

    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
      evt.returnValue = false;
    }

    if (selected > 0) {
      this.handlePageSelected(selected - 1, evt);
    }
  };

  handleNextPage = evt => {
    const { selected } = this.state;
    const { pageCount } = this.props;

    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
      evt.returnValue = false;
    }
    if (selected < pageCount - 1) {
      this.handlePageSelected(selected + 1, evt);
    }
  };

  handlePageSelected = (selected: number, evt: Event) => {
    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
      evt.returnValue = false;
    }

    if (this.state.selected === selected) {
      return;
    }

    this.setState({ selected });

    // Call the callback with the new selected item:
    this.callCallback(selected);
  };

  getForwardJump() {
    const { selected } = this.state;
    const { pageCount, pageRangeDisplayed } = this.props;

    const forwardJump = selected + pageRangeDisplayed;

    return forwardJump >= pageCount ? pageCount - 1 : forwardJump;
  }

  getBackwardJump() {
    const { selected } = this.state;
    const { pageRangeDisplayed } = this.props;

    const backwardJump = selected - pageRangeDisplayed;

    return backwardJump < 0 ? 0 : backwardJump;
  }

  handleBreakClick = (index: number, evt: Event) => {
    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
      evt.returnValue = false;
    }

    const { selected } = this.state;

    this.handlePageSelected(selected < index ? this.getForwardJump() : this.getBackwardJump(), evt);
  };

  hrefBuilder(pageIndex) {
    const { hrefBuilder, pageCount } = this.props;

    if (
      hrefBuilder &&
      pageIndex !== this.state.selected &&
      pageIndex >= 0 &&
      pageIndex < pageCount
    ) {
      return hrefBuilder(pageIndex + 1);
    }
  }

  callCallback = selectedItem => {
    if (
      typeof this.props.onPageChange !== 'undefined' &&
      typeof this.props.onPageChange === 'function'
    ) {
      this.props.onPageChange({ selected: selectedItem + 1 });
    }
  };

  getPageElement(index) {
    const { selected } = this.state;
    const {
      pageClassName,
      pageLinkClassName,
      activeClassName,
      activeLinkClassName,
      extraAriaContext,
    } = this.props;

    return (
      <PageView
        key={index}
        onClick={this.handlePageSelected.bind(null, index)}
        selected={selected === index}
        pageClassName={cn(styles.item, pageClassName)}
        pageLinkClassName={pageLinkClassName}
        activeClassName={cn(styles.active, activeClassName)}
        activeLinkClassName={activeLinkClassName}
        extraAriaContext={extraAriaContext}
        href={this.hrefBuilder(index)}
        page={index + 1}
      />
    );
  }

  pagination = () => {
    const items = [];
    const {
      pageRangeDisplayed,
      pageCount,
      marginPagesDisplayed,
      breakLabel,
      breakClassName,
    } = this.props;

    const { selected } = this.state;

    if (pageCount <= pageRangeDisplayed) {
      for (let index = 0; index < pageCount; index++) {
        items.push(this.getPageElement(index));
      }
    } else {
      let leftSide = pageRangeDisplayed / 2;
      let rightSide = pageRangeDisplayed - leftSide;

      // If the selected page index is on the default right side of the pagination,
      // we consider that the new right side is made up of it (= only one break element).
      // If the selected page index is on the default left side of the pagination,
      // we consider that the new left side is made up of it (= only one break element).
      if (selected > pageCount - pageRangeDisplayed / 2) {
        rightSide = pageCount - selected;
        leftSide = pageRangeDisplayed - rightSide;
      } else if (selected < pageRangeDisplayed / 2) {
        leftSide = selected;
        rightSide = pageRangeDisplayed - leftSide;
      }

      let index;
      let page;
      let devider;
      const createPageView = (index: number) => this.getPageElement(index);

      for (index = 0; index < pageCount; index++) {
        page = index + 1;

        // If the page index is lower than the margin defined,
        // the page has to be displayed on the left side of
        // the pagination.
        if (page <= marginPagesDisplayed) {
          items.push(createPageView(index));
          continue;
        }

        // If the page index is greater than the page count
        // minus the margin defined, the page has to be
        // displayed on the right side of the pagination.
        if (page > pageCount - marginPagesDisplayed) {
          items.push(createPageView(index));
          continue;
        }

        // If the page index is near the selected page index
        // and inside the defined range (pageRangeDisplayed)
        // we have to display it (it will create the center
        // part of the pagination).
        if (index >= selected - leftSide && index <= selected + rightSide) {
          items.push(createPageView(index));
          continue;
        }

        // If the page index doesn't meet any of the conditions above,
        // we check if the last item of the current "items" array
        // is a break element. If not, we add a break element, else,
        // we do nothing (because we don't want to display the page).
        if (breakLabel && items[items.length - 1] !== devider) {
          devider = (
            <Devider
              key={index}
              breakLabel={breakLabel}
              breakClassName={breakClassName}
              onClick={this.handleBreakClick.bind(null, index)}
            />
          );
          items.push(devider);
        }
      }
    }

    return items;
  };

  render() {
    const {
      disabledClassName,
      previousClassName,
      nextClassName,
      pageCount,
      paginationClassName,
      previousLinkClassName,
      nextLinkClassName,
      align,
    } = this.props;

    const { selected } = this.state;

    const previousClasses = previousClassName + (selected === 0 ? ` ${disabledClassName}` : '');
    const nextClasses = nextClassName + (selected === pageCount - 1 ? ` ${disabledClassName}` : '');

    return (
      <ul
        className={cn([
          styles.pagination,
          paginationClassName,
          {
            [styles.left]: align === 'left',
            [styles.center]: align === 'center',
            [styles.right]: align === 'right',
          },
        ])}
      >
        <li className={cn(styles.prev, previousClasses)}>
          <a
            onClick={this.handlePreviousPage}
            className={previousLinkClassName}
            href={this.hrefBuilder(selected - 1)}
            tabIndex={0}
            role="button"
            onKeyPress={this.handlePreviousPage}
          >
            <Icon glyph="chevron-left" className={styles.arrow} />
          </a>
        </li>

        {this.pagination()}

        <li className={cn(styles.next, nextClasses)}>
          <a
            onClick={this.handleNextPage}
            className={nextLinkClassName}
            href={this.hrefBuilder(selected + 1)}
            tabIndex={0}
            role="button"
            onKeyPress={this.handleNextPage}
          >
            <Icon glyph="chevron-right" className={styles.arrow} />
          </a>
        </li>
      </ul>
    );
  }
}
