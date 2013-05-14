define(["require", "exports"], function(require, exports) {
    
    var cpu1 = new cpu.Cpu();
    var backup;
    $(document).ready(function () {
        var model = {
            registers: cpu1.debug_registers,
            I: cpu1.debug_i,
            PC: cpu1.debug_pc,
            SP: cpu1.debug_sp,
            next: cpu1.debug_next
        };
        cpu1.memory[512] = 96;
        cpu1.memory[513] = 18;
        cpu1.memory[514] = 96;
        cpu1.memory[515] = 66;
        cpu1.memory[516] = 36;
        cpu1.memory[517] = 4;
        cpu1.memory[1028] = 166;
        cpu1.memory[1029] = 0;
        cpu1.memory[1030] = 0;
        cpu1.memory[1031] = 238;
        cpu1.memory[518] = 245;
        cpu1.memory[519] = 101;
        cpu1.memory[520] = 133;
        cpu1.memory[521] = 48;
        cpu1.memory[522] = 133;
        cpu1.memory[523] = 68;
        cpu1.memory[1536] = 1;
        cpu1.memory[1537] = 2;
        cpu1.memory[1538] = 3;
        cpu1.memory[1539] = 4;
        cpu1.memory[1540] = 5;
        cpu1.memory[524] = 23;
        //cpu1.memory[0x700] = 0x68;
        //cpu1.memory[0x701] = 0xf0;
        //cpu1.memory[0x702] = 0x69;
        //cpu1.memory[0x703] = 0x78;
        cpu1.memory[1792] = 104;
        cpu1.memory[1793] = 32;
        cpu1.memory[1794] = 105;
        cpu1.memory[1795] = 16;
        cpu1.memory[1796] = 248;
        cpu1.memory[1797] = 21;
        cpu1.memory[1798] = 249;
        cpu1.memory[1799] = 24;
        cpu1.memory[1800] = 250;
        cpu1.memory[1801] = 7;
        cpu1.memory[1802] = 58;
        cpu1.memory[1803] = 0;
        cpu1.memory[1804] = 23;
        cpu1.memory[1805] = 8;
        cpu1.memory[1806] = 23;
        cpu1.memory[1807] = 4;
        cpu1.debug_next(cpu.displayByte(cpu1.memory[cpu1.PC]) + cpu.displayByte(cpu1.memory[cpu1.PC + 1]));
        backup = cpu1.memory.slice(0);
        cpu1.onHalt.subscribe(function () {
            cpu1.reset();
            copyProgram();
        });
        cpu1.startSound.subscribe(function () {
            $("#sound").css("color", "green");
        });
        cpu1.stopSound.subscribe(function () {
            $("#sound").css("color", "red");
        });
        setInterval(function () {
            cpu1.tick();
        }, 16);
        ko.applyBindings(model);
    });
    var interval = null;
    $("#startstop").click(function () {
        if(!interval) {
            interval = setInterval(function () {
                cpu1.cycle();
            }, 8);
        } else {
            clearInterval(interval);
            interval = null;
        }
    });
    $("#cycle").click(function () {
        cpu1.cycle();
    });
    $("#reset").click(function () {
        cpu1.reset();
        copyProgram();
    });
    function copyProgram() {
        for(var i = 0; i < 4096; i++) {
            cpu1.memory[i] = backup[i];
        }
        cpu1.debug_next(cpu.displayByte(cpu1.memory[cpu1.PC]) + cpu.displayByte(cpu1.memory[cpu1.PC + 1]));
    }
})
//@ sourceMappingURL=app.js.map
