import React from 'react';
import { FolderOpenOutlined, EllipsisOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Dropdown, Popconfirm } from 'antd';

import styles from './index.module.scss';

interface PropsType {
  library: LibraryInfo;
  onEnterLibrary: (id: number) => void;
  onScanLibrary: (id: number) => void;
  onEditLibrary: (id: number) => void;
  onDeleteLibrary: (id: number) => void;
}

const LibraryItem = (props: PropsType) => {
  const { library, onEnterLibrary, onScanLibrary, onEditLibrary, onDeleteLibrary } = props;

  return (
    <div className={styles['library-item-container']} title={library && library.path}>
      <FolderOpenOutlined className={styles['icon-folder']} />
      <div className={styles.info}>
        <div><p onClick={() => onEnterLibrary(library.id)} className={classnames([styles.path, styles.text])} title={library.path}>{library.path}</p></div>
        {styles.comment && <div><p className={classnames([styles.comment, styles.text])} title={library.comment}>{library.comment}</p></div>}
      </div>
      <Dropdown overlay={(
        <ul className={styles['library-action-menu']}>
          <li className={styles['library-action-menu-item']} onClick={() => onScanLibrary(library.id)}>Scan Library</li>
          <li className={styles['library-action-menu-item']} onClick={() => onEditLibrary(library.id)}>Edit Library</li>
          <li className={styles['library-action-menu-item']}>
            <Popconfirm title="Are you sure to delete this Library?" onConfirm={() => onDeleteLibrary(library.id)}>
              Delete Library
            </Popconfirm>
          </li>
        </ul>
      )}>
        <EllipsisOutlined className={styles['icon-setting']} />
      </Dropdown>
    </div>
  );
};

export default LibraryItem;
