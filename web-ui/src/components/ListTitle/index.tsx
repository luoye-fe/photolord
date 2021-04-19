import React from 'react';
import styles from './index.module.scss';

interface PropsType {
  text: string;
}

export default function ListTitle(props: PropsType) {
  const { text } = props;
  return (
    <div className={styles['day-title']}>
      <p className={styles['day-title-text']}>{text}</p>
    </div>
  );
}
