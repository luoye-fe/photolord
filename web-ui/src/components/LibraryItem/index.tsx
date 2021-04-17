import React from 'react';
import classnames from 'classnames';

import iconStyles from '@/common/iconfont.module.scss';
import styles from './index.module.scss';

interface PropsType {
  library: LibraryInfo;
}

const LibraryItem = (props: PropsType) => {
  const { library } = props;
  return (
    <div className={styles['library-item-container']} title={library.path}>
      <div className={styles['library-item-main']}>
        <i className={classnames(styles['iconfont'], iconStyles['iconfont'], iconStyles['icon-dir'])} />
        <p className={styles.path} title={library.path}>{library.path}</p>
        {styles.comment && <p className={styles.comment} title={library.comment}>{library.comment}</p>}
      </div>
    </div>
  );
};

export default LibraryItem;
