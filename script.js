let map, routeSearch;

function initMap() {
    // 地図を初期化
    map = new Y.Map("map", {
        configure: {
            scrollWheelZoom: true
        }
    });
    map.addControl(new Y.SliderZoomControlVertical());
    map.drawMap(new Y.LatLng(35.682839, 139.759455), 14, Y.LayerSetId.NORMAL);

    // ルート検索の準備
    routeSearch = new Y.RouteSearch();

    // イベントリスナーを設定
    document.getElementById('search').addEventListener('click', function() {
        calculateAndDisplayRoute();
    });
}

function calculateAndDisplayRoute() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    if (origin && destination) {
        // ルート検索を実行
        routeSearch.execute({
            start: origin,
            goal: destination,
            callback: function(result) {
                if (result.getStatus() === Y.RouteSearch.SUCCESS) {
                    // ルートを地図に表示
                    map.addOverlay(result.getRouteOverlay());
                    map.setZoom(result.getRouteZoom());
                } else {
                    alert('ルート検索に失敗しました: ' + result.getStatus());
                }
            }
        });
    } else {
        alert("出発地と目的地を入力してください！");
    }
}

window.onload = initMap;
