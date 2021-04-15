import React from 'react';
import classnames from 'classnames';

import iconStyles from '@/common/iconfont.module.scss';
import styles from './index.module.scss';

interface PropsType {
  tabList: string[];
  activeTabIndex: number;
  disableTabClick?: boolean;
  onActiveTabIndexChange: (index: number) => void;
}

const TitleBar = (options: PropsType) => {
  const {
    tabList = [],
    activeTabIndex,
    onActiveTabIndexChange,
    disableTabClick = false,
  } = options;

  function handleActionItemClick(index: number) {
    if (disableTabClick) return;
    onActiveTabIndexChange(index);
  }

  return (
    <div className={styles.container}>
      <div className={styles['title']}>
        <p className={styles['title-text']}>Photo Lord</p>
      </div>
      <ul className={styles['action-list']}>
        {tabList.map((tab, tabIndex) => (
          <li onClick={() => handleActionItemClick(tabIndex)} className={classnames({
            [styles['action-item']]: true,
            [styles['action-item-active']]: tabIndex === activeTabIndex,
          })}>{tab}</li>  
        ))}
      </ul>
      <div className={styles['action-icon']}>
        <i className={classnames([styles['action-icon-item'], iconStyles['iconfont'], iconStyles['icon-setting']])} />
      </div>
    </div>
  );
};

export default TitleBar;
