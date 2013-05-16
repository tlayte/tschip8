import eventModule = module("chip8/event");

export module chip8 {
    export class Stack {
        public onWrite = new eventModule.chip8.Event();

        private _SP: number;
        private data: number[] = [];

        constructor(public size: number = 16) {
            this.reset();
        }

        reset() {
            this._SP = 0;
            this.onWrite.raise(0, null);
        }

        push(value: number) {
            if (this._SP >= this.size) {
                throw "Stack overflow";
            }
            this.data[this._SP++] = value;
            this.onWrite.raise(this._SP, value);
        }
        
        pop(): number{
            if (this._SP <= 0) {
                throw "Stack underflow";
            }
            var data = this.data[--this._SP];
            this.onWrite.raise(this._SP, data);
            return data;
        }

        get SP(): number { return this._SP; }

    }
}
