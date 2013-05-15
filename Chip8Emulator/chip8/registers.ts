import memModule = module("chip8/memory");

export module chip8 {
    export class Registers extends memModule.chip8.Memory {
        private _PC: number;
        private _I: number;


        constructor() {
            super(16);
        }

        reset() {
            super.reset();
            this.PC = 0x200;
            this.I = 0;
        }

        read(address: any): number {
            if (typeof address == "string") {
                return this["_" + address];
            }
            return super.read(address);
        }

        write(address: any, value: number) {
            if (typeof address == "string") {
                this["_" + address] = value;
                this.onWrite.raise(address, value);
            } else {
                super.write(address, value);
            }            
        }

        get v0(): number {
            return this.read(0);
        }

        get v1(): number {
            return this.read(1);
        }

        get v2(): number {
            return this.read(2);
        }
        get v3(): number {
            return this.read(3);
        }

        get v4(): number {
            return this.read(4);
        }

        get v5(): number {
            return this.read(5);
        }

        get v6(): number {
            return this.read(6);
        }

        get v7(): number {
            return this.read(7);
        }
        
        get v8(): number {
            return this.read(8);
        }

        get v9(): number {
            return this.read(9);
        }

        get vA(): number {
            return this.read(10);
        }

        get vB(): number {
            return this.read(11);
        }

        get vC(): number {
            return this.read(12);
        }

        get vD(): number {
            return this.read(13);
        }

        get vE(): number {
            return this.read(14);
        }

        get vF(): number {
            return this.read(15);
        }

        set v0(value: number) {
            this.write(0, value);
        }

        set v1(value: number) {
            this.write(1, value);
        }

        set v2(value: number) {
            this.write(2, value);
        }
        set v3(value: number) {
            this.write(3, value);
        }

        set v4(value: number) {
            this.write(4, value);
        }

        set v5(value: number) {
            this.write(5, value);
        }

        set v6(value: number) {
            this.write(6, value);
        }

        set v7(value: number) {
            this.write(7, value);
        }

        set v8(value: number) {
            this.write(8, value);
        }

        set v9(value: number) {
            this.write(9, value);
        }

        set vA(value: number) {
            this.write(10, value);
        }

        set vB(value: number) {
            this.write(11, value);
        }

        set vC(value: number) {
            this.write(12, value);
        }

        set vD(value: number) {
            this.write(13, value);
        }

        set vE(value: number) {
            this.write(14, value);
        }

        set vF(value: number) {
            this.write(15, value);
        }

        get PC(): number {
            return this.read("PC");
        }

        set PC(value: number) {
            this.write("PC", value);
        }

        get I(): number {
            return this.read("I");
        }

        set I(value: number) {
            this.write("I", value);
        }
    }
}