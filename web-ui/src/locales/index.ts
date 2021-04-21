import { get as lodashGet } from 'lodash';

import en from './en';
import zh from './zh';

const languageMap = {
  en,
  zh,
};

export default function locale(key: string, options?: {
  language?: 'en' | 'zh';
  uppercase?: 'all' | 'first' | 'none';
}) {
  const { language = 'en', uppercase = 'none'} = options || {};
  const origin:string  = lodashGet(languageMap[language], key);
  if (uppercase === 'all') return origin.toUpperCase();
  if (uppercase === 'first') return `${origin.charAt(0).toUpperCase()}${origin.slice(1)}`;
  return origin;
}
