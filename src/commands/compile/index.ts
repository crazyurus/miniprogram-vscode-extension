import Command from '../base';
import AnalyzeCommand from './analyze';
import CompileDirectoryCommand from './directory';
import NPMCommand from './npm';
import PreviewCommand from './preview';
import UploadCommand from './upload';
import ArtifactCommand from './artifact';
import SourceMapCommand from './sourcemap';
import QualityCommand from './quality';

class CompileCommand extends Command {
  dependencies = [
    AnalyzeCommand,
    CompileDirectoryCommand,
    NPMCommand,
    PreviewCommand,
    UploadCommand,
    ArtifactCommand,
    SourceMapCommand,
    QualityCommand,
  ];
}

export default new CompileCommand();
