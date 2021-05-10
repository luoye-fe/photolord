import React from 'react';
import { Modal } from 'antd';

// import styles from './index.module.scss';

interface PropsType {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ResourceDetail = (props: PropsType) => {
  const { show, onCancel, onConfirm } = props;
  return (
    <Modal visible={show} onCancel={onCancel} onOk={onConfirm}>

    </Modal>
  );
};

export default ResourceDetail;
