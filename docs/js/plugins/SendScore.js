(function() {
    var url = "https://script.google.com/macros/s/AKfycby6IVuVW8Mmibpwnp0cIs2_Q2KkMHivHtDjFZjhrjs0LO2-FBP2JVIqJaQgdlLOARN5/exec";

    PluginManager.registerCommand('SendScore', 'send', args => {
        var playerName = $gameActors.actor(1).name();   // ดึงชื่อจาก Actor #1
        var score = $gameVariables.value(1);           // เก็บคะแนนในตัวแปร #1
        var stage = $gameVariables.value(2);           // เก็บชื่อด่านในตัวแปร #2
        var date = new Date().toLocaleString();

        var data = {
            name: playerName,
            score: score,
            stage: stage,
            date: date
        };

        // ✅ แสดงค่าทดสอบใน Console (ดูใน F8 Developer Tools ของเกม)
        console.log("📊 กำลังส่งข้อมูล:", data);

        // ✅ หรือจะแสดงในกล่องข้อความภายในเกม
        alert(
            "ชื่อ: " + playerName +
            "\nคะแนน: " + score +
            "\nด่าน: " + stage +
            "\nวันที่: " + date
        );

        // ✅ ส่งข้อมูลไปยัง Google Apps Script
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    });
})();
