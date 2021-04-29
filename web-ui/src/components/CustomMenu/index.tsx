import React from 'react';
import classnames from 'classnames';

import styles from './index.module.scss';

interface PropsType {
  children?: React.ReactNode;
}

interface ItemPropsType extends PropsType {
  disable?: boolean;
  onClick?: () => void;
}

const CustomMenu = (props: PropsType) => {
  const { children } = props;
  return (
    <div className={styles['menu']}>
      {children}
    </div>
  );
};

const CustomMenuItem = (props: ItemPropsType) => {
  const { children, disable, onClick } = props;

  function handleClick() {
    onClick && onClick();
  }

  return (
    <div onClick={handleClick} className={classnames([styles['menu-item']], {
      [styles['menu-item-disable']]: disable,
    })}>
      {children}
    </div>
  );
};

export { CustomMenuItem };
export default CustomMenu;
