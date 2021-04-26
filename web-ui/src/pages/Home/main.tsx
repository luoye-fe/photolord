import React, { useState, useEffect, useContext } from 'react';
import { getSearchParams } from 'ice';
import { message, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';

import RootContext from '@/store/context';
import { RootReducerActionType } from '@/store/type';
import fetch from '@/common/fetch';
import Spin from '@/components/Loading';
import locale from '@/locales';

import TitleBar from './components/TitleBar';
import ActionBar from './components/ActionBar';
import LibraryTab from './components/LibraryTab';
import TimelineTab from './components/TimelineTab';
import SearchTab from './components/SearchTab';

import styles from './index.module.scss';

const TAB_LIST = ['library', 'timeline', 'search'];

const localeMap = {
  en: enUS,
  zh: zhCN,
};

export default function Main() {
  const { activeTabIndex: queryActiveTabIndex } = getSearchParams();
  const [showContent, setShowContent] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(Number(queryActiveTabIndex) || 0);
  const [photoCount, setPhotoCount] = useState(0);
  const [breadcrumbConfig, setBreadcrumbConfig] = useState<BreadcrumbConfig[]>([]);
  const [tabList, setTabList] = useState(TAB_LIST);
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
    setTabList(TAB_LIST.map(tab => locale(`common.${tab}`, {
      language: state.setting.locale,
      uppercase: 'all',
    })));
  }, [state.setting.locale]);

  useEffect(() => {
    dispatch({
      type: RootReducerActionType.SET_LOADING,
      payload: true,
    });
    fetch({
      url: '/setting/info',
    })
      .then(res => {
        const { locale = 'en' } = res.data;

        dispatch({
          type: RootReducerActionType.SET_LOADING,
          payload: false,
        });

        dispatch({
          type: RootReducerActionType.SET_SETTING,
          payload: {
            locale,
          },
        });

        setShowContent(true);
      })
      .catch(e => {
        message.error(e.message);
        dispatch({
          type: RootReducerActionType.SET_LOADING,
          payload: false,
        });
      });
  }, []);

  return (
    <Spin spinning={state.loading}>
      {showContent && (
        <ConfigProvider locale={localeMap[state.setting.locale]}>
          <div className={styles.container}>
            <TitleBar
              tabList={tabList}
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
        </ConfigProvider>
      )}
    </Spin>
  );
}
