import Command from '../base';
import AnalyseCodeCommand from './analyse';
import CompileDirectoryCommand  from './directory';
import NPMCommand from './npm';
import PreviewCommand from './preview';
import UploadCommand from './upload';
import ArtifactCommand from './artifact';
import SourceMapCommand from './sourcemap';

class CompileCommand extends Command {
  dependencies = [
    AnalyseCodeCommand,
    CompileDirectoryCommand,
    NPMCommand,
    PreviewCommand,
    UploadCommand,
    ArtifactCommand,
    SourceMapCommand
  ];
}

export default new CompileCommand();
