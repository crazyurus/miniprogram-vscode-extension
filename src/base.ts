import * as vscode from 'vscode';

class Module {
  protected dependencies?: Module[];

  activate(context: vscode.ExtensionContext): void {
    if (this.dependencies) {
      this.dependencies.forEach(module => {
        module.activate && module.activate(context);
      });
    }
  }

  deactivate(): void {
    if (this.dependencies) {
      this.dependencies.forEach(module => {
        module.deactivate && module.deactivate();
      });
    }
  }
}

export default Module;
