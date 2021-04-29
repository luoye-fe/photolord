import React from 'react';
import { FolderOpenOutlined, EllipsisOutlined, LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Dropdown, Popconfirm } from 'antd';

import CustomMenu, {CustomMenuItem} from '@/components/CustomMenu';
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
        <CustomMenu>
          <CustomMenuItem disable={library.analyseIng === 1}>
            <Popconfirm disabled={library.analyseIng === 1} title={getLocaleText('common.scan_library_confirm')} onConfirm={() => onScanLibrary(library.id)}>{getLocaleText('common.scan_library')}</Popconfirm>
          </CustomMenuItem>
          <CustomMenuItem onClick={() => onEditLibrary(library.id)}>
            {getLocaleText('common.edit_library')}
          </CustomMenuItem>
          <CustomMenuItem>
            <Popconfirm title={getLocaleText('common.delete_library_confirm')} onConfirm={() => onDeleteLibrary(library.id)}>{getLocaleText('common.delete_library')}</Popconfirm>
          </CustomMenuItem>
        </CustomMenu>
      )}>
        <EllipsisOutlined className={styles['icon-setting']} />
      </Dropdown>
    </div>
  );
};

export default LibraryItem;
