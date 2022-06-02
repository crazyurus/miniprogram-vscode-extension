import Module from '../base';
import CreateCommand from './create';
import CompileCommand from './compile';
import ProjectCommand from './project';
import DocumentCommand from './document';
import StorageCommand from './storage';

class CommandModule extends Module {
  dependencies = [
    CreateCommand,
    CompileCommand,
    ProjectCommand,
    DocumentCommand,
    StorageCommand
  ];
}

export default new CommandModule();
