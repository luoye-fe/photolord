import React, { useState, useEffect, useRef } from 'react';
import { config } from 'ice';
import classnames from 'classnames';

import styles from './index.module.scss';
import iconStyles from '@/common/iconfont.module.scss';

const { baseURL } = config;

interface PropsType {
  photo: PhotoInfo;
  itemHeight?: number;
}

const ResourceItem = (props: PropsType) => {
  const { photo, itemHeight = 100 } = props;
  const { width, height } = photo;

  const imageWidth = width / height * itemHeight;
  const imageResultUrl = `${baseURL}/transcode?md5=${photo.md5}&height=${itemHeight}`;

  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');
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
            <i className={classnames([styles['icon-point'], iconStyles['iconfont'], iconStyles['icon-point']])} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceItem;
