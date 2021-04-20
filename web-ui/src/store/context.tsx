import React  from 'react';

interface ContextType {
  state: RootStateType;
  dispatch: React.Dispatch<RootReducerType>;
}

export const initState = {
  loading: true,
};

export default React.createContext({
  state: initState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
} as ContextType);
