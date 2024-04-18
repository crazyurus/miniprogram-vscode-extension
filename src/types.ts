import type { Project } from 'miniprogram-ci';

type IProjectAttr = Awaited<ReturnType<Project['attr']>>;

export interface WebviewMessage<T = any> {
  command: string;
  data: T;
}

export interface CompileOptions {
  es6: boolean;
  enhance: boolean;
  minified: boolean;
  postcss: boolean;
  minifyWXSS: boolean;
  minifyWXML: boolean;
  uglifyFileName: boolean;
  uploadWithSourceMap: boolean;
  disableUseStrict: boolean;
  compileWorklet: boolean;
}

export interface ProjectAttributes extends IProjectAttr {
  appid: string;
  appName: string;
  appImageUrl: string;
}
