import React, { useEffect, useRef } from 'react';
import * as trianglify from 'trianglify';
import styles from './index.module.scss';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const pattern = trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      xColors: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
      // xColors: ['#ddd', '#333'],
      variance: 1,
      cellSize: '30',
    });

    pattern.toCanvas(canvasRef.current);
  }, []);
  return (
    <div className={styles['main-bg']}>
      <canvas className={styles['canvas']} ref={canvasRef} />
    </div>
  );
}
