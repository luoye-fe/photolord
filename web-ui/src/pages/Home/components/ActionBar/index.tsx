import React from 'react';
import styles from './index.module.scss';

export interface BreadcrumbConfig {
  text: string;
  menu?: BreadcrumbConfig[];
}

interface PropsType {
  photoCount?: number;
  breadcrumb?: BreadcrumbConfig[];
}

const ActionBar = (props: PropsType) => {
  const { photoCount = 0, breadcrumb = [] } = props;
  console.log(photoCount, breadcrumb);
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>

      </div>
      <div className={styles.filter}>

      </div>
    </div>
  );
};

export default ActionBar;
