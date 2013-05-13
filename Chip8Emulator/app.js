define(["require", "exports", "CPU"], function(require, exports, __cpu__) {
    var cpu = __cpu__;

    var cpu1 = new cpu.Cpu();
    var backup;
    $(document).ready(function () {
        var model = {
            registers: cpu1.debug_registers,
            I: cpu1.debug_i,
            PC: cpu1.debug_pc,
            SP: cpu1.debug_sp
        };
        cpu1.registers.forEach(function (register, index) {
            model.registers.push({
                index: index.toString(16).toUpperCase(),
                value: register
            });
        });
        model.PC(cpu1.PC.toString(16));
        model.I(cpu1.I.toString(16));
        model.SP(cpu1.SP.toString(16));
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
        backup = cpu1.memory.slice(0);
        cpu1.onHalt.subscribe(function () {
            cpu1.reset();
            copyProgram();
        });
        ko.applyBindings(model);
    });
    var interval = null;
    $("#cycle").click(function () {
        if(!interval) {
            interval = setInterval(function () {
                cpu1.cycle();
            }, 16);
        } else {
            clearInterval(interval);
            interval = null;
        }
    });
    $("#reset").click(function () {
        cpu1.reset();
        copyProgram();
    });
    function copyProgram() {
        for(var i = 0; i < 4096; i++) {
            cpu1.memory[i] = backup[i];
        }
    }
})
//@ sourceMappingURL=app.js.map
