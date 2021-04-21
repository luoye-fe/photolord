import React, { useEffect, useContext, useState } from 'react';
import { Modal } from 'antd';
import RootContext from '@/store/context';
import locale from '@/locales';

import styles from './index.module.scss';

interface PropsType {
  mode?: string;
  show: boolean;
  libraryInfo?: LibraryInfo;
  onConfirm: () => void;
  onCancel: () => void;
}

const LibrarySetting = (props: PropsType) => {
  const { mode = 'add', show, onConfirm, onCancel } = props;
  const [editActionText, setEditActionText] = useState('Edit Library');
  const [addActionText, setAddActionText] = useState('Add Library');
  const {
    state,
  } = useContext(RootContext);

  useEffect(() => {
    const _locale = state.setting.locale;
    const options = { language: _locale };
    setAddActionText(locale('common.add_library', options));
    setEditActionText(locale('common.edit_library', options));
  }, [state.setting.locale]);

  function handleOk() {
    onConfirm();
  }

  function handleCancel() {
    onCancel();
  }

  return (
    <Modal
      title={mode === 'add' ? addActionText : editActionText}
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      className={styles.container}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

export default LibrarySetting;
