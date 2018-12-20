import _ from 'lodash';
import React, { Component } from 'react';
import { Icon, notification, Upload } from 'antd';
import { apiUrl } from '@latoken-component/utils';
import { customRequest, resizeDataImg } from './helpers';
import style from './upload-styles.styl';

const Dragger = Upload.Dragger;

function getBase64(img, callback) {
  const reader = new FileReader();

  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const allowTypes = ['image/jpeg', 'image/jpg', 'image/png'];

function beforeUpload(file) {
  const isJPG = allowTypes.indexOf(file.type) > -1;

  if (!isJPG) {
    notification.error({
      message: 'Error',
      description: 'You can only upload Image file',
      duration: 3,
    });
  }
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isLt5M) {
    notification.error({
      message: 'Error',
      description: 'Image size should not exceed 5 MB',
      duration: 3,
    });
  }

  return isLt5M && isJPG;
}

interface IFile {
  name?: string;
  id?: number;
  img?: string;
  secret?: string;
}

export interface IImageLoaderProps {
  url: string;
  baseUrl?: string;
  cdnUrl?: string;
  listType?: 'text' | 'picture' | 'picture-card';
  withCredentials?: boolean;
  onChange?: (images: IFile[]) => void;
}

type ImageLoaderState = {
  loading: boolean;
  imageUrl: string;
};

export default class ImageLoader extends Component<IImageLoaderProps, ImageLoaderState> {
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });

      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const id = _.get(info, 'file.response.id') || _.get(info, 'file.response.data.id');
      const link = _.get(info, 'file.response.link') || _.get(info, 'file.response.data.link');
      const secret = link ? link.replace('/file/', '') : null;
      const name = _.get(info, 'file.name');
      const url =
        (this.props.cdnUrl || apiUrl) +
        (_.get(info, 'response.link') || _.get(info, 'response.data.link'));

      getBase64(info.file.originFileObj, imageUrl => {
        this.setState({
          imageUrl,
          loading: false,
        });
        resizeDataImg(imageUrl, smallImg => {
          const imageObj = { name, id, img: smallImg, secret, url };

          this.props.onChange([imageObj]);
        });
      });
    }
  };

  constructor(props) {
    super(props);
    const imageUrl = Array.isArray(props.value) && props.value.length ? props.value[0].img : '';

    this.state = {
      loading: false,
      imageUrl,
    };
  }

  render() {
    const { url, baseUrl = apiUrl, listType = 'picture-card', withCredentials = true } = this.props;
    const actionUrl = baseUrl + url;
    const imageUrl = this.state.imageUrl;
    const uploadButton = (
      <div>
        <p className="ant-upload-drag-icon">
          <Icon type={this.state.loading ? 'loading' : 'inbox'} />
        </p>
        <p className="ant-upload-text">Click or drag image to this area to upload</p>
      </div>
    );

    return (
      <Dragger
        action={actionUrl}
        listType={listType}
        showUploadList={false}
        withCredentials={withCredentials}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        customRequest={customRequest}
      >
        {imageUrl ? <img className={style['upload-image']} src={imageUrl} alt="" /> : uploadButton}
      </Dragger>
    );
  }
}
