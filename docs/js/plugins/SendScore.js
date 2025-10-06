(function () {
  // 🔗 URL ของ Google Apps Script ที่คุณ Deploy แล้ว (แบบ /exec)
  var url = "https://script.google.com/macros/s/AKfycbyjjORdElkQozZiKtmoU33ePtCKOOGNtrWGRZ_0ujssCMzsrpRPvAJWYrfMfphVWImH/exec";

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === "SendScore" && args[0] === "send") {
      var playerName = $gameActors.actor(1).name();   // ชื่อผู้เล่น
      var score = $gameVariables.value(1);            // คะแนนเก็บไว้ในตัวแปร #1
      var stage = $gameVariables.value(2);            // ด่านเก็บไว้ในตัวแปร #2

      var fullUrl =
        url +
        "?name=" + encodeURIComponent(playerName) +
        "&score=" + encodeURIComponent(score) +
        "&stage=" + encodeURIComponent(stage);

      // ✅ ใช้ <img> เพื่อหลีกเลี่ยง CORS
      var img = new Image();
      img.src = fullUrl;

      console.log("📤 ส่งคะแนนไปยังชีต:", fullUrl);
      $gameMessage.add("📤 กำลังส่งคะแนนของ " + playerName + "...");
    }
  };
})();
