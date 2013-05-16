import eventModule = module("chip8/event");

export module chip8{
    export class Keypad{
        public onKeyDown = new eventModule.chip8.Event();

        read(key: number): number {
            return undefined;
        }
    }
}