import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';

import fetch from '@/common/fetch';
import { BreadcrumbConfig } from '../ActionBar';

interface PropsType {
  onBreadcrumbChange?: (breadcrumbConfig: BreadcrumbConfig[]) => void;
  onPhotoCountChange?: (count: number) => void;
}

const TimelineTab = (props: PropsType) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(5);

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
        console.log(res.data);
        setPage(page + 1);
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
    <Spin spinning={pageLoading}>TimelineTab</Spin>
  );
};

export default TimelineTab;
