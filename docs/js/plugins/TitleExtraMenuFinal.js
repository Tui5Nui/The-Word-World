/*:
 * @plugindesc Title Menu: วิธีเล่น (Video) + Confirm เสถียร
 * @author คุณ
 */

(function() {

let _confirmActive = false;

// =====================================================
// เพิ่มเมนู
// =====================================================
Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   "newGame");
    this.addCommand(TextManager.continue_, "continue", this.isContinueEnabled());
    this.addCommand("วิธีเล่น", "howToPlay");
    this.addCommand(TextManager.options,   "options");
};

// =====================================================
// ผูก Handler
// =====================================================
const _createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    _createCommandWindow.call(this);

    this._commandWindow.setHandler("howToPlay",
        this.commandHowToPlay.bind(this));
};

// =====================================================
// วิธีเล่น
// =====================================================
Scene_Title.prototype.commandHowToPlay = function() {

    this.showConfirm("ต้องการดูวิธีเล่นหรือไม่?", () => {

        let currentBgm = AudioManager.saveBgm();
        AudioManager.stopBgm();

        this.forceCloseConfirm();

        Graphics.playVideo("movies/howtoplay.webm");

        if (Graphics._video) {

            Graphics._video.loop = false;

            Graphics._video.onended = () => {

                Graphics._onVideoEnd();
                AudioManager.replayBgm(currentBgm);

                this._commandWindow.activate();
            };
        }
    });
};

// =====================================================
// WINDOW CONFIRM CLASS
// =====================================================
function Window_TitleConfirm() {
    this.initialize.apply(this, arguments);
}

Window_TitleConfirm.prototype = Object.create(Window_Command.prototype);
Window_TitleConfirm.prototype.constructor = Window_TitleConfirm;

Window_TitleConfirm.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
};

Window_TitleConfirm.prototype.windowWidth = function() {
    return 240;
};

Window_TitleConfirm.prototype.makeCommandList = function() {
    this.addCommand("ใช่", "yes");
    this.addCommand("ไม่", "no");
};

Window_TitleConfirm.prototype.normalColor = function() {
    return "#ffffff";
};

// =====================================================
// แสดง Confirm
// =====================================================
Scene_Title.prototype.showConfirm = function(text, yesCallback) {

    if (_confirmActive) return;
    _confirmActive = true;

    this._commandWindow.deactivate();

    // ----- text window -----
    let w = 480;
    let h = 120;

    this._confirmTextWindow = new Window_Base(
        (Graphics.boxWidth - w)/2,
        (Graphics.boxHeight - h)/2 - 60,
        w, h
    );

    this._confirmTextWindow.contents.clear();
    this._confirmTextWindow.contents.textColor = "#ffffff";

    this._confirmTextWindow.drawText(
        text,
        0,
        30,
        this._confirmTextWindow.contentsWidth(),
        "center"
    );

    this.addWindow(this._confirmTextWindow);

    // ----- command window -----
    this._confirmCommandWindow = new Window_TitleConfirm(
        (Graphics.boxWidth - 240)/2,
        (Graphics.boxHeight/2) + 10
    );

    this.addWindow(this._confirmCommandWindow);

    this._confirmCommandWindow.setHandler("yes", () => {
        yesCallback();
    });

    this._confirmCommandWindow.setHandler("no", () => {
        this.forceCloseConfirm();
        this._commandWindow.activate();
    });

    this._confirmCommandWindow.activate();
};

// =====================================================
// ปิด Confirm
// =====================================================
Scene_Title.prototype.forceCloseConfirm = function() {

    if (this._confirmCommandWindow) {
        this._confirmCommandWindow.close();
        this._confirmCommandWindow.parent.removeChild(this._confirmCommandWindow);
        this._confirmCommandWindow = null;
    }

    if (this._confirmTextWindow) {
        this._confirmTextWindow.close();
        this._confirmTextWindow.parent.removeChild(this._confirmTextWindow);
        this._confirmTextWindow = null;
    }

    _confirmActive = false;
};

})();