import React, { useContext } from 'react';
import { FolderOpenOutlined, EllipsisOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Dropdown, Popconfirm } from 'antd';
import locale from '@/locales';
import RootContext from '@/store/context';

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
  const {
    state,
  } = useContext(RootContext);

  function getLocaleText(key: string) {
    const _locale = state.setting.locale;
    const options = { language: _locale };
    return locale(key, options);
  }

  return (
    <div className={styles['library-item-container']} title={library && library.path}>
      <FolderOpenOutlined className={styles['icon-folder']} />
      <div className={styles.info}>
        <div><p onClick={() => onEnterLibrary(library.id)} className={classnames([styles.path, styles.text])} title={library.path}>{library.path}</p></div>
        {styles.comment && <div><p className={classnames([styles.comment, styles.text])} title={library.comment}>{library.comment}</p></div>}
      </div>
      <Dropdown overlay={(
        <ul className={styles['library-action-menu']}>
          <li className={styles['library-action-menu-item']} onClick={() => onScanLibrary(library.id)}>{getLocaleText('common.scan_library')}</li>
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
