import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';

import LibraryItem from '@/components/LibraryItem';
import fetch from '@/common/fetch';
import styles from './index.module.scss';

const LibraryTab = () => {
  // const [dir, serDir] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [libraryList, setLibraryList] = useState<LibraryInfo[]>([]);

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
        {libraryList.map(i => (<LibraryItem key={i.id} library={i} />))}
      </div>
    </Spin>
  );
};

export default LibraryTab;
