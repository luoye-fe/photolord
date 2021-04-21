import React from 'react';
import { RootReducerAction, RootStateType } from './type';

export const initState: RootStateType = {
  loading: true,
  setting: {
    locale: 'en',
  },
};

type ContextType = {
  state: RootStateType;
  dispatch: (action: RootReducerAction) => void;
};

export default React.createContext<ContextType>({
  state: initState,
  dispatch: () => null,
});
