/*:
 * @plugindesc แสดงเหรียญสะสมบนหน้าจอ (เปิด/ปิดได้ด้วย Switch)
 * @author คุณ
 *
 * @param Coin Variable ID
 * @type variable
 * @default 3
 *
 * @param Show Switch ID
 * @type switch
 * @desc ถ้า Switch นี้ ON จะโชว์ HUD
 * @default 10
 */

(function() {

  var parameters = PluginManager.parameters('CoinHUD');
  var coinVarId = Number(parameters['Coin Variable ID'] || 3);
  var showSwitchId = Number(parameters['Show Switch ID'] || 10);

  function Window_CoinHUD() {
    this.initialize.apply(this, arguments);
  }

  Window_CoinHUD.prototype = Object.create(Window_Base.prototype);
  Window_CoinHUD.prototype.constructor = Window_CoinHUD;

  Window_CoinHUD.prototype.initialize = function() {
    var width = 180;
    var height = this.fittingHeight(1);
    var x = Graphics.boxWidth - width - 16;
    var y = 16;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._lastCoins = null;
    this.refresh();
  };

  Window_CoinHUD.prototype.refresh = function() {
    this.contents.clear();
    var coins = $gameVariables.value(coinVarId);
    this._lastCoins = coins;
    this.drawText("เหรียญ: " + coins, 0, 0, this.contentsWidth(), 'right');
  };

  Window_CoinHUD.prototype.update = function() {
    Window_Base.prototype.update.call(this);

    // 🔥 ควบคุมการแสดงผลด้วย Switch
    this.visible = $gameSwitches.value(showSwitchId);

    if (!this.visible) return;

    var coins = $gameVariables.value(coinVarId);
    if (this._lastCoins !== coins) {
      this.refresh();
    }
  };

  // ===== ผูกกับ Scene_Map =====
  var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function() {
    _Scene_Map_createAllWindows.call(this);
    this.createCoinHUD();
  };

  Scene_Map.prototype.createCoinHUD = function() {
    this._coinHUD = new Window_CoinHUD();
    this.addWindow(this._coinHUD);
  };

})();