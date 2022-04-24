import ejs from 'ejs';
import * as path from 'path';

function render(template: string, data: Record<string, unknown>): Promise<string> {
  return ejs.renderFile(path.join(__dirname, '..', '..', 'html', template + '.ejs'), data);
}

export default render;
