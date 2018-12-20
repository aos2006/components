import React from 'react';

interface IPageViewProps {
  pageClassName?: string;
  pageLinkClassName?: string;
  href?: string;
  page: number;
  extraAriaContext?: string;
  selected?: boolean;
  activeClassName?: string;
  activeLinkClassName?: string;
  onClick(e: any): void;
}

const PageView = (props: IPageViewProps) => {
  let pageClassName = props.pageClassName;
  let pageLinkClassName = props.pageLinkClassName;

  const onClick = props.onClick;
  const href = props.href;

  let ariaLabel = `Page ${props.page}${props.extraAriaContext ? ` ${props.extraAriaContext}` : ''}`;
  let ariaCurrent = null;

  if (props.selected) {
    ariaCurrent = 'page';
    ariaLabel = `Page ${props.page} is your current page`;

    if (typeof pageClassName !== 'undefined') {
      pageClassName = `${pageClassName} ${props.activeClassName}`;
    } else {
      pageClassName = props.activeClassName;
    }

    if (typeof pageLinkClassName !== 'undefined') {
      if (typeof props.activeLinkClassName !== 'undefined') {
        pageLinkClassName = `${pageLinkClassName} ${props.activeLinkClassName}`;
      }
    } else {
      pageLinkClassName = props.activeLinkClassName;
    }
  }

  return (
    <li className={pageClassName}>
      <a
        onClick={onClick}
        role="button"
        className={pageLinkClassName}
        href={href}
        tabIndex={0}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        onKeyPress={onClick}
      >
        {props.page}
      </a>
    </li>
  );
};

export default PageView;
