import React, { Component } from 'react';
import _ from 'lodash';
import Icon from 'react-fontawesome';
import { Button, Upload } from 'antd';
import { apiUrl } from '@latoken-component/utils';
import { resizeDataImg, customRequest } from './helpers';

interface IFile {
  name?: string;
  id?: number;
  thumbUrl?: string;
}

export interface IUploadProps {
  url: string;
  baseUrl?: string;
  value?: IFile[];
  onChange?: (args: IFile[]) => any;
  listType?: 'text' | 'picture' | 'picture-card';
  withCredentials?: boolean;
}

type WrapUploadState = {
  value: {};
};

export default class WrapUpload extends Component<IUploadProps, WrapUploadState> {
  state = {
    value: {},
  };
  handlerChange = info => {
    // this.setState({ value: info });
    const promisList = info.fileList.reduce(function(arr, item) {
      const id =
        item.response && item.response.data && item.response.data.id ? item.response.data.id : null;
      if (id) {
        arr.push(
          resizeDataImg(item.thumbUrl, img => ({
            name: item.name,
            id,
            thumbUrl: img,
          }))
        );
      }
      return arr;
    }, []);
    Promise.all(promisList).then(result => {
      this.props.onChange(result);
    });
  };

  parseValue() {
    if (_.isArray(this.props.value)) {
      return this.props.value.map(item => ({
        uid: item.id,
        size: 0,
        name: item.name,
        response: { data: { id: item.id } },
        thumbUrl: item.thumbUrl,
      }));
    }
    return null;
  }

  render() {
    const { url, baseUrl = apiUrl, listType, withCredentials = true } = this.props;
    const actionUrl = baseUrl + url;
    return (
      <Upload
        action={actionUrl}
        listType={listType}
        withCredentials={withCredentials}
        onChange={this.handlerChange}
        // value={this.state.value}
        defaultFileList={this.parseValue()}
        customRequest={customRequest}
      >
        <Button>
          <Icon name="upload" /> Choose file
        </Button>
      </Upload>
    );
  }
}
