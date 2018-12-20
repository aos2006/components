import { apiUrl } from '@latoken-component/utils';
import { Icon, Upload, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import React from 'react';
import { customRequest } from './helpers';

interface IFile {
  uid?: number;
  name?: string;
  status?: string;
  size?: number;
  url?: string;
}

export interface IDocumentLoaderProps {
  id?: string;
  baseUrl?: string;
  cdnUrl?: string;
  disabled?: boolean;
  value?: UploadFile[];
  onChange(args: IFile[]): any;
  url: string;
  className?: string;
  extensions?: string[];
}

export default class DocumentLoader extends React.Component<IDocumentLoaderProps> {
  setAccept() {
    const { extensions } = this.props;

    if (!extensions) return '';

    return extensions.map(ext => `.${ext}`).join(', ');
  }

  uploadButton = key => (
    <div key={key}>
      <Icon type="plus" key={`${key}-icon`} />
      <div className="ant-upload-text" key={`${key}-text`}>
        Upload
      </div>
    </div>
  );

  loadSuccess = key => (
    <div key={key}>
      <Icon type="check" style={{ fontSize: 40, color: '#00a854' }} />
    </div>
  );

  handleFiles = val => {
    const result = val.fileList.length
      ? val.fileList.filter(x => x.status === 'done').map(x => ({
          uid: _.get(x, 'response.id') || _.get(x, 'response.data.id'),
          name: _.get(x, 'response.name') || _.get(x, 'response.data.name'),
          status: 'done',
          url:
            (this.props.cdnUrl || apiUrl) +
            (_.get(x, 'response.link') || _.get(x, 'response.data.link')),
        }))
      : [];

    this.props.onChange(result);
  };

  @autobind
  beforeUpload(file) {
    const isLt5M = file.size / 1024 / 1024 < 20;

    if (!isLt5M) {
      notification.error({
        message: 'Error',
        description: 'Document size should not exceed 20 MB',
        duration: 3,
      });
    }

    return isLt5M;
  }

  render() {
    const { id, disabled, value, baseUrl = apiUrl, url, className, ...props } = this.props;

    const accept: any = this.setAccept();

    const newProps: any = {
      ...props,
    };

    if (this.props.extensions) {
      newProps.accept = accept;
    }

    return (
      <Upload
        {...newProps}
        key={id}
        className={`${className} ${id}-uploader`}
        disabled={Boolean(disabled || (value && value.length))}
        withCredentials={true}
        name="file"
        action={baseUrl + url}
        defaultFileList={value || []}
        onChange={this.handleFiles}
        listType="text"
        beforeUpload={this.beforeUpload}
        customRequest={customRequest}
      >
        {value && value.length ? this.loadSuccess(id) : this.uploadButton(id)}
      </Upload>
    );
  }
}
