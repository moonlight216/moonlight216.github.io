import stations from './data/stations.json' assert {type: 'json'}
import lines from './data/lines.geojson' assert {type: 'json'}
var map = L.map('map_container').setView([39.5, 116.3], 13)

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '@osm',
    minZoom: 9,
    maxZoom: 18,
    preferCanvas: true
}
).addTo(map)

var geoLayer = L.geoJSON(lines, {
    style: {
        "color": "green",
        "weight": 3,
        "opacity": 0.5
    }
})

//设定当zoom>=15时，再加载lines图层
map.on('zoomend', () => {
    if (map.getZoom() >= 14) {
        map.addLayer(geoLayer)
    } else {
        if (map.hasLayer(geoLayer)) {
            map.removeLayer(geoLayer)
        }
    }
})

// TODO:批量添加markers

var pLayer = new PruneClusterForLeaflet();

var icon = L.icon({
    iconUrl: 'data/markers.png',
    iconSize: [20, 18],
    iconAnchor: [10, 9]
});

function round(num) {
    return Math.round(num * 100) / 100.
}

for (var i = 0; i < stations.length; i++) {
    var x = stations[i].X
    var y = stations[i].Y
    var name = stations[i].StationNam
    pLayer.RegisterMarker(new PruneCluster.Marker(y, x, {
        singleMarkerMode: true,
        popup: "站名: " + name + "<br/>" + "经度: " + round(x) + "<br/>" + "纬度: " + round(y)
    }));
}

map.addLayer(pLayer);
pLayer.ProcessView();




// TODO:图层切换