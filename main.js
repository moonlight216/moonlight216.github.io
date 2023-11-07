import stations from './data/stations.json' assert {type: 'json'}
import lines from './data/lines.geojson' assert {type: 'json'}
var map = L.map('map_container').setView([39.5, 116.3], 13)

L.tileLayer(
    'http://t2.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=0d84cf377db65d8f1af3b5f808876abe', {
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
        "opacity": 0
    }
})

var layerGroup = L.layerGroup([geoLayer]).addTo(map)

//设定当zoom>=14时，再加载lines图层
map.on('zoomend', () => {
    if (map.getZoom() >= 14) {
        layerGroup.showLayer()
    } else {
        layerGroup.hideLayer()
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

//天地图:http://t2.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=0d84cf377db65d8f1af3b5f808876abe
//OSM:https://tile.openstreetmap.org/{z}/{x}/{y}.png
//Arcgis地形图:https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}