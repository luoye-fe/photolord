import React, { useMemo, useState, useCallback } from 'react';
import { message, Breadcrumb, Menu } from 'antd';

import LibraryList from '@/components/LibraryList';
import ResourceItem from '@/components/ResourceItem';
import DirItem from '@/components/DirItem';
import fetch from '@/common/fetch';
import { getItemSuitableHeight } from '@/common/util';
import useLocale from '@/hooks/locale';

import styles from './index.module.scss';
import ActionBar, { ActionBarLeft } from '../ActionBar';
import Badge from '../Badge';

type DirTree = {
  dirName: string;
  path: string;
  active: boolean;
}[];

const LibraryTab = () => {
  const [tree, setTree] = useState<DirTree[]>([]);
  const [showLibraryList, setShowLibraryList] = useState(true);
  const [currentLayerList, setCurrentLayerList] = useState<TreeItem[]>([]);
  const [activeLibraryId, setActiveLibraryId] = useState<number | null>(null);

  const itemHeight = useMemo(() => getItemSuitableHeight(), []);

  const [getLocaleText] = useLocale();

  const fetchData = useCallback((id: number, relativePath: string) => {
    return fetch({
      url: '/resource/tree',
      params: {
        id,
        path: relativePath,
      },
    });
  }, []);

  const generateTreeResult = useCallback((targetPath: string, prevTree: DirTree[], nextDir: DirTree) => {
    const treeResult: DirTree[] = [];
    const copiedPrevTree: DirTree[] = JSON.parse(JSON.stringify(prevTree));

    let hasMatchedTreeItem = false;

    for (let i = 0; i < copiedPrevTree.length; i += 1) {
      const item = copiedPrevTree[i];
      if (i === 0) {
        treeResult[0] = item;
      } else {
        treeResult[i] = item.map(j => {
          if (j.path === targetPath) {
            j.active = true;
            hasMatchedTreeItem = true;
          } else if (new RegExp(j.path).test(targetPath)) {
            j.active = true;
          } else {
            j.active = false;
          }
          return j;
        });

        if (hasMatchedTreeItem) {
          treeResult[i + 1] = nextDir;
          break;
        }
      }
    }

    return treeResult;
  }, []);

  function handleBreadcrumbClick(path: string) {
    handleDirClick(path, true);
  }

  async function handleDirClick(path: string, fromBreadcrumb?: boolean) {
    if (!activeLibraryId) return;
    try {
      const requestPath = `/${path}`;
      const { data } = await fetchData(activeLibraryId, requestPath);
      const itemList: TreeItem[] = data.list || [];

      const dirList = (itemList.filter(item => item.type === 'directory') as TreeDirectoryItem[]).map(item => ({
        dirName: item.dirName,
        path: item.path,
        active: false,
      }));

      if (fromBreadcrumb) {
        const treeResult = generateTreeResult(path, tree, dirList);
        setTree(treeResult);
      } else {
        const treeResult = [...tree, dirList].map(i => i.map(j => {
          if (j.path === path) j.active = true;
          return j;
        }));
        setTree(treeResult);
      }

      setCurrentLayerList(itemList);
    } catch (e) {
      message.error(e.message);
    }
  }

  async function handleLibraryClick(libraryInfo: LibraryInfo) {
    const { id } = libraryInfo;
    setActiveLibraryId(id);

    try {
      const { data } = await fetchData(id, '/');
      const itemList: TreeItem[] = data.list || [];

      const dirList = (itemList.filter(item => item.type === 'directory') as TreeDirectoryItem[]).map(item => ({
        dirName: item.dirName,
        path: item.path,
        active: false,
      }));
      setTree([[{ dirName: 'root', path: '', active: true }], dirList]);

      setShowLibraryList(false);
      setCurrentLayerList(data.list);
    } catch (e) {
      message.error(e.message);
    }
  }

  return (
    <>
      {!showLibraryList && (
        <ActionBar>
          <ActionBarLeft>
            <Breadcrumb className={styles.breadcrumb} separator={<span className={styles['breadcrumb-item']}>/</span>}>
              <Breadcrumb.Item className={styles['breadcrumb-item']} onClick={() => setShowLibraryList(true)}>{getLocaleText('common.library')}</Breadcrumb.Item>
              {tree.slice(0, tree.length - 1).map((item, index) => {
                return (
                  <Breadcrumb.Item
                    key={index}
                    className={styles['breadcrumb-item']}
                    onClick={() => handleBreadcrumbClick(item[0].path)}
                    overlay={item.length <= 1 ? undefined : (
                      <Menu selectedKeys={item.filter(i => i.active).map(i => i.path)}>
                        {item.map(j => {
                          return <Menu.Item key={j.path} onClick={() => handleBreadcrumbClick(j.path)}>{j.dirName}</Menu.Item>;
                        })}
                      </Menu>
                    )}>
                    {item.filter(i => i.active)[0]?.dirName}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
            <Badge text={currentLayerList.length} />
          </ActionBarLeft>
        </ActionBar>
      )}
      {showLibraryList && <LibraryList onLibraryClick={handleLibraryClick} />}
      {!showLibraryList && (
        <div className={styles.container}>
          {currentLayerList.map(item => {
            if (item.type === 'directory') return <div key={item.dirName} className={styles['item-wrap']}><DirItem onDirClick={handleDirClick} itemHeight={itemHeight} directory={item} /></div>;
            if (item.type === 'resource') return <div key={item.resourceInfo.path} className={styles['item-wrap']}><ResourceItem itemWidth={itemHeight} itemHeight={itemHeight} photo={item.resourceInfo} /></div>;
            return null;
          })}
        </div>
      )}
    </>
  );
};

export default LibraryTab;
