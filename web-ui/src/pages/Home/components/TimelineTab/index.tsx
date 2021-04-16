import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import dayjs from 'dayjs';

import FileItem from '@/components/FileItem';

import fetch from '@/common/fetch';
import { BreadcrumbConfig } from '../ActionBar';

interface PropsType {
  onBreadcrumbChange?: (breadcrumbConfig: BreadcrumbConfig[]) => void;
  onPhotoCountChange?: (count: number) => void;
}

interface DayTitlePropsType {
  day: string;
}

function DayTitle(props: DayTitlePropsType) {
  return (
    <div>
      <p>{props.day}</p>
    </div>
  );
}

const TimelineTab = (props: PropsType) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [photoListByDay, setPhotoListByDay] = useState<{ [key: string]: PhotoInfo[] }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [size] = useState(20);

  function fetchPhotoList() {
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

        console.log(list);

        list.forEach((photo: PhotoInfo) => {
          const day = dayjs(photo.createDate).format('YYYY-MM-DD');

          if (!photoListByDay[day]) photoListByDay[day] = [];
          photoListByDay[day].push(photo);
        });

        setPage(page + 1);
        setHasMore(hasMore);
        setPhotoListByDay(photoListByDay);
        setPageLoading(false);
      })
      .catch(e => {
        message.error(e.message);
        setPageLoading(false);
      });
  }

  useEffect(() => {
    fetchPhotoList();
  }, []);

  return (
    <Spin spinning={pageLoading}>
      {Object.keys(photoListByDay).map(day => (
        <div key={day}>
          <DayTitle day={day} />
          {photoListByDay[day].map(item => <FileItem key={item.id} photo={item} />)}
        </div>
      ))}
    </Spin>
  );
};

export default TimelineTab;
