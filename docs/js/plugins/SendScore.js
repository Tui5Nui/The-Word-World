(function() {
    var url = "https://script.google.com/macros/s/AKfycby6IVuVW8Mmibpwnp0cIs2_Q2KkMHivHtDjFZjhrjs0LO2-FBP2JVIqJaQgdlLOARN5/exec";

    PluginManager.registerCommand('SendScore', 'send', args => {
        var playerName = $gameActors.actor(1).name();   // ดึงชื่อจาก Actor #1
        var score = $gameVariables.value(1);           // สมมติว่าเก็บคะแนนในตัวแปร #1
        var stage = $gameVariables.value(2);           // เก็บชื่อด่านในตัวแปร #2
        var date = new Date().toLocaleString();

        var data = {
            name: playerName,
            score: score,
            stage: stage,
            date: date
        };

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    });
})();