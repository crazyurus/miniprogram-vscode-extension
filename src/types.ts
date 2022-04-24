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
}
