import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

import ResourceItem from '@/components/ResourceItem';
import ListTitle from '@/components/ListTitle';
import fetch from '@/common/fetch';
import { getItemSuitableHeight } from '@/common/util';

import RootContext from '@/store/context';
import { RootReducerActionType } from '@/store/type';

import LoadingMore from '../LoadingMore';

interface PropsType {
  onBreadcrumbChange?: (breadcrumbConfig: BreadcrumbConfig[]) => void;
  onPhotoCountChange?: (count: number) => void;
}

const TimelineTab = (props: PropsType) => {
  const size = 50;
  const [loading, setLoading] = useState(false);
  const [photoListByDay, setPhotoListByDay] = useState<{ [key: string]: IResourceInfo[] }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasLoadCount, setHasLoadCount] = useState(0);
  const [scrollableTarget, setScrollableTarget] = useState<HTMLElement | null>(null);

  const itemHeight = useMemo(() => getItemSuitableHeight(), []);

  const {
    dispatch,
  } = useContext(RootContext);

  function fetchPhotoList() {
    if (loading) return;

    setLoading(true);

    // page loading
    if (page === 1) {
      dispatch({
        type: RootReducerActionType.SET_LOADING,
        payload: true,
      });
    }

    fetch({
      url: '/resource/timeline',
      params: {
        page,
        size,
      },
    })
      .then(res => {
        const { list = [], hasMore } = res.data;
        list.forEach((photo: IResourceInfo) => {
          const day = dayjs(photo.createDate).format('YYYY-MM-DD');
          if (!photoListByDay[day]) photoListByDay[day] = [];
          photoListByDay[day].push(photo);
        });

        setPage(page + 1);
        setHasLoadCount(hasLoadCount + list.length);
        setHasMore(hasMore);
        setPhotoListByDay(photoListByDay);
        setLoading(false);

        dispatch({
          type: RootReducerActionType.SET_LOADING,
          payload: false,
        });
      })
      .catch(e => {
        message.error(e.message);
        setLoading(false);

        dispatch({
          type: RootReducerActionType.SET_LOADING,
          payload: false,
        });
      });
  }

  useEffect(() => {
    fetchPhotoList();
    setScrollableTarget(document.getElementById('main-container'));
  }, []);

  return scrollableTarget && (
    <InfiniteScroll
      dataLength={hasLoadCount}
      next={fetchPhotoList}
      hasMore={hasMore}
      loader={<LoadingMore />}
      scrollableTarget={scrollableTarget}>
      {Object.keys(photoListByDay).map(day => (
        <div key={day}>
          <ListTitle text={day} />
          {photoListByDay[day].map(item => <ResourceItem key={item.id} photo={item} itemHeight={itemHeight} />)}
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default TimelineTab;
