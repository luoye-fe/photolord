import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import fetch from '@/common/fetch';

export default function BasicLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);

    fetch({
      url: '/setting',
    })
      .then(res => {
        console.log(res.data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });

  }, []);
  return (
    <Spin spinning={loading}>{children}</Spin>
  );
}
