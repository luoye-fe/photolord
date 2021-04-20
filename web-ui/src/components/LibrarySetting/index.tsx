import React from 'react';
import { Modal } from 'antd';

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

  function handleOk() {
    onConfirm();
  }

  function handleCancel() {
    onCancel();
  }

  return (
    <Modal
      title={mode === 'add' ? 'Add Library' : 'Edit Library'}
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
