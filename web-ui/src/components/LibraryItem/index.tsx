import React from 'react';
import { FolderOpenOutlined, PlusCircleOutlined } from '@ant-design/icons';

import styles from './index.module.scss';

interface PropsType {
  library?: LibraryInfo;
  mode?: string;
  onLibraryAddClick?: () => void;
  onLibraryDetailClick?: (library: LibraryInfo) => void;
}

const LibraryItem = (props: PropsType) => {
  const { library, mode = 'detail', onLibraryAddClick, onLibraryDetailClick } = props;

  function handleLibraryAddClick() {
    if (!onLibraryAddClick) return;
    onLibraryAddClick();
  }

  function handleLibraryDetailClick() {
    if (!onLibraryDetailClick || !library) return;
    onLibraryDetailClick(library);
  }

  return (
    <div className={styles['library-item-container']} title={library && library.path}>
      {mode === 'detail' && library && (
        <div className={styles['library-item-main']} onClick={handleLibraryDetailClick}>
          <FolderOpenOutlined style={{ fontSize: '58px' }} />
          <p className={styles.path} title={library.path}>{library.path}</p>
          {styles.comment && <p className={styles.comment} title={library.comment}>{library.comment}</p>}
        </div>
      )}
      {mode === 'add' && (
        <div className={styles['library-item-main']} onClick={handleLibraryAddClick}>
          <PlusCircleOutlined style={{ fontSize: '58px' }} />
          <p className={styles.path} style={{ textAlign: 'center' }}>Add New Library</p>
          <p className={styles.comment}>&nbsp;</p>
        </div>
      )}
    </div>
  );
};

export default LibraryItem;
