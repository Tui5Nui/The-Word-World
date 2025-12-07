// โค้ดสำหรับ RPG Maker MV/MZ เพื่อลบ Command Remember
(function() {
    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        // ลบคำสั่ง Command Remember ออก
        var index = this._list.findIndex(item => item.symbol === 'commandRemember');
        if (index > -1) {
            this._list.splice(index, 1);
        }
    };
})();