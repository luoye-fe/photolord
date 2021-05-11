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
import useLoading from '@/hooks/loading';

import TitleBar from './components/TitleBar';
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
  const [tabList, setTabList] = useState(TAB_LIST);
  const [setStoreLoading] = useLoading();

  const {
    state,
    dispatch,
  } = useContext(RootContext);

  function handleActiveTabIndexChange(index: number) {
    setActiveTabIndex(index);
  }

  useEffect(() => {
    setTabList(TAB_LIST.map(tab => locale(`common.${tab}`, {
      language: state.setting.locale,
      uppercase: 'all',
    })));
  }, [state.setting.locale]);

  useEffect(() => {
    setStoreLoading(true);
    fetch({
      url: '/setting/info',
    })
      .then(res => {
        const { locale = 'en' } = res.data;

        dispatch({
          type: RootReducerActionType.SET_SETTING,
          payload: {
            locale,
          },
        });

        setShowContent(true);
        setStoreLoading(false);
      })
      .catch(e => {
        message.error(e.message);
        setStoreLoading(false);
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
            <div className={styles.main} id="main-container">
              {activeTabIndex === 0 && <LibraryTab />}
              {activeTabIndex === 1 && <TimelineTab />}
              {activeTabIndex === 2 && <SearchTab />}
            </div>
          </div>
        </ConfigProvider>
      )}
    </Spin>
  );
}
