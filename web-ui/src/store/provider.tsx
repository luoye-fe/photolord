import React, { useReducer } from 'react';
import HomeContext, { initState } from './context';
import Reducer from './reducer';

interface PropsType {
  children: React.ReactChild;
}

export default function Provider(props: PropsType) {
  const { children } = props;
  const [state, dispatch] = useReducer(Reducer, initState);
  return (
    <HomeContext.Provider value={{ dispatch, state }}>
      {children}
    </HomeContext.Provider>
  );
}
