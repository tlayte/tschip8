import eventModule = module("chip8/event");

export module chip8{
    export class Timers{
        private _delay: number = 0;
        private _sound: number = 0;
            
        public onWrite = new eventModule.chip8.Event();
        public onStartSound = new eventModule.chip8.Event();
        public onStopSound = new eventModule.chip8.Event();

        tick() {
            if (this._delay > 0) {
                this.delay = this._delay - 1;
            }
            if (this._sound > 0) {
                this.sound = this._sound - 1;
            }
        }

        reset() {
            this.delay = 0;
            this.sound = 0;
        }

        get delay(): number {
            return this._delay;
        }
        set delay(value: number) {
            this._delay = value;
            this.onWrite.raise("delay", value);
        }

        set sound(value: number) {
            if (value > 0 && this._sound === 0) {
                this.onStartSound.raise();
            }
            if (value === 0 && this._sound > 0) {
                this.onStopSound.raise();
            }
            this._sound = value;
            this.onWrite.raise("sound", value);
        }
    }
}