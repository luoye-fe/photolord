import React from 'react';
import Background from '@/components/Background';

export default function BasicLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
      <Background />
      {children}
    </>
  );
}
