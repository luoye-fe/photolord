import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import useLocale from '@/hooks/locale';

import styles from './index.module.scss';

interface PropsType {
  mode?: string;
  show: boolean;
  libraryInfo?: LibraryInfo;
  onConfirm: (formValue: any) => void;
  onCancel: () => void;
}

const LibrarySetting = (props: PropsType) => {
  const { mode = 'add', show, onConfirm, onCancel, libraryInfo } = props;
  const [formInstance] = Form.useForm();
  const [getLocaleText] = useLocale();

  function handleOk() {
    formInstance
      .validateFields()
      .then(res => {
        onConfirm(res);
      });
  }

  function handleCancel() {
    onCancel();
  }

  useEffect(() => {
    if (show) {
      formInstance.setFieldsValue({
        path: libraryInfo?.path,
        comment: libraryInfo?.comment,
      });
    }
  }, [show]);

  return (
    <Modal
      title={mode === 'add' ? getLocaleText('common.add_library') : getLocaleText('common.edit_library')}
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      className={styles.container}>
      <Form layout="vertical" form={formInstance}>
        <Form.Item
          name="path"
          label={getLocaleText('common.library_path')}
          rules={[{ required: true, message: getLocaleText('common.library_path_input') }]}>
          <Input disabled={mode === 'edit'} placeholder={getLocaleText('common.library_path_input')} />
        </Form.Item>
        <Form.Item name="comment" label={getLocaleText('common.library_comment')}>
          <Input placeholder={getLocaleText('common.library_comment_input')} />
        </Form.Item>
        <Form.Item name="autoAnalyse" valuePropName="checked" label={getLocaleText('common.auto_analyse')}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LibrarySetting;
