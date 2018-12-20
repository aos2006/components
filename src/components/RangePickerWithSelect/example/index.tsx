import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import RangePickerWithSelect, { IResult } from '../RangePickerWithSelect';

interface IIndexProps {}

@observer
export default class Test extends React.Component<IIndexProps> {
  @observable value: IResult;

  render() {
    return (
      <div>
        <RangePickerWithSelect
          value={this.value}
          onChange={value => {
            this.value = value;
          }}
        />
        <br />
        <h3>Mobile version</h3>
        <RangePickerWithSelect
          isMobile
          value={this.value}
          onChange={value => {
            this.value = value;
          }}
        />
      </div>
    );
  }
}
