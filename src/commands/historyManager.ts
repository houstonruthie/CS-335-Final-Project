export interface Command {
    undo(): void;
    redo(): void;
}

export class HistoryManager {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    push(command: Command): void {
        this.undoStack.push(command);
        this.redoStack = [];
    }

    undo() {
        alert("UNDO STACK SIZE:" + String(this.undoStack.length));

        const command = this.undoStack.pop();
        if (!command) {
            alert("NO COMMAND TO UNDO");
            return;
        }

        alert("UNDOING COMMAND");
        command.undo();

        this.redoStack.push(command);
    }

    redo(): void {
        alert("REDO STACK SIZE:" + String(this.redoStack.length));

        const cmd = this.redoStack.pop();
        if (!cmd) return;

        alert("REDOING COMMAND");
        cmd.redo();
        this.undoStack.push(cmd);
    }
    execute(command: Command) {
        this.undoStack.push(command);
        this.redoStack = [];
    }
}