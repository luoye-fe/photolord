import React from 'react';

import Main from './main';
import RootProvider from '@/store/provider';

export default function Home() {
  return (
    <RootProvider>
      <Main />
    </RootProvider>
  );
}
