import React, { useContext, useEffect, useState } from 'react';
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
  const [deleteActionText, setDeleteActionText] = useState('Delete Library');
  const [scanActionText, setScanActionText] = useState('Delete Library');
  const [editActionText, setEditActionText] = useState('Delete Library');
  const [deleteActionConfirmText, setDeleteActionConfirmText] = useState('Are you sure to delete this Library?');
  const {
    state,
  } = useContext(RootContext);

  useEffect(() => {
    const _locale = state.setting.locale;
    const options = { language: _locale };
    setDeleteActionText(locale('common.delete_library', options));
    setScanActionText(locale('common.scan_library', options));
    setEditActionText(locale('common.edit_library', options));
    setDeleteActionConfirmText(locale('common.delete_library_confirm', options));
  }, [state.setting.locale]);


  return (
    <div className={styles['library-item-container']} title={library && library.path}>
      <FolderOpenOutlined className={styles['icon-folder']} />
      <div className={styles.info}>
        <div><p onClick={() => onEnterLibrary(library.id)} className={classnames([styles.path, styles.text])} title={library.path}>{library.path}</p></div>
        {styles.comment && <div><p className={classnames([styles.comment, styles.text])} title={library.comment}>{library.comment}</p></div>}
      </div>
      <Dropdown overlay={(
        <ul className={styles['library-action-menu']}>
          <li className={styles['library-action-menu-item']} onClick={() => onScanLibrary(library.id)}>{scanActionText}</li>
          <li className={styles['library-action-menu-item']} onClick={() => onEditLibrary(library.id)}>{editActionText}</li>
          <li className={styles['library-action-menu-item']}>
            <Popconfirm title={deleteActionConfirmText} onConfirm={() => onDeleteLibrary(library.id)}>{deleteActionText}</Popconfirm>
          </li>
        </ul>
      )}>
        <EllipsisOutlined className={styles['icon-setting']} />
      </Dropdown>
    </div>
  );
};

export default LibraryItem;
