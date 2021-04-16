import React from 'react';
import { Spin, SpinProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface PropsType extends SpinProps {
  children?: React.ReactChild;
}

export default function Loading(props: PropsType) {
  return <Spin
    indicator={antIcon}
    {...props}
  >{props.children}</Spin>;
}
