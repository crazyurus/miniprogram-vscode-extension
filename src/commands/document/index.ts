import Command from '../base';
import ManagementCommand from './management';
import OpenDocumentCommand from './open';
import SearchDocumentCommand from './search';

class DocumentCommand extends Command {
  dependencies = [OpenDocumentCommand, SearchDocumentCommand, ManagementCommand];
}

export default new DocumentCommand();
