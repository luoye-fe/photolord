import React, { useState, useEffect, useRef } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import { config } from 'ice';
import classnames from 'classnames';

import fetch from '@/common/fetch';
import CustomMenu, { CustomMenuItem } from '@/components/CustomMenu';
import ResourceDetail from '@/components/ResourceDetail';
import useLocale from '@/hooks/locale';
import useLoading from '@/hooks/loading';

import styles from './index.module.scss';

const { baseURL } = config;

interface PropsType {
  photo: IResourceInfo;
  itemHeight?: number;
  itemWidth?: number;
}

const ResourceItem = (props: PropsType) => {
  const { photo, itemHeight = 100, itemWidth } = props;
  const { width, height, md5 } = photo;

  const imageWidth = itemWidth ? itemWidth : Math.floor(width / height * itemHeight);
  const imageResultUrl = `${baseURL}/transcode?md5=${photo.md5}&width=${imageWidth}&height=${itemHeight}`;

  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [resourceDetail, setResourceDetail] = useState<IResourceDetail | null>(null);
  const [getLocaleText] = useLocale();
  const [setStoreLoading] = useLoading();

  const containerElement = useRef<HTMLDivElement>(null);
  const imageElement = useRef<HTMLImageElement>(null);

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
    setStoreLoading(true);
    fetch({
      url: '/resource/detail',
      params: {
        md5,
      },
    })
      .then(res => {
        setResourceDetail(res.data as IResourceDetail);
        setStoreLoading(false);
        setShowDetail(true);
      })
      .catch(e => {
        message.error(e.message);
        setStoreLoading(false);
      });
  }

  function handleHideResourceDetail() {
    setShowDetail(false);
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
      <ResourceDetail show={showDetail} onConfirm={handleHideResourceDetail} detail={resourceDetail} />
    </div>
  );
};

export default ResourceItem;
