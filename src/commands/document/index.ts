import Command from '../base';
import OpenDocumentCommand from './open';
import SearchDocumentCommand from './search';
import ManagementCommand from './management';

class DocumentCommand extends Command {
  dependencies = [
    OpenDocumentCommand,
    SearchDocumentCommand,
    ManagementCommand
  ];
}

export default new DocumentCommand();
