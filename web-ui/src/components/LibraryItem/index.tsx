import React from 'react';
import { FolderOpenOutlined, EllipsisOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Menu, Dropdown } from 'antd';

import styles from './index.module.scss';

interface PropsType {
  library: LibraryInfo;
}

const LibraryItem = (props: PropsType) => {
  const { library } = props;

  return (
    <div className={styles['library-item-container']} title={library && library.path}>
      <FolderOpenOutlined className={styles['icon-folder']} />
      <div className={styles.info}>
        <div><p className={classnames([styles.path, styles.text])} title={library.path}>{library.path}</p></div>
        {styles.comment && <div><p className={classnames([styles.comment, styles.text])} title={library.comment}>{library.comment}</p></div>}
      </div>
      <Dropdown overlay={(
        <ul className={styles['library-action-menu']}>
          <li className={styles['library-action-menu-item']}>Scan Library</li>
          <li className={styles['library-action-menu-item']}>Edit Library</li>
          <li className={styles['library-action-menu-item']}>Delete Library</li>
        </ul>
      )}>
        <EllipsisOutlined className={styles['icon-setting']} />
      </Dropdown>
    </div>
  );
};

export default LibraryItem;
