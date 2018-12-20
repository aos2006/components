import React, { Component, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import styles from './DraggableAndScrollable.styl';
import { autobind } from 'core-decorators';
import cn from 'classnames';

export interface IDraggableAndScrollableProps {
  containerHeight?: number;
  className?: string;
  startOffset?: number;
}

@observer
class DraggableAndScrollable extends React.Component<IDraggableAndScrollableProps> {
  static childContextTypes = {
    onDraggableHandleMouseDown: PropTypes.func,
  };
  @observable isDragging = false;
  @observable noDragging = false;
  @observable paddingTop: number = 0;
  _initialDraggingPositionY: number;
  _previousCurrentOffsetTop: number;
  contentNode: HTMLDivElement;
  wrapNode: HTMLDivElement;

  componentDidMount() {
    if (this.wrapNode && this.contentNode) {
      this.noDragging = this.wrapNode.offsetHeight < this.contentNode.offsetHeight;
    }
    this.setStartPosition();
  }

  componentDidUpdate() {
    if (this.wrapNode && this.contentNode) {
      this.noDragging = this.wrapNode.offsetHeight < this.contentNode.offsetHeight;
    }
    this.setStartPosition();
  }

  setStartPosition() {
    const { startOffset } = this.props;

    if (startOffset < 0) {
      this.wrapNode.scrollTop = -startOffset;
      this.paddingTop = 0;
    } else if (startOffset > 0) {
      this.wrapNode.scrollTop = 0;
      this.paddingTop = startOffset;
    } else {
      this.wrapNode.scrollTop = 0;
      this.paddingTop = 0;
    }
  }

  getChildContext() {
    return {
      onDraggableHandleMouseDown: this.handlerDraggableHandleMouseDown,
    };
  }

  stopDragging() {
    this.isDragging = false;
    this._initialDraggingPositionY = null;
    this._previousCurrentOffsetTop = null;
  }

  draggingInProgress(screenY) {
    if (this.isDragging) {
      const deltaY = screenY - this._initialDraggingPositionY;

      const newOffsetY = this._previousCurrentOffsetTop - deltaY;

      if (this.wrapNode) {
        this.wrapNode.scrollTop = newOffsetY;
      }
    }
  }

  @autobind
  handlerDraggableHandleMouseDown(evt) {
    if (this.isDragging) {
      return;
    }
    this.isDragging = true;
    this._initialDraggingPositionY = evt.screenY;
    this._previousCurrentOffsetTop = this.wrapNode.scrollTop;
  }

  @autobind
  handlerWrapMouseLeave(evt) {
    this.draggingInProgress(evt.screenY);
    this.stopDragging();
  }

  @autobind
  handlerWrapMouseMove(evt) {
    this.draggingInProgress(evt.screenY);
  }

  @autobind
  handlerDraggableContentMouseUp(evt) {
    this.draggingInProgress(evt.screenY);
    this.stopDragging();
  }

  @autobind
  refContentNode(node) {
    this.contentNode = node;
  }

  @autobind
  refWrapNode(node) {
    this.wrapNode = node;
  }

  render() {
    const { children, containerHeight, className } = this.props;

    const wrapStyle = containerHeight ? { height: containerHeight } : {};
    const contentStyle = { paddingTop: this.paddingTop };

    return (
      <div
        className={cn(
          styles.draggableAndScrollable,
          className,
          !this.noDragging && styles.noDragging
        )}
        style={wrapStyle}
        // onWheel={this.onWheelMoved}
        onMouseLeave={this.handlerWrapMouseLeave}
        onMouseMove={this.handlerWrapMouseMove}
        onMouseUp={this.handlerDraggableContentMouseUp}
        ref={this.refWrapNode}
      >
        <div
          className={cn(styles.draggableAndScrollableContent)}
          style={contentStyle}
          ref={this.refContentNode}
        >
          {children}
        </div>
        {/* <HtmlBody toggleClass={styles.noSelect} isActive={this.isDragging && !this.noDragging} />*/}
      </div>
    );
  }
}

export interface IDraggableHandle {
  className?: string;
  style?: CSSProperties;
}

@observer
export class DraggableHandle extends Component<IDraggableHandle> {
  static contextTypes = {
    onDraggableHandleMouseDown: PropTypes.func,
  };

  render() {
    const { children, className } = this.props;

    return (
      <div
        className={cn(styles.draggableHandle, className)}
        onMouseDown={this.context.onDraggableHandleMouseDown}
      >
        {children}
      </div>
    );
  }
}

export default DraggableAndScrollable;
