(function () {
  var url = "https://script.google.com/macros/s/AKfycbyjjORdElkQozZiKtmoU33ePtCKOOGNtrWGRZ_0ujssCMzsrpRPvAJWYrfMfphVWImH/exec";

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === "SendScore" && args[0] === "send") {
      var playerName = $gameActors.actor(1).name();
      var score = $gameVariables.value(1);
      var stage = $gameVariables.value(2);

      var fullUrl =
        url +
        "?name=" + encodeURIComponent(playerName) +
        "&score=" + encodeURIComponent(score) +
        "&stage=" + encodeURIComponent(stage);

      // ✅ ใช้ XMLHttpRequest เพื่ออ่านผลตอบกลับ (OK / Error)
      var xhr = new XMLHttpRequest();
      xhr.open("GET", fullUrl, true);
      xhr.onload = function () {
        if (xhr.status === 200 && xhr.responseText.includes("OK")) {
          $gameMessage.add(" ส่งคะแนนสำเร็จ!");
        } else {
          $gameMessage.add(" ส่งคะแนนล้มเหลว");
        }
      };
      xhr.onerror = function () {
        $gameMessage.add("ไม่สามารถเชื่อมต่อได้");
      };
      xhr.send();

      console.log("📤 ส่งคะแนนไปยังชีต:", fullUrl);
      $gameMessage.add("📤 กำลังส่งคะแนนของ " + playerName + "...");
    }
  };
})();
