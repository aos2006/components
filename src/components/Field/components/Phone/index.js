// TODO - fix the onlyContries props. Currently expects that as an array of country object, but users should be able to send in array of country isos

import { some, find, reduce, map, filter, includes } from 'lodash/collection';
import { findIndex, head, tail } from 'lodash/array';
import { debounce, memoize } from 'lodash/function';
import { trim, startsWith } from 'lodash/string';
import React from 'react';
import PropTypes from 'prop-types';
import countryData from './country_data.js';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

const allCountries = countryData.allCountries;

const isModernBrowser = Boolean(document.createElement('input').setSelectionRange);

const style = require('./react-phone-input-style.less');

const keys = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37,
  ENTER: 13,
  ESC: 27,
  PLUS: 43,
  A: 65,
  Z: 90,
  SPACE: 32,
};

function getOnlyCountries(onlyCountriesArray) {
  if (onlyCountriesArray.length === 0) {
    return allCountries;
  }
  const selectedCountries = [];

  allCountries.forEach(country => {
    onlyCountriesArray.forEach(selCountry => {
      if (country.iso2 === selCountry) {
        selectedCountries.push(country);
      }
    });
  });

  return selectedCountries;
}

function excludeCountries(selectedCountries, excludedCountries) {
  if (excludedCountries.length === 0) {
    return selectedCountries;
  }

  return filter(selectedCountries, function(selCountry) {
    return !includes(excludedCountries, selCountry.iso2);
  });
}

class ReactPhoneInput extends React.Component {
  constructor(props) {
    super(props);
    const inputNumber = this.props.value || '';
    const onlyCountries = excludeCountries(
      getOnlyCountries(props.onlyCountries),
      props.excludeCountries
    );

    let defaultCountry = this.props.defaultCountry;

    if (this.props.value) {
      const selectedCountry = this.guessSelectedCountry(
        this.props.value.substring(0, 6),
        onlyCountries,
        defaultCountry
      );

      defaultCountry = selectedCountry.iso2;
    }

    const selectedCountryGuess = find(onlyCountries, { iso2: defaultCountry });
    const selectedCountryGuessIndex = findIndex(allCountries, selectedCountryGuess);
    const dialCode =
      selectedCountryGuess &&
      !startsWith(inputNumber.replace(/\D/g, ''), selectedCountryGuess.dialCode)
        ? selectedCountryGuess.dialCode
        : '';
    const formattedNumber = this.formatNumber(
      dialCode + inputNumber.replace(/\D/g, ''),
      selectedCountryGuess ? selectedCountryGuess.format : null
    );
    const preferredCountries = filter(allCountries, country =>
      some(this.props.preferredCountries, preferredCountry => preferredCountry === country.iso2)
    );

    this.getNumber = this.getNumber.bind(this);
    this.getValue = this.getValue.bind(this);
    this.resetNumber = this.resetNumber.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.formatNumber = this.formatNumber.bind(this);
    this._cursorToEnd = this._cursorToEnd.bind(this);
    this.guessSelectedCountry = this.guessSelectedCountry.bind(this);
    this.getElement = this.getElement.bind(this);
    this.handleFlagDropdownClick = this.handleFlagDropdownClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleFlagItemClick = this.handleFlagItemClick.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this._getHighlightCountryIndex = this._getHighlightCountryIndex.bind(this);
    this._searchCountry = this._searchCountry.bind(this);
    this.searchCountry = this.searchCountry.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.getCountryDropDownList = this.getCountryDropDownList.bind(this);

    this.state = {
      defaultCountry,
      preferredCountries,
      selectedCountry: selectedCountryGuess,
      highlightCountryIndex: selectedCountryGuessIndex,
      formattedNumber,
      showDropDown: false,
      queryString: '',
      freezeSelection: false,
      debouncedQueryStingSearcher: debounce(this.searchCountry, 100),
      onlyCountries,
    };
  }

  getNumber() {
    return this.state.formattedNumber !== '+' ? this.state.formattedNumber : '';
  }

  getValue() {
    return this.getNumber();
  }

  resetNumber() {
    const formattedNumber = this.formatNumber(
      this.state.selectedCountry.dialCode,
      this.state.selectedCountry.format
    );

    this.setState({
      formattedNumber,
    });
  }

  updateDefaultCountry(country) {
    const newSelectedCountry = find(this.state.onlyCountries, { iso2: country });

    this.setState({
      defaultCountry: country,
      selectedCountry: newSelectedCountry,
      formattedNumber: `+${newSelectedCountry.dialCode}`,
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultCountry && nextProps.defaultCountry !== this.state.defaultCountry) {
      // this.updateDefaultCountry(nextProps.defaultCountry);
    }
  }

  scrollTo(country, middle) {
    if (!country) return;

    const container = ReactDOM.findDOMNode(this.refs.flagDropdownList);

    if (!container) return;

    const containerHeight = container.offsetHeight;
    const containerOffset = container.getBoundingClientRect();
    const containerTop = containerOffset.top + document.body.scrollTop;
    const containerBottom = containerTop + containerHeight;

    const element = country;
    const elementOffset = element.getBoundingClientRect();

    const elementHeight = element.offsetHeight;
    const elementTop = elementOffset.top + document.body.scrollTop;
    const elementBottom = elementTop + elementHeight;
    let newScrollTop = elementTop - containerTop + container.scrollTop;
    const middleOffset = containerHeight / 2 - elementHeight / 2;

    if (elementTop < containerTop) {
      // scroll up
      if (middle) {
        newScrollTop -= middleOffset;
      }
      container.scrollTop = newScrollTop;
    } else if (elementBottom > containerBottom) {
      // scroll down
      if (middle) {
        newScrollTop += middleOffset;
      }
      const heightDifference = containerHeight - elementHeight;

      container.scrollTop = newScrollTop - heightDifference;
    }
  }

  formatNumber(text, pattern) {
    if (!text || text.length === 0) {
      return '+';
    }

    // for all strings with length less than 3, just return it (1, 2 etc.)
    // also return the same text if the selected country has no fixed format
    if ((text && text.length < 2) || !pattern || !this.props.autoFormat) {
      return `+${text}`;
    }

    const formattedObject = reduce(
      pattern,
      function(acc, character) {
        if (acc.remainingText.length === 0) {
          return acc;
        }

        if (character !== '.') {
          return {
            formattedText: acc.formattedText + character,
            remainingText: acc.remainingText,
          };
        }

        return {
          formattedText: acc.formattedText + head(acc.remainingText),
          remainingText: tail(acc.remainingText),
        };
      },
      { formattedText: '', remainingText: text.split('') }
    );

    return formattedObject.formattedText + formattedObject.remainingText.join('');
  }

  // put the cursor to the end of the input (usually after a focus event)
  _cursorToEnd() {
    const input = ReactDOM.findDOMNode(this.refs.numberInput);

    input.focus();
    if (isModernBrowser) {
      const len = input.value.length;

      input.setSelectionRange(len, len);
    }
  }

  getElement(index) {
    return ReactDOM.findDOMNode(this.refs[`flag_no_${index}`]);
  }

  handleFlagDropdownClick() {
    if (this.props.disabled) return;

    // need to put the highlight on the current selected country if the dropdown is going to open up
    this.setState(
      {
        showDropDown: !this.state.showDropDown,
        highlightCountry: find(this.state.onlyCountries, this.state.selectedCountry),
        highlightCountryIndex: findIndex(this.state.onlyCountries, this.state.selectedCountry),
      },
      () => {
        if (this.state.showDropDown) {
          this.scrollTo(
            this.getElement(this.state.highlightCountryIndex + this.state.preferredCountries.length)
          );
        }
      }
    );
  }

  handleInput(event) {
    let formattedNumber = '+';
    let newSelectedCountry = this.state.selectedCountry;
    let freezeSelection = this.state.freezeSelection;

    // Does not exceed 16 digit phone number limit
    if (event.target.value.replace(/\D/g, '').length > 16) {
      return;
    }

    // if the input is the same as before, must be some special key like enter etc.
    if (event.target.value === this.state.formattedNumber) {
      return;
    }

    // ie hack
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }

    if (event.target.value.length > 0) {
      // before entering the number in new format, lets check if the dial code now matches some other country
      const inputNumber = event.target.value.replace(/\D/g, '');

      // we don't need to send the whole number to guess the country... only the first 6 characters are enough
      // the guess country function can then use memoization much more effectively since the set of input it
      // gets has drastically reduced
      if (
        !this.state.freezeSelection ||
        this.state.selectedCountry.dialCode.length > inputNumber.length
      ) {
        newSelectedCountry = this.guessSelectedCountry(
          inputNumber.substring(0, 6),
          this.state.onlyCountries,
          this.state.defaultCountry
        );
        freezeSelection = false;
      }
      // let us remove all non numerals from the input
      formattedNumber = this.formatNumber(inputNumber, newSelectedCountry.format);
    }

    let caretPosition = event.target.selectionStart;
    const oldFormattedText = this.state.formattedNumber;
    const diff = formattedNumber.length - oldFormattedText.length;

    this.setState(
      {
        formattedNumber,
        freezeSelection,
        selectedCountry:
          newSelectedCountry.dialCode.length > 0 ? newSelectedCountry : this.state.selectedCountry,
      },
      function() {
        if (isModernBrowser) {
          if (diff > 0) {
            caretPosition -= diff;
          }

          if (caretPosition > 0 && oldFormattedText.length >= formattedNumber.length) {
            ReactDOM.findDOMNode(this.refs.numberInput).setSelectionRange(
              caretPosition,
              caretPosition
            );
          }
        }

        if (this.props.onChange) {
          this.props.onChange(this.state.formattedNumber);
        }
      }
    );
  }

  handleInputClick(evt) {
    this.setState({ showDropDown: false });
    if (this.props.onClick) {
      this.props.onClick(evt);
    }
  }

  handleFlagItemClick(country) {
    const currentSelectedCountry = this.state.selectedCountry;
    const nextSelectedCountry = find(this.state.onlyCountries, country);

    if (currentSelectedCountry.iso2 !== nextSelectedCountry.iso2) {
      // TODO - the below replacement is a bug. It will replace stuff from middle too
      const newNumber = this.state.formattedNumber.replace(
        currentSelectedCountry.dialCode,
        nextSelectedCountry.dialCode
      );
      const formattedNumber = this.formatNumber(
        newNumber.replace(/\D/g, ''),
        nextSelectedCountry.format
      );

      this.setState(
        {
          showDropDown: false,
          selectedCountry: nextSelectedCountry,
          freezeSelection: true,
          formattedNumber,
        },
        function() {
          this._cursorToEnd();
          if (this.props.onChange) {
            this.props.onChange(formattedNumber);
          }
        }
      );
    }
  }

  handleInputFocus(evt) {
    // if the input is blank, insert dial code of the selected country
    if (ReactDOM.findDOMNode(this.refs.numberInput).value === '+') {
      this.setState({ formattedNumber: `+${this.state.selectedCountry.dialCode}` }, () =>
        setTimeout(this._cursorToEnd, 10)
      );
    }

    if (this.props.onFocus) {
      this.props.onFocus(evt);
    }
  }

  _getHighlightCountryIndex(direction) {
    // had to write own function because underscore does not have findIndex. lodash has it
    const highlightCountryIndex = this.state.highlightCountryIndex + direction;

    if (
      highlightCountryIndex < 0 ||
      highlightCountryIndex >=
        this.state.onlyCountries.length + this.state.preferredCountries.length
    ) {
      return highlightCountryIndex - direction;
    }

    return highlightCountryIndex;
  }

  searchCountry() {
    const probableCandidate =
      this._searchCountry(this.state.queryString) || this.state.onlyCountries[0];
    const probableCandidateIndex =
      findIndex(this.state.onlyCountries, probableCandidate) + this.state.preferredCountries.length;

    this.scrollTo(this.getElement(probableCandidateIndex), true);

    this.setState({
      queryString: '',
      highlightCountryIndex: probableCandidateIndex,
    });
  }

  _moveHighlight = direction => {
    this.setState(
      {
        highlightCountryIndex: this._getHighlightCountryIndex(direction),
      },
      () => {
        this.scrollTo(this.getElement(this.state.highlightCountryIndex), true);
      }
    );
  };

  handleKeydown(event) {
    if (!this.state.showDropDown) {
      return;
    }

    // ie hack
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }

    switch (event.which) {
      case keys.DOWN:
        this._moveHighlight(1);
        break;
      case keys.UP:
        this._moveHighlight(-1);
        break;
      case keys.ENTER:
        this.handleFlagItemClick(this.state.onlyCountries[this.state.highlightCountryIndex], event);
        break;
      case keys.ESC:
        this.setState({ showDropDown: false }, this._cursorToEnd);
        break;
      default:
        if ((event.which >= keys.A && event.which <= keys.Z) || event.which === keys.SPACE) {
          this.setState(
            {
              queryString: this.state.queryString + String.fromCharCode(event.which),
            },
            this.state.debouncedQueryStingSearcher
          );
        }
    }
  }

  handleInputKeyDown(event) {
    if (event.which === keys.ENTER) {
      this.props.onEnterKeyPress(event);
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  handleClickOutside() {
    if (this.state.showDropDown) {
      this.setState({
        showDropDown: false,
      });
    }
  }

  getCountryDropDownList() {
    const countryDropDownList = map(
      this.state.preferredCountries.concat(this.state.onlyCountries),
      (country, index) => {
        const itemClasses = classNames({
          country: true,
          preferred: country.iso2 === 'us' || country.iso2 === 'gb',
          active: country.iso2 === 'us',
          highlight: this.state.highlightCountryIndex === index,
        });

        const inputFlagClasses = `flag ${country.iso2}`;

        return (
          <li
            ref={`flag_no_${index}`}
            key={`flag_no_${index}`}
            data-flag-key={`flag_no_${index}`}
            className={itemClasses}
            data-dial-code="1"
            data-country-code={country.iso2}
            onClick={this.handleFlagItemClick.bind(this, country)}
          >
            <div className={inputFlagClasses} />
            <span className="country-name">{country.name}</span>
            <span className="dial-code">{`+${country.dialCode}`}</span>
          </li>
        );
      }
    );

    const dashedLi = <li key={'dashes'} className="divider" />;
    // let's insert a dashed line in between preffered countries and the rest

    countryDropDownList.splice(this.state.preferredCountries.length, 0, dashedLi);

    const dropDownClasses = classNames({
      'country-list': true,
      hide: !this.state.showDropDown,
    });

    return (
      <ul ref="flagDropdownList" className={dropDownClasses}>
        {countryDropDownList}
      </ul>
    );
  }

  handleInputBlur() {
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(this.state.formattedNumber, this.state.selectedCountry);
    }
  }

  render() {
    const arrowClasses = classNames({
      arrow: true,
      up: this.state.showDropDown,
    });
    const inputClasses = classNames({
      'form-control': true,
      'invalid-number': !this.props.isValid(this.state.formattedNumber.replace(/\D/g, '')),
      'ant-input': true,
      'ant-input-disabled': this.props.disabled,
    });

    const flagViewClasses = classNames({
      'flag-dropdown': true,
      'open-dropdown': this.state.showDropDown,
    });

    const inputFlagClasses = `flag ${this.state.selectedCountry.iso2}`;

    return (
      <div className={classNames('react-tel-input', this.props.classNames, this.props.className)}>
        <input
          id={this.props.id}
          placeholder="+1 (702) 123-4567"
          onChange={this.handleInput}
          onBlur={this.handleInputBlur}
          onClick={this.handleInputClick}
          onFocus={this.handleInputFocus}
          onKeyDown={this.handleInputKeyDown}
          value={this.state.formattedNumber}
          ref="numberInput"
          type="tel"
          className={inputClasses}
          disabled={this.props.disabled}
        />
        <div ref="flagDropDownButton" className={flagViewClasses} onKeyDown={this.handleKeydown}>
          <div
            ref="selectedFlag"
            onClick={this.handleFlagDropdownClick}
            className="selected-flag"
            title={`${this.state.selectedCountry.name}: + ${this.state.selectedCountry.dialCode}`}
          >
            <div className={inputFlagClasses}>
              <div className={arrowClasses} />
            </div>
          </div>
          {this.state.showDropDown ? this.getCountryDropDownList() : ''}
        </div>
      </div>
    );
  }
}
ReactPhoneInput.prototype._searchCountry = memoize(function(queryString) {
  if (!queryString || queryString.length === 0) {
    return null;
  }
  // don't include the preferred countries in search
  const probableCountries = filter(
    this.state.onlyCountries,
    function(country) {
      return startsWith(country.name.toLowerCase(), queryString.toLowerCase());
    },
    this
  );

  return probableCountries[0];
});

ReactPhoneInput.prototype.guessSelectedCountry = memoize(function(
  inputNumber,
  onlyCountries,
  defaultCountry
) {
  const secondBestGuess = find(allCountries, { iso2: defaultCountry }) || onlyCountries[0];

  if (trim(inputNumber) !== '') {
    const bestGuess = reduce(
      onlyCountries,
      function(selectedCountry, country) {
        if (startsWith(inputNumber, country.dialCode)) {
          if (country.dialCode.length > selectedCountry.dialCode.length) {
            return country;
          }
          if (
            country.dialCode.length === selectedCountry.dialCode.length &&
            country.priority < selectedCountry.priority
          ) {
            return country;
          }
        }

        return selectedCountry;
      },
      { dialCode: '', priority: 10001 },
      this
    );

    if (!bestGuess.name) {
      return secondBestGuess;
    }

    return bestGuess;
  }

  return secondBestGuess;
});

ReactPhoneInput.defaultProps = {
  value: '',
  autoFormat: true,
  onlyCountries: [],
  excludeCountries: [],
  defaultCountry: allCountries[0].iso2,
  isValid: () => true,
  flagsImagePath: './flags.png',
  onEnterKeyPress() {},
};

ReactPhoneInput.propTypes = {
  value: PropTypes.string,
  autoFormat: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultCountry: PropTypes.string,
  onlyCountries: PropTypes.arrayOf(PropTypes.string),
  preferredCountries: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  classNames: PropTypes.string,
  className: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default ReactPhoneInput;
