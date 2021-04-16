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

interface BreadcrumbConfig {
  text: string;
  menu?: BreadcrumbConfig[];
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
