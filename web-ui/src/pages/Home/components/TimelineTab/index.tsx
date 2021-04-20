import React, { useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

import FileItem from '@/components/FileItem';
import ListTitle from '@/components/ListTitle';
import fetch from '@/common/fetch';

import RootContext from '@/store/context';

import LoadingMore from '../LoadingMore';

interface PropsType {
  onBreadcrumbChange?: (breadcrumbConfig: BreadcrumbConfig[]) => void;
  onPhotoCountChange?: (count: number) => void;
}

const TimelineTab = (props: PropsType) => {
  const size = 50;
  const scrollableTarget = document.getElementById('main-container');
  const [loading, setLoading] = useState(false);
  const [photoListByDay, setPhotoListByDay] = useState<{ [key: string]: PhotoInfo[] }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasLoadCount, setHasLoadCount] = useState(0);

  const {
    dispatch,
  } = useContext(RootContext);

  function fetchPhotoList() {
    if (loading) return;

    setLoading(true);
    if (page === 1) {
      dispatch({
        type: 'loading',
        payload: true,
      });
    }

    fetch({
      url: '/resource/list',
      params: {
        page,
        size,
      },
    })
      .then(res => {
        const { list = [], hasMore } = res.data;
        list.forEach((photo: PhotoInfo) => {
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
          type: 'loading',
          payload: false,
        });
      })
      .catch(e => {
        message.error(e.message);
        setLoading(false);

        dispatch({
          type: 'loading',
          payload: false,
        });
      });
  }

  useEffect(() => {
    fetchPhotoList();
  }, []);

  return (
    <InfiniteScroll
      dataLength={hasLoadCount}
      next={fetchPhotoList}
      hasMore={hasMore}
      loader={<LoadingMore />}
      scrollableTarget={scrollableTarget}>
      {Object.keys(photoListByDay).map(day => (
        <div key={day}>
          <ListTitle text={day} />
          {photoListByDay[day].map(item => <FileItem key={item.id} photo={item} />)}
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default TimelineTab;
