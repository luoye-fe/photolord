import React, { useState, useEffect, useContext } from 'react';
import fetch from '@/common/fetch';
import Spin from '@/components/Loading';

import TitleBar from './components/TitleBar';
import ActionBar from './components/ActionBar';

import LibraryTab from './components/LibraryTab';
import TimelineTab from './components/TimelineTab';
import SearchTab from './components/SearchTab';

import RootContext from '@/store/context';

import styles from './index.module.scss';

const TAB_LIST = ['library', 'timeline', 'search'];

export default function Main() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [breadcrumbConfig, setBreadcrumbConfig] = useState<BreadcrumbConfig[]>([]);
  const {
    state,
    dispatch,
  } = useContext(RootContext);

  function handleActiveTabIndexChange(index: number) {
    setActiveTabIndex(index);
  }

  function handlePhotoCountChange(count: number) {
    setPhotoCount(count);
  }

  function handleBreadcrumbChange(breadcrumbConfig: BreadcrumbConfig[]) {
    setBreadcrumbConfig(breadcrumbConfig);
  }

  useEffect(() => {
    dispatch({
      type: 'loading',
      payload: true,
    });

    fetch({
      url: '/setting/info',
    })
      .then(res => {
        console.log(res.data);
        dispatch({
          type: 'loading',
          payload: false,
        });
      })
      .catch(e => {
        console.log(e);
        dispatch({
          type: 'loading',
          payload: false,
        });
      });
  }, []);
  return (
    <Spin spinning={state.loading}>
      <div className={styles.container}>
        <TitleBar
          tabList={TAB_LIST}
          activeTabIndex={activeTabIndex}
          onActiveTabIndexChange={handleActiveTabIndexChange}
        />
        <ActionBar
          photoCount={photoCount}
          breadcrumb={breadcrumbConfig}
        />
        <div className={styles.main} id="main-container">
          {activeTabIndex === 0 && <LibraryTab />}
          {activeTabIndex === 1 && <TimelineTab
            onBreadcrumbChange={handleBreadcrumbChange}
            onPhotoCountChange={handlePhotoCountChange} />}
          {activeTabIndex === 2 && <SearchTab />}
        </div>
      </div>
    </Spin>
  );
}
