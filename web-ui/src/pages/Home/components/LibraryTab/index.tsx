import React, { useMemo, useState, useCallback } from 'react';
import { message } from 'antd';

import LibraryList from '@/components/LibraryList';
import ResourceItem from '@/components/ResourceItem';
import DirItem from '@/components/DirItem';
import fetch from '@/common/fetch';
import { getItemSuitableHeight } from '@/common/util';
import styles from './index.module.scss';

const LibraryTab = () => {
  const [tree, setTree] = useState<string[][]>([]);
  const [showLibraryList, setShowLibraryList] = useState(true);
  const [currentLayerList, setCurrentLayerList] = useState<TreeItem[]>([]);
  const [activeLibraryId, setActiveLibraryId] = useState<number | null>(null);

  const itemHeight = useMemo(() => getItemSuitableHeight(), []);

  const fetchData = useCallback((id: number, relativePath: string) => {
    return fetch({
      url: '/resource/tree',
      params: {
        id,
        path: relativePath,
      },
    });
  }, []);

  async function handleDirClick(path: string) {
    if (!activeLibraryId) return;
    try {
      const { data } = await fetchData(activeLibraryId, `/${path}`);
      setCurrentLayerList(data.list);
    } catch (e) {
      message.error(e.message);
    }
  }

  async function handleLibraryClick(id: number) {
    setActiveLibraryId(id);

    try {
      const { data } = await fetchData(id, '/');
      setShowLibraryList(false);
      setCurrentLayerList(data.list);
    } catch (e) {
      message.error(e.message);
    }
  }

  return (
    <>
      {showLibraryList && <LibraryList onLibraryClick={handleLibraryClick} />}
      {!showLibraryList && currentLayerList.map(item => {
        if (item.type === 'directory') return <div key={item.dirName} className={styles['item-wrap']}><DirItem onDirClick={handleDirClick} itemHeight={itemHeight} directory={item} /></div>;
        if (item.type === 'resource') return <div key={item.resourceInfo.path} className={styles['item-wrap']}><ResourceItem itemWidth={itemHeight} itemHeight={itemHeight} photo={item.resourceInfo} /></div>;
        return null;
      })}
    </>
  );
};

export default LibraryTab;
