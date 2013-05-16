/// <reference path=".typings/jquery.d.ts" />
/// <reference path=".typings/require.d.ts" />
/// <amd-dependency path="lib/jquery-2.0.0" />
import decoderModule = module("chip8/decoder");
import registerModule = module("chip8/registers");
import stackModule = module("chip8/stack");
import memoryModule = module("chip8/memory");
import timersModule = module("chip8/timers");
import screenModule = module("chip8/screen");
import coreModule = module("chip8/core");
import assemblerModule = module("chip8/assembler");

var registers = new registerModule.chip8.Registers();
var memory = new memoryModule.chip8.Memory();
var decoder = new decoderModule.chip8.Decoder(memory, registers);
var stack = new stackModule.chip8.Stack();
var timers = new timersModule.chip8.Timers();
var screen = new screenModule.chip8.Screen();
var core = new coreModule.chip8.Core(registers, stack, memory, timers, screen);
var disassembler = new assemblerModule.chip8.Disassembler();

var sound = <HTMLAudioElement> document.createElement("audio");
sound.loop = true;
sound.autoplay = false;
sound.preload = "auto";
sound.src = "beep.mp3";

$(document).ready(() => {    
    memory.write(0x200, 0x60);
    memory.write(0x201, 0x12);
    memory.write(0x202, 0x60);
    memory.write(0x203, 0x42);
                            
    memory.write(0x204, 0x24);
    memory.write(0x205, 0x04);
                            
    memory.write(0x404, 0xA6);
    memory.write(0x405, 0x00);
    memory.write(0x406, 0x00);
    memory.write(0x407, 0xEE);
                            
    memory.write(0x206, 0xF5);
    memory.write(0x207, 0x65);
                            
    memory.write(0x208, 0x85);
    memory.write(0x209, 0x30);
                            
    memory.write(0x20a, 0x85);
    memory.write(0x20b, 0x44);
                            
    memory.write(0x600, 1);
    memory.write(0x601, 2);
    memory.write(0x602, 3);
    memory.write(0x603, 4);
    memory.write(0x604, 5);
          
    memory.write(0x20c, 0x17);

    memory.load(0x700,
        [
            0x68, 0x20,
            0x69, 0x10,
            0xf8, 0x15,
            0xf9, 0x18,
            0xfa, 0x07,
            0x3a, 0x00,
            0x17, 0x08,
            0x17, 0x04
        ],
        -1
    );

    registers.onWrite.subscribe((register: any, value: number) => {
        $(".variable-" + register + " .variable-value").text(value.toString(16).toUpperCase());
        if (register === "PC") {
            displayAssembly();
        }
    });

    timers.onWrite.subscribe((timer: string, value: number) => {
        $(".variable-" + timer + " .variable-value").text(hexPad(value, 2));
    });

    timers.onStartSound.subscribe(() => {
        $(".sound").addClass("current");
        sound.currentTime = 1;
        sound.play();
    });

    timers.onStopSound.subscribe(() => {
        $(".sound").removeClass("current");
        sound.pause();
    });

    registers.reset();


    $(".cycle").click(() => {
        timers.tick();
        var instruction = decoder.getNext();
        core.execute(instruction);
    });


    var clock = null;
    $(".start").click(() => {
        if (clock == null) {
            clock = setInterval(() => {
                timers.tick();
                var instruction = decoder.getNext();
                core.execute(instruction);
            }, 16);
        } else {
            clearInterval(clock);
            clock = null;
        }
    });

    $(".keypad").click(function() {
        $(this).toggleClass("icon-sized");
        console.dir(this);
    });

    $(".keypad-button").click(function (event) {
        event.stopPropagation();
    });

    $(".keypad-button").mousedown(function () {
        $(this).data("isPressed", true);
        console.log("Key " + parseInt($(this).data("key"),10).toString(16) + " pressed");
    });

    $(".keypad-button").mouseup(function () {
        if ($(this).data("isPressed")) {
            $(this).data("isPressed", false);
            console.log("Key " + parseInt($(this).data("key"), 10).toString(16) + " released");
        }
    });

    $(".keypad-button").mouseout(function (event) {
        if ($(this).data("isPressed")) {
            $(this).data("isPressed", false);
            console.log("Key " + parseInt($(this).data("key"), 10).toString(16) + " released");
        }        
    });
    
});

function displayAssembly() {
    for (var i = 0; i < 5; i++){
        var line = i - 2;
        var addr = registers.PC + (line*2);
        if (addr < 0x200) {
            $(".code-line-" + i).text(" --- --- --- --- ---");
            continue;
        }
        var instruction = decoder.peekNext(i - 2);
        $(".code-line-" + i).text(
            hexPad(addr, 4) + ": " +
            hexPad(instruction.opcode, 4) +
            " ["+ disassembler.disassemble(instruction) +"]"
        );
    }
}

function hexPad(value, size) {
    return ("00000000" + value.toString(16).toUpperCase()).substr(size*-1);
}