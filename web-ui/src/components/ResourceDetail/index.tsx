import React from 'react';
import { Button, Modal } from 'antd';

import useLocale from '@/hooks/locale';

// import styles from './index.module.scss';

interface PropsType {
  show: boolean;
  detail: IResourceDetail | null;
  onConfirm: () => void;
}

const ResourceDetail = (props: PropsType) => {
  const { show, onConfirm, detail } = props;

  const [getLocaleText] = useLocale();

  return (
    <Modal
      title={`${getLocaleText('common.resource', true)} ${getLocaleText('common.detail', true)}`}
      visible={!!(show && detail)}
      footer={[
        <Button key="button" type="primary" onClick={onConfirm}>{getLocaleText('common.confirm')}</Button>,
      ]}
    >
      <p>123123</p>
    </Modal>
  );
};

export default ResourceDetail;
