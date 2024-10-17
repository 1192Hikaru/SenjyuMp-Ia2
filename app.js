// 地図の初期化
var map = L.map('map').setView([35.6895, 139.6917], 10); // Tokyoの緯度経度

// タイルレイヤーの追加
L.tileLayer('https://raw.githubusercontent.com/your-username/your-repo/master/MBTilesFile.mbtiles/{z}/{x}/{y}.png', {
    maxZoom: 20,
    tileSize: 256,
    zoomOffset: -1
}).addTo(map);
