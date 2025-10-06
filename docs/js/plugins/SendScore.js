(function () {
  var url = "https://script.google.com/macros/s/AKfycbz-ssSu5Z5YLd94A-Uzr4MpuxjlP5HCHeGCHlbCsvTsJPHi6kSQds_LmJSon8qUrTrl/exec"; // URL ของคุณ

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === "SendScore" && args[0] === "send") {
      var playerName = $gameActors.actor(1).name();
      var score = $gameVariables.value(1);
      var stage = $gameVariables.value(2);

      var fullUrl =
        url +
        "?name=" +
        encodeURIComponent(playerName) +
        "&score=" +
        encodeURIComponent(score) +
        "&stage=" +
        encodeURIComponent(stage);

      // ✅ ใช้ <img> เพื่อเลี่ยง CORS
      var img = new Image();
      img.src = fullUrl;

      console.log("📤 ส่งคะแนน:", fullUrl);
      $gameMessage.add("📤 กำลังส่งคะแนน...");
    }
  };
})();
