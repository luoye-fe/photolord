import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

import Spin from '@/components/Loading';
import FileItem from '@/components/FileItem';
import ListTitle from '@/components/ListTitle';
import fetch from '@/common/fetch';
import LoadingMore from '../LoadingMore';

interface PropsType {
  onBreadcrumbChange?: (breadcrumbConfig: BreadcrumbConfig[]) => void;
  onPhotoCountChange?: (count: number) => void;
}

const TimelineTab = (props: PropsType) => {
  const size = 50;
  const scrollableTarget = document.getElementById('main-container');
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoListByDay, setPhotoListByDay] = useState<{ [key: string]: PhotoInfo[] }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasLoadCount, setHasLoadCount] = useState(0);

  function fetchPhotoList() {
    if (loading) return;

    setLoading(true);
    if (page === 1) setPageLoading(true);

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
        setPageLoading(false);
        setLoading(false);
      })
      .catch(e => {
        message.error(e.message);
        setPageLoading(false);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchPhotoList();
  }, []);

  return (
    <Spin spinning={pageLoading}>
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
    </Spin>
  );
};

export default TimelineTab;
