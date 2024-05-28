import fs from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';

import type { CompileOptions } from '../types';
import { readJSON } from './json';
import { getCurrentFolderPath, getMiniProgramRootPath, getProjectConfigPath } from './path';

interface AppConfig {
  pages: string[];
}

interface ProjectConfig {
  appid: string;
  projectname: string;
  libVersion: string;
  miniprogramRoot?: string;
  compileType?: 'miniprogram' | 'plugin';
  setting: CompileOptions;
  ignoreUploadUnusedFiles: boolean;
}

interface Project {
  appid: string;
  type: 'miniProgram' | 'miniProgramPlugin';
  projectPath: string;
  ignores: string[];
  privateKey?: string;
}

function getAppConfigPath(miniprogramPath?: string): string {
  if (!miniprogramPath) {
    const rootPath = getCurrentFolderPath();
    const projectConfig = readProjectConfig();

    miniprogramPath = getMiniProgramRootPath(rootPath, projectConfig.miniprogramRoot);
  }

  return path.join(miniprogramPath, 'app.json');
}

function readAppConfig(miniprogramPath: string): AppConfig | null {
  const appFilePath = getAppConfigPath(miniprogramPath);

  return appFilePath ? readJSON<AppConfig>(appFilePath) : null;
}

function readProjectConfig(): ProjectConfig {
  const rootPath = getCurrentFolderPath();
  const projectFilePath = getProjectConfigPath(rootPath);

  if (fs.existsSync(projectFilePath)) {
    const config = readJSON<ProjectConfig>(projectFilePath);

    if (config) {
      config.projectname = decodeURIComponent(config.projectname);

      return config;
    }

    throw new Error('project.config.json 文件解析失败');
  }

  throw new Error('未找到 project.config.json 文件');
}

async function createProject(context: vscode.ExtensionContext): Promise<Project> {
  const privateKey = context.workspaceState.get('privateKey') as string;
  const rootPath = getCurrentFolderPath();
  const projectConfig = readProjectConfig();
  const options = {
    appid: projectConfig.appid,
    type: (projectConfig.compileType === 'miniprogram' ? 'miniProgram' : 'miniProgramPlugin') as Project['type'],
    projectPath: getMiniProgramRootPath(rootPath, projectConfig.miniprogramRoot),
    ignores: ['node_modules/**/*']
  };

  if (privateKey) {
    return {
      ...options,
      privateKey
    };
  }

  const action = await vscode.window.showInformationMessage(
    '请选择代码上传密钥文件，代码上传密钥可以在微信小程序后台“开发”-“开发设置”功能生成并下载，并关闭 IP 白名单',
    {
      modal: true
    },
    '选择密钥文件',
    '查看详细说明'
  );

  switch (action) {
  case '选择密钥文件':
    const result = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: {
        代码上传密钥文件: ['key']
      },
      openLabel: '选择'
    });
    if (Array.isArray(result)) {
      const keyFile = result[0].fsPath;
      const key = await fs.promises.readFile(keyFile, 'utf-8');
      context.workspaceState.update('privateKey', key);

      return {
        ...options,
        privateKey: key
      };
    }
    break;
  case '查看详细说明':
    vscode.env.openExternal(vscode.Uri.parse('https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html'));
    break;
  }

  return Promise.reject();
}

export { getAppConfigPath, readAppConfig, readProjectConfig, createProject };
