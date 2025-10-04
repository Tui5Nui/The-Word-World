(function() {
    var url = "https://script.google.com/macros/s/AKfycbw2mjO0uRrcK7h-FjXxRqSA-Va1dpJP2H3vWSjRXCZDB2Iot3dOEVBAkaRwt8Bb-2Pr/exec";

    // ✅ ใช้กับ RPG Maker MV
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command === "SendScore" && args[0] === "send") {
            var playerName = $gameActors.actor(1).name();   // ดึงชื่อ Actor #1
            var score = $gameVariables.value(1);           // คะแนนในตัวแปร #1
            var stage = $gameVariables.value(2);           // ด่านในตัวแปร #2
            var date = new Date().toLocaleString();

            var data = {
                name: playerName,
                score: score,
                stage: stage,
                date: date
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
            xhr.send(JSON.stringify(data));
        }
    };
})();
