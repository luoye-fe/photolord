import React, { useState, useEffect } from 'react';
import { message, Spin, Button } from 'antd';

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
        <div className={styles['library-collect']}>
          <p className={styles['library-collect-info']}>{libraryList.length} Libraries</p>
          <div className={styles['library-collect-actions']}>
            <Button size="small" type="primary" className={styles['library-collect-action']}>Add New Library</Button>
          </div>
        </div>
        {libraryList.map(i => (<LibraryItem key={i.id} library={i} />))}
      </div>
    </Spin>
  );
};

export default LibraryTab;
