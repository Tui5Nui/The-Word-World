(function () {
  var url = "https://script.google.com/macros/s/AKfycbxyg2pu0MtcSEzEvDWxYUMaUn0faOH_4MGMa-w7q3ryhtYrFAJNQS_8oqqFAJGVcvLc/exec";

  // ⭐ เก็บคะแนนรวมที่เคยส่งไปครั้งล่าสุด
  var lastSentTotalScore = 0;

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === "SendScore" && args[0] === "send") {
      var playerName = $gameActors.actor(1).name();
      var totalScore = Number($gameVariables.value(1) || 0); // คะแนนรวมตอนนี้
      var stage = $gameVariables.value(2);                   // ด่าน / เรื่อง

      // ✅ คำนวณคะแนนของ "เรื่องล่าสุด" = คะแนนรวมตอนนี้ - คะแนนรวมที่เคยส่งไป
      var stageScore = totalScore - lastSentTotalScore;

      // ถ้ามีการรีเซ็ตตัวแปรในเกมแล้วค่าติดลบ → fallback ใช้ totalScore แทน
      if (stageScore < 0) {
        stageScore = totalScore;
      }

      // กันไว้ไม่ให้คะแนนเกินขอบเขต 0–10 (ตามที่บอกว่าเต็ม 10)
      if (stageScore < 0) stageScore = 0;
      if (stageScore > 10) stageScore = 10;

      // อัปเดตค่าคะแนนรวมที่เคยส่ง เพื่อนำไปลบครั้งหน้า
      lastSentTotalScore = totalScore;

      var fullUrl =
        url +
        "?name=" + encodeURIComponent(playerName) +
        "&score=" + encodeURIComponent(stageScore) +  // ⬅️ ส่งเฉพาะคะแนนของเรื่องนี้
        "&stage=" + encodeURIComponent(stage);

      var xhr = new XMLHttpRequest();
      xhr.open("GET", fullUrl, true);
      xhr.onload = function () {
        if (xhr.status === 200 && xhr.responseText.includes("OK")) {
          $gameMessage.add("ส่งคะแนนสำเร็จ!");
        } else {
          $gameMessage.add("ส่งคะแนนล้มเหลว");
        }
      };
      xhr.onerror = function () {
        $gameMessage.add("ไม่สามารถเชื่อมต่อได้");
      };
      xhr.send();

      console.log("ส่งคะแนนไปยังชีต:", fullUrl);
      $gameMessage.add("กำลังส่งคะแนนของ " + playerName + "...");
    }
  };
})();
