import { get as lodashGet } from 'lodash';

import en from './en';
import zh from './zh';

const languageMap = {
  en,
  zh,
};

export default function locale(key: string, language: 'en' | 'zh' = 'en') {
  return lodashGet(languageMap[language], key);
}
