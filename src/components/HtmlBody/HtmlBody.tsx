import React from 'react';

export interface HtmlBodyProps {
  isActive?: boolean;
  toggleClass: string;
}

export default class HtmlBody extends React.Component<HtmlBodyProps, {}> {
  isClassListExists: boolean;
  componentDidMount() {
    const { toggleClass, isActive } = this.props;

    this.isClassListExists = 'classList' in document.documentElement;

    if (this.isClassListExists && toggleClass) {
      this.toggleElementClass(document.documentElement, toggleClass, isActive);
      this.toggleElementClass(document.body, toggleClass, isActive);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { toggleClass } = nextProps;

    if (this.isClassListExists && toggleClass && nextProps.isActive !== this.props.isActive) {
      this.toggleElementClass(document.documentElement, toggleClass, nextProps.isActive);
      this.toggleElementClass(document.body, toggleClass, nextProps.isActive);
    }
  }

  componentWillUnmount() {
    const { toggleClass } = this.props;

    if (this.isClassListExists && toggleClass) {
      document.documentElement.classList.remove(toggleClass);
      document.body.classList.remove(toggleClass);
    }
  }

  toggleElementClass(el, className, isActive) {
    if (!el || !className) return;
    if (isActive) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  }

  render() {
    return null;
  }
}
