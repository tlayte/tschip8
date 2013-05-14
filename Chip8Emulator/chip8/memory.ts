import eventModule = module('chip8/event');
var Event = eventModule.chip8.Event;

export module chip8 {
    export class Memory {
        private _memory: number[] = [];

        public onWrite = new Event();

        constructor(public Size: number = 4096) {
            this.reset();
        }

        reset() {
            for (var i = 0; i < this.Size; i++) {
                this._memory[i] = 0;
            }
        }

        write(address: number, value: number) {
            this.checkBounds(address);
            this._memory[address] = value;
            this.onWrite.raise();
        }

        read(address: number): number {
            this.checkBounds(address);
            return this._memory[address];
        }

        load(address: number, data: number[], size: number) {
            this.checkBounds(address);            
            if (size < 0) {
                size = data.length;
            }

            if (address + size > this.Size) {
                throw "Data (" + size + ") would overflow memory(" + this.Size + ")";
            }

            for (var i = 0; i < size; i++){
                this._memory[address + i] = data[i];
            }
        }

        private checkBounds(address: number) {            
            if (address < 0 || address >= this.Size) {
                throw "Address (" + address + ") was out of bounds"
            }
        }
    }
}