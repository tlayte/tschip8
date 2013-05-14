/// <reference path=".typings/knockout.d.ts" />
/// <reference path=".typings/jquery.d.ts" />
import cpu = module("old/CPU");



var cpu1 = new cpu.Cpu();

var backup;


$(document).ready(() => {
    var model = {
        registers: cpu1.debug_registers,
        I: cpu1.debug_i,
        PC: cpu1.debug_pc,
        SP: cpu1.debug_sp,
        next: cpu1.debug_next
    };
    
    cpu1.memory[0x200] = 0x60;
    cpu1.memory[0x201] = 0x12;
    cpu1.memory[0x202] = 0x60;
    cpu1.memory[0x203] = 0x42;

    cpu1.memory[0x204] = 0x24;
    cpu1.memory[0x205] = 0x04;

    cpu1.memory[0x404] = 0xA6;
    cpu1.memory[0x405] = 0x00;
    cpu1.memory[0x406] = 0x00;
    cpu1.memory[0x407] = 0xEE;

    cpu1.memory[0x206] = 0xF5;
    cpu1.memory[0x207] = 0x65;

    cpu1.memory[0x208] = 0x85;
    cpu1.memory[0x209] = 0x30;

    cpu1.memory[0x20a] = 0x85;
    cpu1.memory[0x20b] = 0x44;

    cpu1.memory[0x600] = 1;
    cpu1.memory[0x601] = 2;
    cpu1.memory[0x602] = 3;
    cpu1.memory[0x603] = 4;
    cpu1.memory[0x604] = 5;

    cpu1.memory[0x20c] = 0x17;


    //cpu1.memory[0x700] = 0x68;
    //cpu1.memory[0x701] = 0xf0;

    //cpu1.memory[0x702] = 0x69;
    //cpu1.memory[0x703] = 0x78;

    cpu1.memory[0x700] = 0x68;
    cpu1.memory[0x701] = 0x20;

    cpu1.memory[0x702] = 0x69;
    cpu1.memory[0x703] = 0x10;


    cpu1.memory[0x704] = 0xf8;
    cpu1.memory[0x705] = 0x15;

    cpu1.memory[0x706] = 0xf9;
    cpu1.memory[0x707] = 0x18;

    cpu1.memory[0x708] = 0xfa;
    cpu1.memory[0x709] = 0x07;

    cpu1.memory[0x70a] = 0x3a;
    cpu1.memory[0x70b] = 0x00;

    cpu1.memory[0x70c] = 0x17;
    cpu1.memory[0x70d] = 0x08;

    cpu1.memory[0x70e] = 0x17;
    cpu1.memory[0x70f] = 0x04;


    cpu1.debug_next(cpu.displayByte(cpu1.memory[cpu1.PC]) + cpu.displayByte(cpu1.memory[cpu1.PC + 1]));
    backup = cpu1.memory.slice(0);
    cpu1.onHalt.subscribe(() => {
        cpu1.reset();
        copyProgram();
    });

    cpu1.startSound.subscribe(() => {
        $("#sound").css("color", "green");
    });

    cpu1.stopSound.subscribe(() => {
        $("#sound").css("color", "red");
    });

    setInterval(function () {
        cpu1.tick();
    }, 16);

    ko.applyBindings(model);
});

var interval = null;

$("#startstop").click(() => {
    if (!interval) {
        interval = setInterval(() => { cpu1.cycle() }, 8);
    } else {
        clearInterval(interval);
        interval = null;
    }
});

$("#cycle").click(() => {
    cpu1.cycle();
});

$("#reset").click(() => {
    cpu1.reset();
    copyProgram();    
});

function copyProgram() {
    for (var i = 0; i < 4096; i++){
        cpu1.memory[i] = backup[i];
    }
    cpu1.debug_next(cpu.displayByte(cpu1.memory[cpu1.PC]) + cpu.displayByte(cpu1.memory[cpu1.PC + 1]));
}