import React from 'react';
import styles from './index.module.scss';

interface PropsType {
  text?: string | number;
}

const Badge = (props: PropsType) => {
  const { text } = props;
  return <div className={styles.badge}>{text}</div>;
};

export default Badge;
