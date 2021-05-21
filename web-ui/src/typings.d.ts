interface IPlainObject {
  [key: string]: any;
}

interface IResourceInfo {
  id: number;
  libraryId: number;
  md5: string;
  path: string;
  name: string;
  format: string;
  width: number;
  height: number;
  size: number;
  createDate: Date;
  modifyDate: Date;
}

interface IResourceDetail {
  id: number;
  libraryId: number;
  md5: string;
  path: string;
  name: string;
  format: string;
  width: number;
  height: number;
  size: number;
  createDate: Date;
  modifyDate: Date;
}

type TreeResourceItem = {
  type: 'resource';
  resourceInfo: IResourceInfo;
};

type TreeDirectoryItem = {
  type: 'directory';
  dirName: string;
  path: string;
  preview: IResourceInfo[];
};

type TreeItem = TreeResourceItem | TreeDirectoryItem;

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
