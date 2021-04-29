import React, { useState, useEffect, useRef } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { config } from 'ice';
import classnames from 'classnames';

import CustomMenu, { CustomMenuItem } from '@/components/CustomMenu';
import useLocale from '@/hooks/locale';

import styles from './index.module.scss';

const { baseURL } = config;

interface PropsType {
  photo: IResourceInfo;
  itemHeight?: number;
  itemWidth?: number;
}

const ResourceItem = (props: PropsType) => {
  const { photo, itemHeight = 100, itemWidth } = props;
  const { width, height } = photo;

  const imageWidth = itemWidth ? itemWidth : Math.floor(width / height * itemHeight);
  const imageResultUrl = `${baseURL}/transcode?md5=${photo.md5}&width=${imageWidth}&height=${itemHeight}`;

  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');
  const containerElement = useRef<HTMLDivElement>(null);
  const imageElement = useRef<HTMLImageElement>(null);

  const [getLocaleText] = useLocale();

  let observer: IntersectionObserver;

  function handleIntersect(changes) {
    const { intersectionRatio } = changes[0];
    if (intersectionRatio < 0.5) return;

    if (containerElement.current && observer) {
      observer.unobserve(containerElement.current);
      observer.disconnect();
    }

    // load image
    setImageSrc(imageResultUrl);
    if (imageElement.current) {
      imageElement.current.onload = () => {
        setLoading(false);
      };
    }
  }

  function handleShowResourceDetail() {
    console.log(111);
  }

  useEffect(() => {
    observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: [0.5],
    });
    if (containerElement.current) observer.observe(containerElement.current);
  }, []);

  return (
    <div className={styles.resource}>
      <div ref={containerElement} className={classnames([styles['resource-main']])} style={{ width: `${imageWidth}px`, height: `${itemHeight}px` }}>
        {imageSrc && <img ref={imageElement} className={classnames(styles['resource-image'], !loading && styles['resource-image-show'])} src={imageSrc} />}
        <div className={styles['resource-action-container']}>
          <div className={styles['resource-action-icons']}>
            <Dropdown overlay={(
              <CustomMenu>
                <CustomMenuItem onClick={handleShowResourceDetail}>{getLocaleText('common.detail')}</CustomMenuItem>
              </CustomMenu>
            )}>
              <EllipsisOutlined className={styles['icon-setting']} />
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceItem;
