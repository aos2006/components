import * as React from 'react';
import Responsive, { MediaQueryProps } from 'react-responsive';
import reStore, { IBreakpoint, IBreakpointAbstract } from './reStore';

interface IMediaQueryProps extends MediaQueryProps {
  form: IBreakpoint | number;
  to?: IBreakpointAbstract;
}

export default class MediaQuery extends React.Component<IMediaQueryProps> {
  render() {
    const { form, to = 'more', ...props } = this.props;

    const query = reStore.getQuery(form, to);

    if (query.minWidth === 0) {
      delete query.minWidth;
    }
    if (query.maxWidth === Number.MAX_SAFE_INTEGER) {
      delete query.maxWidth;
    }

    return <Responsive {...query} {...props} />;
  }
}
