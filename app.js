// マップの初期化
var map = L.map('map').setView([35.6895, 139.6917], 13);

// タイルレイヤーの追加
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 危険な場所のマーカーを追加する配列
var dangerZones = [];

// CSVを読み込む関数
function loadCSV(url) {
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            console.log("CSV読み込み結果:", results.data); // デバッグ用
            processCSVData(results.data);
        }
    });
}

// CSVデータを処理する関数
function processCSVData(data) {
    data.forEach(function(row) {
        var lat = parseFloat(row['地点　緯度（北緯）']);
        var lng = parseFloat(row['地点　経度（東経）']);
        var name = row['fid']; // 必要に応じて列名を変更

        // デバッグ用
        console.log("fid:", name, " 緯度:", lat, " 経度:", lng);

        if (!isNaN(lat) && !isNaN(lng)) {
            dangerZones.push({lat: lat, lng: lng, name: name});
            L.marker([lat, lng]).addTo(map).bindPopup(name);
        } else {
            console.warn("無効な座標:", row);
        }
    });
}

// 現在地の追跡
function startMap() {
    map.locate({setView: true, watch: true, maxZoom: 16});
}

// 音楽を再生する関数
var alertSound = document.getElementById('alertSound');

function playSound() {
    alertSound.currentTime = 0; // 音楽を最初から再生
    alertSound.play().catch(function(error) {
        console.error("音楽の再生に失敗しました:", error);
    });
}

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map).bindPopup("あなたはここにいます").openPopup();
    L.circle(e.latlng, radius).addTo(map);

    dangerZones.forEach(function(zone) {
        var distance = map.distance(e.latlng, [zone.lat, zone.lng]);
        if (distance < 100) { // 100メートル以内に近づいたら警告
            alert("警告: " + zone.name + " に近づいています！");
            playSound(); // 音楽を鳴らす
        }
    });
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

// CSVファイルのURLを指定して読み込む
loadCSV('H and C Data.csv'); // CSVファイルのパスを指定

// ボタンがクリックされたらマップを表示
document.getElementById('startButton').addEventListener('click', startMap);

