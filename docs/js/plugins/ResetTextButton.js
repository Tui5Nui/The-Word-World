/*:
 * @plugindesc ปุ่มรีเซ็ตเหรียญ (อยู่ข้าง CoinHUD อัตโนมัติ)
 * @author คุณ
 *
 * @param Coin Variable ID
 * @type variable
 * @default 3
 *
 * @param Show Switch ID
 * @type switch
 * @default 11
 */

(function() {

var params = PluginManager.parameters('ResetTextButton');
var coinVarId = Number(params['Coin Variable ID'] || 3);
var showSwitchId = Number(params['Show Switch ID'] || 11);

// ===============================
// ปุ่มข้อความ
// ===============================
function Window_ResetButton() {
    this.initialize.apply(this, arguments);
}

Window_ResetButton.prototype = Object.create(Window_Base.prototype);
Window_ResetButton.prototype.constructor = Window_ResetButton;

Window_ResetButton.prototype.initialize = function() {

    var width = 150;
    var height = this.fittingHeight(1);

    Window_Base.prototype.initialize.call(this, 0, 0, width, height);

    this.opacity = 180;
    this.refresh();
};

Window_ResetButton.prototype.refresh = function() {
    this.contents.clear();
    this.contents.textColor = "#ffffff";
    this.drawText("รีเซ็ตเหรียญ", 0, 0, this.contentsWidth(), "center");
};

Window_ResetButton.prototype.update = function() {
    Window_Base.prototype.update.call(this);

    // 🔥 แสดงตาม switch
    this.visible = $gameSwitches.value(showSwitchId);

    if (!this.visible) return;

    // 🔥 จัดตำแหน่งให้ชิด CoinHUD
    if (SceneManager._scene._coinHUD) {
        var hud = SceneManager._scene._coinHUD;

        this.x = hud.x - this.width - 8; // อยู่ซ้าย HUD
        this.y = hud.y;
    }

    // 🔥 ตรวจคลิก
    if (TouchInput.isTriggered()) {

        var x = TouchInput.x;
        var y = TouchInput.y;

        if (x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height) {

            SoundManager.playOk();
            SceneManager.push(Scene_ResetConfirm_Text);
        }
    }
};

// ===============================
// Scene Confirm
// ===============================
function Scene_ResetConfirm_Text() {
    this.initialize.apply(this, arguments);
}

Scene_ResetConfirm_Text.prototype =
    Object.create(Scene_MenuBase.prototype);
Scene_ResetConfirm_Text.prototype.constructor =
    Scene_ResetConfirm_Text;

Scene_ResetConfirm_Text.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    var w = 480;
    var h = 120;

    this._textWindow = new Window_Base(
        (Graphics.boxWidth - w)/2,
        (Graphics.boxHeight - h)/2 - 60,
        w, h
    );

    this._textWindow.contents.textColor = "#ffffff";

    this._textWindow.drawText(
        "ต้องการรีเซ็ตเหรียญหรือไม่?",
        0, 30,
        this._textWindow.contentsWidth(),
        "center"
    );

    this.addWindow(this._textWindow);

    this._commandWindow = new Window_ResetConfirmCommand(
        (Graphics.boxWidth - 240)/2,
        (Graphics.boxHeight/2) + 10
    );

    this._commandWindow.setHandler("yes", () => {
        $gameVariables.setValue(coinVarId, 0);
        SoundManager.playOk();
        SceneManager.pop();
    });

    this._commandWindow.setHandler("no", () => {
        SceneManager.pop();
    });

    this.addWindow(this._commandWindow);
    this._commandWindow.activate();
};

// ===============================
// ปุ่ม Confirm (ตัวอักษรขาว)
// ===============================
function Window_ResetConfirmCommand() {
    this.initialize.apply(this, arguments);
}

Window_ResetConfirmCommand.prototype =
    Object.create(Window_Command.prototype);
Window_ResetConfirmCommand.prototype.constructor =
    Window_ResetConfirmCommand;

Window_ResetConfirmCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
};

Window_ResetConfirmCommand.prototype.windowWidth = function() {
    return 240;
};

Window_ResetConfirmCommand.prototype.makeCommandList = function() {
    this.addCommand("ใช่", "yes");
    this.addCommand("ไม่", "no");
};

// 🔥 แก้ตัวอักษรซีด
Window_ResetConfirmCommand.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);

    this.changePaintOpacity(true);
    this.contents.textColor = "#ffffff";

    this.drawText(
        this.commandName(index),
        rect.x,
        rect.y,
        rect.width,
        "center"
    );
};

// ===============================
// เพิ่มลง Scene_Map
// ===============================
var _Scene_Map_createAllWindows =
    Scene_Map.prototype.createAllWindows;

Scene_Map.prototype.createAllWindows = function() {
    _Scene_Map_createAllWindows.call(this);
    this.createResetTextButton();
};

Scene_Map.prototype.createResetTextButton = function() {
    this._resetTextButton = new Window_ResetButton();
    this.addWindow(this._resetTextButton);
};

})();