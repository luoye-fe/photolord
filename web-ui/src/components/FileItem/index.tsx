import React from 'react';
import { config } from 'ice';
const { baseURL } = config;

interface PropsType {
  photo: PhotoInfo;
}

const FileItem = (props: PropsType) => {
  const { photo } = props;
  return (
    <div>
      <img src={`${baseURL}/transcode?md5=${photo.md5}&heigh=200`} />
    </div>
  );
};

export default FileItem;
