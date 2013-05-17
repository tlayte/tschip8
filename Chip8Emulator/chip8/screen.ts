import eventModule = module("chip8/event");

export module chip8{
    export class Screen{
        private _pixels: number[];

        public onDraw = new eventModule.chip8.Event();
        public onClear = new eventModule.chip8.Event();

        constructor(public width: number = 64, public height: number = 32) {
            this.clear();
        }

        clear() {
            this._pixels = [];
            for (var i = 0; i < this.width * this.height; i++) {
                this._pixels[i] = 0;
            }
            this.onClear.raise();
        }

        draw(x: number, y: number, data: number[]): number {
            var minX = this.width;
            var minY = this.height;
            var maxX = 0;
            var maxY = 0;
            var collision = 0;
            for (var sourceY = 0; sourceY < data.length; sourceY++){
                var line = data[sourceY];
                for (var sourceX = 7; sourceX >=0; sourceX--){
                    var value = line & 0x1;
                    var result = this.setPixel(x + sourceX, y + sourceY, value);
                    if (result === 0) {
                        collision = 1;
                    }
                    line >>= 1;
                }
            }
            this.onDraw.raise();
            return collision;
        }

        private setPixel(x: number, y: number, value: number): number {
            if (value === 0) {
                return -1;
            }
            while (x >= this.width) {
                x -= this.width;
            }

            while (y >= this.height) {
                y -= this.height;
            }
            var addr = x + y * this.width;
            
            return this._pixels[addr] ^= value;
        }

        getPixels(): number[]{
            return this._pixels.slice(0);
        }
    }
}