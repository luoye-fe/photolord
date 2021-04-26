import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { config } from 'ice';

import styles from './index.module.scss';

const { baseURL } = config;

interface PropsType {
  directory: TreeDirectoryItem;
  itemHeight?: number;
  onDirClick: (path: string) => void;
}

interface FormattedResourceInfo extends IResourceInfo {
  showWidth: number;
  showHeight: number;
}

const DirItem = (props: PropsType) => {
  const { directory, itemHeight = 100, onDirClick } = props;
  const [previewList, setPreviewList] = useState<FormattedResourceInfo[]>([]);

  const itemWidth = itemHeight;
  const getImageResultUrl = useCallback((md5, w, h) => {
    return `${baseURL}/transcode?md5=${md5}&height=${h}&width=${w}`;
  }, []);

  function handleDirClick() {
    onDirClick(directory.path);
  }

  useEffect(() => {
    const len = directory.preview.length;
    setPreviewList(directory.preview.map((item, index) => {
      if (len === 1) return {
        ...item,
        showWidth: itemWidth,
        showHeight: itemHeight,
      };

      if (len === 2) return {
        ...item,
        showWidth: Math.floor((itemWidth - 6) / 2),
        showHeight: itemHeight,
      };

      if (len === 3) {
        if (index === 0 || index === 1) return {
          ...item,
          showWidth: Math.floor((itemWidth - 6) / 2),
          showHeight: Math.floor((itemHeight - 6) / 2),
        };

        return {
          ...item,
          showWidth: itemWidth,
          showHeight: Math.floor((itemHeight - 6) / 2),
        };
      }

      if (len === 4) return {
        ...item,
        showWidth: Math.floor((itemWidth - 6) / 2),
        showHeight: Math.floor((itemHeight - 6) / 2),
      };

      return {
        ...item,
        showHeight: itemWidth - 6,
        showWidth: itemHeight - 6,
      };
    }));
  }, [directory.preview]);

  return (
    <div className={styles.directory} onClick={handleDirClick}>
      <div className={classnames([styles['directory-main']])} style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}>
        <div className={styles['resource-preview']}>
          {previewList.map((item, index) => (<img key={item.id} className={classnames([styles['resource-preview-item'], styles[`resource-preview-item-index-${index}`]])} src={getImageResultUrl(item.md5, item.showWidth, item.showHeight)} />))}
        </div>
        <div className={styles['directory-action-container']} />
      </div>
      <p className={styles['directory-name']} style={{ width: `${itemWidth}px` }}>{directory.dirName}</p>
    </div>
  );
};

export default DirItem;
