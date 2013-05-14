export module chip8 {
    export class Stack {
        private _SP: number;
        private data: number[] = [];

        constructor(public size: number = 16) {
            this.reset();
        }

        reset() {
            this._SP = 0;
        }

        push(value: number) {
            if (this._SP >= this.size) {
                throw "Stack overflow";
            }
            this.data[this._SP++] = value;
        }
        
        pop(): number{
            if (this._SP <= 0) {
                throw "Stack underflow";
            }
            return this.data[--this._SP];
        }

        get SP(): number { return this._SP; }

    }
}
