import React from 'react';
import styles from './index.module.scss';

interface PropsType {
  children?: React.ReactNode;
}

const ActionBar = (props: PropsType) => {
  const { children } = props;
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

const ActionBarLeft = (props: PropsType) => {
  const { children } = props;
  return (
    <div className={styles.left}>
      {children}
    </div>
  );
};

const ActionBarRight = (props: PropsType) => {
  const { children } = props;
  return (
    <div className={styles.right}>
      {children}
    </div>
  );
};

export { ActionBarLeft, ActionBarRight };
export default ActionBar;
