/*:
 * @plugindesc ระบบคำใบ้ 3 ชั้น (Idle Hint System) เวอร์ชันแก้คัตซีน
 * @author คุณ
 */

(function() {

  // ===== ตั้งค่าเวลา (60 เฟรม = 1 วินาที)
  var hintTimes = [360, 900, 1500]; 
  // 6วิ → ใบ้เบา
  // 15วิ → ใบ้ชัด
  // 25วิ → กล่องข้อความใหญ่

  var idleCounter = 0;
  var hintLevel = 0;
  var activePopup = null;

  // ===== ใบ้ตาม Map ID =====
  var mapHints = {
    5: [
      "ลองมองรอบ ๆ ดูสิ...",
      "อาจมีใครบางคนรอให้คุณเข้าไปคุยด้วย",
      "ลองเดินไปคุยกับพระดาบสดูสิ"
    ],
    8: [
      "การค้นคว้าเริ่มต้นจากการสอบถามผู้รู้เสมอ...",
      "ในห้องสมุด ผู้ดูแลคือแหล่งข้อมูลสำคัญ",
      "ลองพูดคุยกับผู้ดูแลที่เคาน์เตอร์กลางห้องดูสิ"
    ],
    12: [
      "อาจมีใครบางคนกำลังรอให้คุณเข้าไปพูดด้วย",
      "มีบางคนที่แตกต่างจากคนอื่นอยู่นะ",
      "เข้าไปคุยกับคุณครูที่อยู่กลางตลาด"
    ],
    16: [
      "มีใครบางคนกำลังรอให้คุณเข้าไปพูดด้วย...",
      "ลองมองหาตัวละครที่ไม่เคลื่อนไหว",
      "เข้าไปพูดคุยกับผู้เฒ่ากลางหมู่บ้าน"
    ]
  };

  // ===== Popup Class =====
  function HintPopup(text) {
    this.initialize(text);
  }

  HintPopup.prototype = Object.create(Sprite.prototype);
  HintPopup.prototype.constructor = HintPopup;

  HintPopup.prototype.initialize = function(text) {
    Sprite.prototype.initialize.call(this);

    this.bitmap = new Bitmap(520, 70);

    // พื้นหลังโปร่ง
    this.bitmap.fillRect(0, 0, 520, 70, "rgba(0, 0, 0, 0.75)");

    this.bitmap.fontSize = 22;
    this.bitmap.textColor = "#FFFF99";
    this.bitmap.outlineColor = "#000000";
    this.bitmap.outlineWidth = 5;
    this.bitmap.drawText(text, 0, 0, 520, 70, "center");

    this.x = Graphics.width / 2 - 260;
    this.y = 40;

    this.opacity = 0;
    this._phase = "fadeIn";
    this._timer = 0;
  };

  HintPopup.prototype.update = function() {

    if (this._phase === "fadeIn") {
      this.opacity += 10;
      if (this.opacity >= 255) {
        this.opacity = 255;
        this._phase = "wait";
      }
    }

    else if (this._phase === "wait") {
      this._timer++;
      if (this._timer > 300) { // ค้าง ~5 วิ
        this._phase = "fadeOut";
      }
    }

    else if (this._phase === "fadeOut") {
      this.opacity -= 5;
      if (this.opacity <= 0) {
        this.parent.removeChild(this);
        activePopup = null;
      }
    }
  };

  // ===== รีเซ็ตเมื่อเปลี่ยนแมพ =====
  var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    idleCounter = 0;
    hintLevel = 0;
  };

  // ===== Scene Update Hook =====
  var _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);

    // ❗ ถ้ามี Event รัน หรือมีข้อความ → ไม่นับเวลา
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
      idleCounter = 0;
      hintLevel = 0;
      return;
    }

    // ถ้าผู้เล่นเดิน → รีเซ็ต
    if ($gamePlayer.isMoving()) {
      idleCounter = 0;
      hintLevel = 0;
      return;
    }

    idleCounter++;

    var mapId = $gameMap.mapId();
    var hints = mapHints[mapId];

    if (!hints) return;

    if (hintLevel < 3 && idleCounter >= hintTimes[hintLevel]) {

      if (hintLevel < 2) {
        if (!activePopup) {
          activePopup = new HintPopup(hints[hintLevel]);
          this.addChild(activePopup);
        }
      } 
      else {
        $gameMessage.add("💡 " + hints[hintLevel]);
      }

      hintLevel++;
    }
  };

})();