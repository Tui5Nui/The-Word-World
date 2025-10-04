(function () {
  var url =
    "https://script.google.com/macros/s/AKfycbyY0eZRaVhLyZmLI3igRGK-BJf38qQeQE6OH_eXiEVGvPbZ-G7LeuT1UeV1poBp7mnb/exec";

  // ✅ ใช้กับ RPG Maker MV
  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === "SendScore" && args[0] === "send") {
      var playerName = $gameActors.actor(1).name(); // ดึงชื่อ Actor #1
      var score = $gameVariables.value(1); // คะแนนในตัวแปร #1
      var stage = $gameVariables.value(2); // ด่านในตัวแปร #2
      var date = new Date().toLocaleString();

      var data = {
        name: playerName,
        score: score,
        stage: stage,
        date: date,
      };

      // ✅ แสดงผลใน Console
      console.log("📊 กำลังส่งข้อมูล:", data);

      // ✅ แสดงข้อความในเกม (Message Window)
      $gameMessage.add("ชื่อ: " + playerName);
      $gameMessage.add("คะแนน: " + score);
      $gameMessage.add("ด่าน: " + stage);
      $gameMessage.add("วันที่: " + date);

      // ✅ ส่งไป Google Apps Script
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/json");

      // ✅ ส่วนตรวจสอบผลลัพธ์การส่ง
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // การส่งเสร็จสมบูรณ์
          if (xhr.status === 200) {
            console.log("ส่งข้อมูลสำเร็จ!", xhr.responseText);
            $gameMessage.add("✅ ส่งข้อมูลสำเร็จ!");
          } else {
            console.error("ส่งข้อมูลล้มเหลว", xhr.status, xhr.responseText);
            $gameMessage.add("❌ ส่งข้อมูลล้มเหลว!");
          }
        }
      };
      xhr.send(JSON.stringify(data));
    }
  };
})();
