import React, { useState, useEffect, useContext } from 'react';
import { message, Button } from 'antd';

import LibraryItem from '@/components/LibraryItem';
import LibrarySetting from '@/components/LibrarySetting';
import fetch from '@/common/fetch';
import RootContext from '@/store/context';
import { RootReducerActionType } from '@/store/type';
import locale from '@/locales';

import styles from './index.module.scss';

const LibraryList = () => {
  const [libraryInfo, setLibraryInfo] = useState<LibraryInfo | undefined>(undefined);
  const [libraryList, setLibraryList] = useState<LibraryInfo[]>([]);
  const [mode, setMode] = useState('add');
  const [showLibrarySettingModal, setShowLibrarySettingModal] = useState(false);

  const {
    state,
    dispatch,
  } = useContext(RootContext);

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
    dispatch({
      type: RootReducerActionType.SET_LOADING,
      payload: true,
    });
    fetch({
      url: '/library/delete',
      method: 'POST',
      data: {
        id: libraryId,
      },
    })
      .then(() => {
        message.success(locale('common.delete_library_success', { language: state.setting.locale }));
        getLibraryList();
      })
      .catch(e => {
        message.error(e.message);
        dispatch({
          type: RootReducerActionType.SET_LOADING,
          payload: false,
        });
      });
  }

  function handleScanLibrary(libraryId: number) {
    console.log(libraryId);
  }

  function handleEditLibrary(libraryId: number) {
    setMode('edit');
    setLibraryInfo(libraryList.find(i => i.id === libraryId));
    setShowLibrarySettingModal(true);
  }

  function getLibraryList() {
    dispatch({
      type: RootReducerActionType.SET_LOADING,
      payload: true,
    });
    fetch({
      url: '/library/list',
    })
      .then(res => {
        const { list = [] } = res.data;
        setLibraryList(list);
        dispatch({
          type: RootReducerActionType.SET_LOADING,
          payload: false,
        });
      })
      .catch(e => {
        message.error(e.message);
        dispatch({
          type: RootReducerActionType.SET_LOADING,
          payload: false,
        });
      });
  }

  useEffect(() => {
    getLibraryList();
  }, []);

  return (
    <>
      <div className={styles['library-list']}>
        <div className={styles['library-collect']}>
          <p className={styles['library-collect-info']}>{libraryList.length} {locale('common.libraries', { language: state.setting.locale, uppercase: 'first' })}</p>
          <div className={styles['library-collect-actions']}>
            <Button size="small" type="primary" className={styles['library-collect-action']} onClick={handleAddLibrary}>{locale('common.add_library', { language: state.setting.locale, uppercase: 'first' })}</Button>
          </div>
        </div>
        {libraryList.map(i => (<LibraryItem key={i.id} library={i} onEnterLibrary={handleEnterLibrary} onDeleteLibrary={handleDeleteLibrary} onEditLibrary={handleEditLibrary} onScanLibrary={handleScanLibrary} />))}
      </div>
      <LibrarySetting mode={mode} libraryInfo={libraryInfo} show={showLibrarySettingModal} onCancel={handleLibrarySettingCancel} onConfirm={handleLibrarySettingConfirm} />
    </>
  );
};

export default LibraryList;
