define(["require", "exports", "chip8/decoder", "chip8/registers", "chip8/stack", "chip8/memory", "chip8/timers", "chip8/screen", "chip8/keypad", "chip8/core", "chip8/assembler", "lib/jquery-2.0.0"], function(require, exports, __decoderModule__, __registerModule__, __stackModule__, __memoryModule__, __timersModule__, __screenModule__, __keypadModule__, __coreModule__, __assemblerModule__) {
    var decoderModule = __decoderModule__;

    var registerModule = __registerModule__;

    var stackModule = __stackModule__;

    var memoryModule = __memoryModule__;

    var timersModule = __timersModule__;

    var screenModule = __screenModule__;

    var keypadModule = __keypadModule__;

    var coreModule = __coreModule__;

    var assemblerModule = __assemblerModule__;

    var registers = new registerModule.chip8.Registers();
    var memory = new memoryModule.chip8.Memory();
    var decoder = new decoderModule.chip8.Decoder(memory, registers);
    var stack = new stackModule.chip8.Stack();
    var timers = new timersModule.chip8.Timers();
    var screen = new screenModule.chip8.Screen();
    var keypad = new keypadModule.chip8.Keypad();
    var core = new coreModule.chip8.Core(registers, stack, memory, timers, screen, keypad);
    var disassembler = new assemblerModule.chip8.Disassembler();
    $(document).ready(function () {
        var sound = document.createElement("audio");
        sound.loop = true;
        sound.autoplay = false;
        sound.preload = "auto";
        sound.src = "beep.mp3";
        loadCode();
        registers.reset();
        function tickCore() {
            if(!core.halted) {
                var instruction = decoder.getNext();
                core.execute(instruction);
            }
        }
        function tickTimer() {
            timers.tick();
        }
        $(".cycle").click(function () {
            tickTimer();
            tickCore();
        });
        var clock = null;
        var ticker = null;
        $(".start").click(function () {
            if(clock == null) {
                clock = setInterval(function () {
                    for(var i = 0; i < 20; i++) {
                        tickCore();
                    }
                }, 0);
                ticker = setInterval(function () {
                    tickTimer();
                }, 16);
            } else {
                clearInterval(clock);
                clearInterval(ticker);
                clock = null;
                ticker = null;
            }
        });
        $(".keypad").click(function () {
            $(".keypad-container").toggleClass("icon-sized");
            console.dir(this);
        });
        $(".keypad-button").click(function (event) {
            event.stopPropagation();
        });
        $(".keypad-button").mousedown(function () {
            $(this).data("isPressed", true);
            console.log("Key " + parseInt($(this).data("key"), 10).toString(16) + " pressed");
        });
        $(".keypad-button").mouseup(function () {
            if($(this).data("isPressed")) {
                $(this).data("isPressed", false);
                console.log("Key " + parseInt($(this).data("key"), 10).toString(16) + " released");
            }
        });
        $(".keypad-button").mouseout(function (event) {
            if($(this).data("isPressed")) {
                $(this).data("isPressed", false);
                console.log("Key " + parseInt($(this).data("key"), 10).toString(16) + " released");
            }
        });
        $(".keypad-controls-grabber").click(function () {
            $(".keypad-controls-container").toggleClass("slide-out");
        });
        var canvas = $("#display")[0];
        var ctx = canvas.getContext('2d');
        screen.onClear.subscribe(function () {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 128, 64);
        });
        screen.onDraw.subscribe(function () {
            ctx.beginPath();
            var pixels = screen.getPixels();
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            for(var i = 0; i < pixels.length; i++) {
                if(pixels[i] == 0) {
                    var x = i % 64;
                    var y = i >> 6;
                    ctx.rect(x * 2, y * 2, 2, 2);
                }
            }
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#00FF00";
            for(var i = 0; i < pixels.length; i++) {
                if(pixels[i] == 1) {
                    var x = i % 64;
                    var y = i >> 6;
                    ctx.rect(x * 2, y * 2, 2, 2);
                }
            }
            ctx.fill();
        });
        $(".reset").click(function () {
            if(clock) {
                clearInterval(clock);
                clock = null;
            }
            memory.reset();
            loadCode();
            stack.reset();
            timers.reset();
            registers.reset();
        });
    });
    function loadCode() {
        memory.reset();
        memory.load(0x200, [
            0x60, 
            0x0A, 
            0x65, 
            0x05, 
            0x66, 
            0x0A, 
            0x67, 
            0x0F, 
            0x68, 
            0x14, 
            0x61, 
            0x01, 
            0x62, 
            0x01, 
            0x63, 
            0x01, 
            0x64, 
            0x01, 
            0x60, 
            0x0A, 
            0xA2, 
            0x78, 
            0xD0, 
            0x56, 
            0x70, 
            0x0A, 
            0xA2, 
            0x7E, 
            0xD0, 
            0x66, 
            0x70, 
            0x0A, 
            0xA2, 
            0x84, 
            0xD0, 
            0x76, 
            0x70, 
            0x0A, 
            0xA2, 
            0x8A, 
            0xD0, 
            0x86, 
            0x6A, 
            0x03, 
            0xFA, 
            0x15, 
            0x60, 
            0x0A, 
            0xA2, 
            0x78, 
            0xD0, 
            0x56, 
            0x45, 
            0x14, 
            0x61, 
            0xFF, 
            0x45, 
            0x01, 
            0x61, 
            0x01, 
            0x85, 
            0x14, 
            0xD0, 
            0x56, 
            0x70, 
            0x0A, 
            0xA2, 
            0x7E, 
            0xD0, 
            0x66, 
            0x46, 
            0x14, 
            0x62, 
            0xFF, 
            0x46, 
            0x01, 
            0x62, 
            0x01, 
            0x86, 
            0x24, 
            0xD0, 
            0x66, 
            0x70, 
            0x0A, 
            0xA2, 
            0x84, 
            0xD0, 
            0x76, 
            0x47, 
            0x14, 
            0x63, 
            0xFF, 
            0x47, 
            0x01, 
            0x63, 
            0x01, 
            0x87, 
            0x34, 
            0xD0, 
            0x76, 
            0x70, 
            0x0A, 
            0xA2, 
            0x8A, 
            0xD0, 
            0x86, 
            0x48, 
            0x14, 
            0x64, 
            0xFF, 
            0x48, 
            0x01, 
            0x64, 
            0x01, 
            0x88, 
            0x44, 
            0xD0, 
            0x86, 
            0x12, 
            0x2A, 
            0xFF, 
            0x03, 
            0x0C, 
            0x30, 
            0xC0, 
            0xFF, 
            0xFF, 
            0xC0, 
            0xC0, 
            0xFC, 
            0xC0, 
            0xFF, 
            0xF0, 
            0xCC, 
            0xCC, 
            0xF0, 
            0xCC, 
            0xC3, 
            0x3C, 
            0xC3, 
            0xC3, 
            0xC3, 
            0xC3, 
            0x3C
        ], -1);
        return;
    }
    function displayAssembly() {
        for(var i = 0; i < 7; i++) {
            var line = i - 2;
            var addr = registers.PC + (line * 2);
            if(addr < 0x200) {
                $(".code-line-" + i).text("----- ---- ---------");
                continue;
            }
            var instruction = decoder.peekNext(i - 2);
            $(".code-line-" + i).text(hexPad(addr, 4) + ": " + hexPad(instruction.opcode, 4) + " [" + disassembler.disassemble(instruction) + "]");
        }
    }
    function hexPad(value, size) {
        return ("00000000" + value.toString(16).toUpperCase()).substr(size * -1);
    }
})
//@ sourceMappingURL=NewTest.js.map
