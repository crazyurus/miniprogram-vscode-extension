import Command from '../base';
import AnalyzeCommand from './analyze';
import ArtifactCommand from './artifact';
import CompileDirectoryCommand from './directory';
import NPMCommand from './npm';
import PreviewCommand from './preview';
import QualityCommand from './quality';
import SourceMapCommand from './sourcemap';
import UploadCommand from './upload';

class CompileCommand extends Command {
  dependencies = [
    AnalyzeCommand,
    CompileDirectoryCommand,
    NPMCommand,
    PreviewCommand,
    UploadCommand,
    ArtifactCommand,
    SourceMapCommand,
    QualityCommand
  ];
}

export default new CompileCommand();
