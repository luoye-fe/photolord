interface IPlainObject {
  [key: string]: any;
}

interface PhotoInfo {
  id: number;
  libraryId: number;
  createDate: string;
  modifyDate: string;
  format: string;
  size: number;
  width: number;
  height: number;
  name: string;
  path: string;
  md5: string;
}

interface LibraryInfo {
  id: number;
  path: string;
  comment: string;
  analyseIng: 0 | 1;
}

interface BreadcrumbConfig {
  text: string;
  menu?: BreadcrumbConfig[];
}

interface RootStateType {
  loading: boolean;
}

interface RootReducerType {
  type: 'loading';
  payload?: any;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
