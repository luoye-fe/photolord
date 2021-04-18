import React, { useEffect, useRef, useCallback } from 'react';
import * as trianglify from 'trianglify';
import debounce from 'lodash/debounce';
import styles from './index.module.scss';

export default function Background() {
  const canvasRef = useRef(null);

  const setBg = useCallback(() => {
    const pattern = trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      // xColors: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
      xColors: ['#999', '#333'],
      variance: 1,
      cellSize: '60',
    });

    pattern.toCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    setBg();

    window.addEventListener('resize', debounce(setBg, 300), true);
  }, []);
  return (
    <div className={styles['main-bg']}>
      <canvas className={styles['canvas']} ref={canvasRef} />
    </div>
  );
}
