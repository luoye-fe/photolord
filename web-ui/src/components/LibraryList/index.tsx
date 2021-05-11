import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';

import LibraryItem from '@/components/LibraryItem';
import LibrarySetting from '@/components/LibrarySetting';
import fetch from '@/common/fetch';
import useLocale from '@/hooks/locale';
import useLoading from '@/hooks/loading';

import styles from './index.module.scss';

interface PropsType {
  onLibraryClick: (libraryInfo: LibraryInfo) => void;
}

const LibraryList = (props: PropsType) => {
  const { onLibraryClick } = props;
  const [libraryInfo, setLibraryInfo] = useState<LibraryInfo | undefined>(undefined);
  const [libraryList, setLibraryList] = useState<LibraryInfo[]>([]);
  const [mode, setMode] = useState('add');
  const [showLibrarySettingModal, setShowLibrarySettingModal] = useState(false);
  const [autoUpdateList, setAutoUpdateList] = useState(false);
  const [setStoreLoading] = useLoading();
  const [getLocaleText] = useLocale();

  async function getLibraryList(mute = false): Promise<LibraryInfo[]> {
    if (!mute) setStoreLoading(true);

    try {
      const res = await fetch({
        url: '/library/list',
      });
      const { list = [] } = res.data;
      if (!mute) {
        setLibraryList(list);
        setStoreLoading(false);
      }
      return list as LibraryInfo[];
    } catch (e) {
      if (!mute) {
        message.error(e.message);
        setStoreLoading(false);
      }
    }

    return [];
  }

  function autoGetLibraryList() {
    if (!autoUpdateList) return;

    const handle = async () => {
      const list = await getLibraryList(true);
      setLibraryList(list);

      // all library not scanning, stop auto update
      if (!list.find(i => i.analyseIng === 1)) {
        setAutoUpdateList(false);
        return;
      }

      setTimeout(() => {
        handle();
      }, 1000);
    };

    setTimeout(() => {
      handle();
    }, 1000);
  }

  function handleAddLibrary() {
    setMode('add');
    setLibraryInfo(undefined);
    setShowLibrarySettingModal(true);
  }

  function handleEditLibrary(libraryId: number) {
    setMode('edit');
    setLibraryInfo(libraryList.find(i => i.id === libraryId));
    setShowLibrarySettingModal(true);
  }

  function handleLibrarySettingCancel() {
    setShowLibrarySettingModal(false);
  }

  function handleLibrarySettingConfirm(res: LibraryInfo) {
    setStoreLoading(true);

    fetch({
      url: mode === 'add' ? '/library/create' : '/library/update',
      method: 'POST',
      data: mode === 'add' ? {
        path: res.path,
        comment: res.comment,
      } : {
        id: libraryInfo?.id,
        comment: res.comment,
      },
    })
      .then(() => {
        if (mode === 'add') message.success(getLocaleText('common.add_library_success'));
        if (mode === 'edit') message.success(getLocaleText('common.update_library_success'));
        getLibraryList();
        setShowLibrarySettingModal(false);
      })
      .catch(e => {
        message.error(e.message);
        setStoreLoading(false);
      });
  }

  function handleEnterLibrary(libraryInfo: LibraryInfo) {
    onLibraryClick(libraryInfo);
  }

  function handleDeleteLibrary(libraryId: number) {
    setStoreLoading(true);
    fetch({
      url: '/library/delete',
      method: 'POST',
      data: {
        id: libraryId,
      },
    })
      .then(() => {
        message.success(getLocaleText('common.delete_library_success'));
        getLibraryList();
      })
      .catch(e => {
        message.error(e.message);
        setStoreLoading(false);
      });
  }

  function handleScanLibrary(libraryId: number) {
    setStoreLoading(true);

    fetch({
      url: '/library/scan',
      method: 'POST',
      data: {
        id: libraryId,
      },
    })
      .then(() => {
        message.success(getLocaleText('common.scan_library_begin_message'));

        setStoreLoading(false);
        setAutoUpdateList(true);
      })
      .catch(e => {
        message.error(e.message);
        setStoreLoading(false);
      });
  }

  useEffect(() => {
    getLibraryList()
      .then((list = []) => {
        // has scanning library, auto update
        if (list.find(i => i.analyseIng === 1)) {
          setAutoUpdateList(true);
        }
      });
  }, []);

  useEffect(() => {
    if (autoUpdateList) autoGetLibraryList();
  }, [autoUpdateList]);

  return (
    <>
      <div className={styles['library-list']}>
        <div className={styles['library-collect']}>
          <p className={styles['library-collect-info']}>{libraryList.length} {getLocaleText('common.libraries')}</p>
          <div className={styles['library-collect-actions']}>
            <Button size="small" type="primary" className={styles['library-collect-action']} onClick={handleAddLibrary}>{getLocaleText('common.add_library')}</Button>
          </div>
        </div>
        {libraryList.map(i => (<LibraryItem key={i.id} library={i} onEnterLibrary={handleEnterLibrary} onDeleteLibrary={handleDeleteLibrary} onEditLibrary={handleEditLibrary} onScanLibrary={handleScanLibrary} />))}
      </div>
      <LibrarySetting mode={mode} libraryInfo={libraryInfo} show={showLibrarySettingModal} onCancel={handleLibrarySettingCancel} onConfirm={handleLibrarySettingConfirm} />
    </>
  );
};

export default LibraryList;
