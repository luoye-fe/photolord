import React from 'react';
import { FolderOpenOutlined, EllipsisOutlined, LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Dropdown, Popconfirm } from 'antd';

import useLocale from '@/hooks/locale';

import styles from './index.module.scss';

interface PropsType {
  library: LibraryInfo;
  onEnterLibrary: (libraryInfo: LibraryInfo) => void;
  onScanLibrary: (id: number) => void;
  onEditLibrary: (id: number) => void;
  onDeleteLibrary: (id: number) => void;
}

const LibraryItem = (props: PropsType) => {
  const { library, onEnterLibrary, onScanLibrary, onEditLibrary, onDeleteLibrary } = props;

  const [getLocaleText] = useLocale();

  return (
    <div className={styles['library-item-container']} title={library && library.path}>
      <FolderOpenOutlined className={styles['icon-folder']} />
      <div className={styles.info}>
        <div><p onClick={() => onEnterLibrary(library)} className={classnames([styles.path, styles.text])} title={library.path}>{library.path}</p></div>
        {styles.comment && <div><p className={classnames([styles.comment, styles.text])} title={library.comment}>{library.comment}</p></div>}
      </div>
      {library.analyseIng === 1 && <LoadingOutlined style={{ fontSize: 12, color: '#e9a049' }} spin />}
      <Dropdown overlay={(
        <ul className={styles['library-action-menu']}>
          <li className={classnames([styles['library-action-menu-item'], library.analyseIng === 1 ? styles['library-action-menu-item-disable'] : ''])}>
            <Popconfirm disabled={library.analyseIng === 1} title={getLocaleText('common.scan_library_confirm')} onConfirm={() => onScanLibrary(library.id)}>{getLocaleText('common.scan_library')}</Popconfirm>
          </li>
          <li className={styles['library-action-menu-item']} onClick={() => onEditLibrary(library.id)}>{getLocaleText('common.edit_library')}</li>
          <li className={styles['library-action-menu-item']}>
            <Popconfirm title={getLocaleText('common.delete_library_confirm')} onConfirm={() => onDeleteLibrary(library.id)}>{getLocaleText('common.delete_library')}</Popconfirm>
          </li>
        </ul>
      )}>
        <EllipsisOutlined className={styles['icon-setting']} />
      </Dropdown>
    </div>
  );
};

export default LibraryItem;
