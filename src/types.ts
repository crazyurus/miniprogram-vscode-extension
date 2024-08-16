import type { Project } from 'miniprogram-ci';

type IProjectAttr = Awaited<ReturnType<Project['attr']>>;

export interface WebviewMessage<T = any> {
  command: string;
  data: T;
}

export interface ProjectAttributes extends IProjectAttr {
  appid: string;
  appName: string;
  appImageUrl: string;
}
