import { useCallback, useContext } from 'react';

import locale from '@/locales';
import RootContext from '@/store/context';

export default function useLocale() {
  const {
    state,
  } = useContext(RootContext);

  const getLocaleText = useCallback((key: string) => {
    const _locale = state.setting.locale;
    const options = { language: _locale };
    return locale(key, options);
  }, [state.setting.locale]);

  return [getLocaleText];
}
