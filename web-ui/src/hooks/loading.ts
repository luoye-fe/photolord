import { useCallback, useContext } from 'react';

import RootContext from '@/store/context';
import { RootReducerActionType } from '@/store/type';

export default function useLoading() {
  const {
    dispatch,
  } = useContext(RootContext);

  const setStoreLoading = useCallback((loading: boolean) => {
    dispatch({
      type: RootReducerActionType.SET_LOADING,
      payload: loading,
    });
  }, []);

  return [setStoreLoading];
}
