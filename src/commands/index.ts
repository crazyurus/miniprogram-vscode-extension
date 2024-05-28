import Module from '../base';
import CompileCommand from './compile';
import CreateCommand from './create';
import DocumentCommand from './document';
import ProjectCommand from './project';
import StorageCommand from './storage';

class CommandModule extends Module {
  dependencies = [CreateCommand, CompileCommand, ProjectCommand, DocumentCommand, StorageCommand];
}

export default new CommandModule();
