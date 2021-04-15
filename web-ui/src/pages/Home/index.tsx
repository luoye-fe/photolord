import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import fetch from '@/common/fetch';

import TitleBar from './components/TitleBar';
import ActionBar from './components/ActionBar';

import LibraryTab from './components/LibraryTab';
import TimelineTab from './components/TimelineTab';
import SearchTab from './components/SearchTab';

import styles from './index.module.scss';

const TAB_LIST = ['library', 'timeline', 'search'];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  function handleActiveTabIndexChange(index: number) {
    setActiveTabIndex(index);
  }

  useEffect(() => {
    setLoading(true);

    fetch({
      url: '/setting/info',
    })
      .then(res => {
        console.log(res.data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });

  }, []);
  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <TitleBar
          tabList={TAB_LIST}
          activeTabIndex={activeTabIndex}
          onActiveTabIndexChange={handleActiveTabIndexChange}
        />
        <ActionBar />
        <div className={styles.main}>
          {activeTabIndex === 0 && <LibraryTab />}
          {activeTabIndex === 1 && <TimelineTab />}
          {activeTabIndex === 2 && <SearchTab />}
        </div>
      </div>
    </Spin>
  );
}
