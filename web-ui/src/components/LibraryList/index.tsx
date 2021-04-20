import React, { useState, useEffect } from 'react';
import { message, Spin, Button } from 'antd';

import LibraryItem from '@/components/LibraryItem';
import LibrarySetting from '@/components/LibrarySetting';
import fetch from '@/common/fetch';
import styles from './index.module.scss';

const LibraryList = () => {
  // const [dir, serDir] = useState<string[]>([]);
  const [libraryInfo, setLibraryInfo] = useState<LibraryInfo | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [libraryList, setLibraryList] = useState<LibraryInfo[]>([]);
  const [mode, setMode] = useState('add');
  const [showLibrarySettingModal, setShowLibrarySettingModal] = useState(false);

  function handleAddLibrary() {
    setMode('add');
    setLibraryInfo(undefined);
    setShowLibrarySettingModal(true);
  }

  function handleLibrarySettingCancel() {
    setShowLibrarySettingModal(false);
  }

  function handleLibrarySettingConfirm() {
    setShowLibrarySettingModal(false);
  }

  function handleEnterLibrary(libraryId: number) {
    console.log(libraryId);
  }

  function handleDeleteLibrary(libraryId: number) {
    console.log(libraryId);
  }

  function handleScanLibrary(libraryId: number) {
    console.log(libraryId);
  }

  function handleEditLibrary(libraryId: number) {
    setMode('edit');
    setLibraryInfo(libraryList.find(i => i.id === libraryId));
    setShowLibrarySettingModal(true);
  }

  useEffect(() => {
    setLoading(true);
    fetch({
      url: '/library/list',
    })
      .then(res => {
        const { list = [] } = res.data;
        setLibraryList(list);
        setLoading(false);
      })
      .catch(e => {
        message.error(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <Spin spinning={loading}>
      <div className={styles['library-list']}>
        <div className={styles['library-collect']}>
          <p className={styles['library-collect-info']}>{libraryList.length} Libraries</p>
          <div className={styles['library-collect-actions']}>
            <Button size="small" type="primary" className={styles['library-collect-action']} onClick={handleAddLibrary}>Add New Library</Button>
          </div>
        </div>
        {libraryList.map(i => (<LibraryItem key={i.id} library={i} onEnterLibrary={handleEnterLibrary} onDeleteLibrary={handleDeleteLibrary} onEditLibrary={handleEditLibrary} onScanLibrary={handleScanLibrary} />))}
      </div>
      <LibrarySetting mode={mode} libraryInfo={libraryInfo} show={showLibrarySettingModal} onCancel={handleLibrarySettingCancel} onConfirm={handleLibrarySettingConfirm} />
    </Spin>
  );
};

export default LibraryList;
