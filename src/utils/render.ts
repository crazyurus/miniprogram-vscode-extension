import path from 'node:path';
import ejs from 'ejs';

function render(template: string, data: Record<string, unknown>): Promise<string> {
  return ejs.renderFile(path.join(__dirname, '..', '..', 'html', template + '.ejs'), data);
}

export default render;
