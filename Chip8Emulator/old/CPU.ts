/// <reference path="../.typings/knockout.d.ts" />
import ev = module("old/Events");

export class Cpu {

    public memory: number[] = [];
    public registers: number[] = [];
    public keys: bool[] = [];
    public I: number;
    public PC: number;
    public stack: number[] = [];
    public SP: number;
    public delay: number;
    public sound: number;

    public debug_registers = ko.observableArray();
    public debug_pc = ko.observable();
    public debug_i = ko.observable();
    public debug_sp = ko.observable();
    public debug_stack = ko.observable();
    public debug_next = ko.observable();

    public ClearScreen: ev.Event = new ev.Event();
    public DrawSprite: ev.Event = new ev.Event();
    public onWrite: ev.Event = new ev.Event();
    public onRegisterChange: ev.Event = new ev.Event();
    public onHalt: ev.Event = new ev.Event();
    public stopSound: ev.Event = new ev.Event();
    public startSound: ev.Event = new ev.Event();

    private instructions: { (data: number): void; }[] = [];
    private instructions8: { (x: number, y: number): void; }[] = [];
    private instructionsF: { (data: number): void; }[] = [];

    constructor() {
        this.loadInstructions();
        this.reset();
    }

    reset() {
        zeroArray(this.registers, 16);
        zeroArray(this.memory, 4096);
        zeroArray(this.stack, 16);
        fillArray(this.keys, 16, false);
        this.I = 0;
        this.PC = 0x200;
        this.SP = 0;
        this.delay = 0;
        this.sound = 0;
        this.updateDebug();
        this.stopSound.raise();
    }

    cycle() {
        var opcode = this.readOpcode();
        var MSN = getNibble1(opcode);
        this.instructions[MSN](opcode & 0xFFF);

        this.updateDebug();        
    }

    tick() {
        if (this.delay > 0) {
            this.delay--;
        }
        if (this.sound > 0) {
            this.sound--;
        } else {
            this.stopSound.raise();
        }
    }

    private loadInstructions() {
        this.instructions[0] = function (data) => {
            switch (data) {
                case 0x0e0:
                    this.ClearScreen.raise();
                    break;
                case 0x0ee:
                    this.PC = this.pop();
                    break;
                default:
                    //RCA 1802
                    this.onHalt.raise(data);
                    console.log("Not implemented");
                
            }
        }

        //1NNN - jump
        this.instructions[1] = (data) => {
            this.PC = data;
        }

        //2NNN - call subroutine
        this.instructions[2] = (data) => {
            this.push(this.PC);
            this.PC = data;
        }

        //3XNN skip if vX == NN
        this.instructions[3] = (data) => {
            var register = this.registers[getNibble2(data)];
            if (register === (data & 0xFF)) {
                this.moveNext();
            }
        }

        //4XNN - skip if vX != NN
        this.instructions[4] = (data) => {
            var register = this.registers[getNibble2(data)];
            if (register !== (data & 0xFF)) {
                this.moveNext();
            }
        }

        //5XY0 - skip if vX == vY
        this.instructions[5] = (data) => {
            var register1 = this.registers[getNibble2(data)];
            var register2 = this.registers[getNibble3(data)];
            if (register1 === register2) {
                this.moveNext();
            }
        }

        //6XNN - set vX to NN
        this.instructions[6] = (data) => {
            var register = getNibble2(data);
            this.registers[register] = (data & 0xFF);
        }

        //7XNN add NN to vX
        this.instructions[7] = (data) => {
            var register = getNibble2(data);
            this.registers[register] += (data & 0xFF);
        }

        this.instructions[8] = (data) => {
            var nibbles = toNibbles(data);
            this.instructions8[nibbles[3]](nibbles[1], nibbles[2]);
        }

        //8XY0 - set vx to vy
        this.instructions8[0x0] = (x, y) => {
            this.registers[x] = this.registers[y];
        }
        //8XY1 - set vx to vx | vy
        this.instructions8[0x1] = (x, y) => {
            this.registers[x] |= this.registers[y];
        }
        //8XY2 - set vx to vx & vy
        this.instructions8[0x2] = (x, y) => {
            this.registers[x] &= this.registers[y];
        }
        //8XY3 - set vx to vx XOR vy
        this.instructions8[0x3] = (x, y) => {
            this.registers[x] ^= this.registers[y];
        }
        //8XY4 - add vy to vx, set vf to 1 if carry
        this.instructions8[0x4] = (x, y) => {
            var result = this.registers[x] + this.registers[y];
            this.registers[0xf] = result & 0x10000;
            this.registers[x] = result & 0xFFFF;
        }
        //8XY5 - subtract vy from vx. vf = 0 if borrow, 1 if not
        this.instructions8[0x5] = (x, y) => {
            var result = this.registers[x] - this.registers[y];
            if (result < 0) {
                result += 0x10000;
                this.registers[0xf] = 1;
            } else {
                this.registers[0xf] = 0;
            }
            this.registers[x] = result;
        }
        //8XY6 - shift vx right by 1, roll LSB into vf
        this.instructions8[0x6] = (x, y) => {
            this.registers[0xf] = this.registers[x] & 0x1;
            this.registers[x] >>= 1;
        }
        //8XY7 - set vx to vy minus vx. vf=0 if borrow, 1 if not
        this.instructions8[0x7] = (x, y) => {
            var result = this.registers[y] - this.registers[x];
            if (result < 0) {
                result += 0x10000;
                this.registers[0xf] = 1;
            } else {
                this.registers[0xf] = 0;
            }
            this.registers[x] = result;
        }
        //8XYE - shift vx left by 1. roll MSB into vf
        this.instructions8[0xE] = (x, y) => {
            this.registers[0xf] = (this.registers[x] >> 0xf) & 0x1;
            this.registers[x] <<= 1;
        }

        //9XY0 - skip if vX != vY
        this.instructions[9] = (data) => {
            if (this.registers[getNibble2(data)] !== this.registers[getNibble3(data)]) {
                this.moveNext();
            }
        }

        //ANNN - set I to NNN
        this.instructions[0xA] = (data) => {
            this.I = data & 0xFFF;
        }

        //BNNN - jump to NNN + v0
        this.instructions[0xB] = (data) => {
            this.PC = this.registers[0] + (data & 0xFFF);
        }

        //CXNN - set vX to a random number AND NN
        this.instructions[0xC] = (data) => {
            var random = Math.random() * 0xFFFF;
            this.registers[getNibble2(data)] = random & 0xFF;
        }

        //DXYN - draw sprite of size (8 by N) at screen position vX, vY
        //sprite is XORed. vF set to 1 if any pixel is toggled off
        this.instructions[0xD] = (data) => {
            var nibbles = toNibbles(data);
            var x = this.registers[nibbles[1]];
            var y = this.registers[nibbles[2]];
            var height = nibbles[3];
        }

        //EX9E - Skip if key X is pressed
        //EXA1 - Skip if key X is not pressed
        this.instructions[0xE] = (data) => {
            var x = getNibble2(data);
            switch (data & 0xff) {
                case 0x9e:
                    if (this.keys[x]) {
                        this.moveNext();
                    }
                    break;
                case 0xa1:
                    if (!this.keys[x]) {
                        this.moveNext();
                    }
                    break;
            }
        }

        this.instructions[0xF] = (data) => {
            var subcode = data & 0xff;
            this.instructionsF[subcode](getNibble2(data));
        }

        //FX07 - read delay timer into vX
        this.instructionsF[0x07] = (x) => {
            this.registers[x] = this.delay;
        }

        //FX07 - wait for key, store value in vX
        this.instructionsF[0x0A] = (x) => {
            //TODO: implement
            throw "FX07 not implemented";
        }

        //FX07 - set delay timer to vX
        this.instructionsF[0x15] = (x) => {
            this.delay = this.registers[x];
        }

        //FX07 - set sound timer to vX
        this.instructionsF[0x18] = (x) => {
            this.sound = this.registers[x];
            if (this.sound > 0) {
                this.startSound.raise();
            }
        }

        //FX07 - add vX to I
        this.instructionsF[0x1e] = (x) => {
            this.I += this.registers[x];
        }

        //FX07 - load font sprite vX into I
        this.instructionsF[0x29] = (x) => {
            //set i to font sprite vX
        }

        //FX07 - 
        this.instructionsF[0x33] = (x) => {
            //store BCD of vX in I
            //MSD at i[0], LSD at i[2]
        }

        //FX07 - store registers 0 to X at address in I
        this.instructionsF[0x55] = (x) => {
            var end = this.I + x;
            for (var y = 0; this.I <= end ; y++, this.I++) {
                this.write(this.I, this.registers[y]);
            }
        }

        //FX07 - read registers 0 to X from address in I
        this.instructionsF[0x65] = (x) => {
            var end = this.I + x;
            for (var y = 0; this.I <= end ; y++, this.I++) {
                this.registers[y] = this.read(this.I);
            }
        }
    }

    private pop(): number {
        if (this.SP === 0) {
            throw "Stack underflow";
        }
        return this.stack[--this.SP];
    }

    private push(value: number) {
        if (this.SP === 16) {
            throw "Stack overflow";
        }
        this.stack[this.SP++] = value;
    }

    private readOpcode(): number {
        var opcode = (this.read(this.PC) << 8) | this.read(this.PC+1);
        this.moveNext();
        return opcode;
    }

    private moveNext() {
        this.PC += 2;
    }

    private read(address: number): number {
        if (address > 4095) {
            throw "Address (" + address + ") is out of range"
        }
        return this.memory[address];
    }

    private write(address: number, value: number) {
        if (address > 4095) {
            throw "Address (" + address + ") is out of range"
        }
        this.memory[address] = value;
    }

    private updateDebug() {
        this.debug_registers(this.registers.map((value, index) => {
            return {
                index: index.toString(16).toUpperCase(),
                value: value.toString(16).toUpperCase()
            }
        }));
        this.debug_i(this.I.toString(16).toUpperCase());
        this.debug_pc(this.PC.toString(16).toUpperCase());
        this.debug_sp(this.SP.toString(16).toUpperCase());
        this.debug_next(displayByte(this.memory[this.PC]) + displayByte(this.memory[this.PC + 1]));
    }
}

export function displayByte(byte: number): string {
    return ("00" + byte.toString(16).toUpperCase()).substr(-2);
}

function getNibble1(opcode: number): number {
    return (opcode & 0xf000) >> 12;
}

function getNibble2(opcode: number): number {
    return (opcode & 0x0f00) >> 8;
}

function getNibble3(opcode: number): number {
    return (opcode & 0x00f0) >> 4;
}

function getNibble4(opcode: number): number {
    return (opcode & 0x000f);
}

function toNibbles(opcode: number): number[] {
    var nibbles = [];
    nibbles[3] = opcode & 0xf;
    opcode >>= 4;
    nibbles[2] = opcode & 0xf;
    opcode >>= 4;
    nibbles[1] = opcode & 0xf;
    opcode >>= 4;
    nibbles[0] = opcode & 0xf;
    return nibbles;
}



function fillArray(array: any[], size: number, value: any) {
    for (var i = 0; i < size; i++) {
        array[i] = value;
    }
}

function zeroArray(array: number[], size: number) {
    fillArray(array, size, 0);
}