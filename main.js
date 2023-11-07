import data from './data/stations.json' assert {type: 'json'}

var map = L.map('map_container').setView([39.5, 116.3], 13)

var baseLayer = L.tileLayer(
    'http://rt0.map.gtimg.com/realtimerender?z={z}&x={x}&y={-y}&type=vector&style=0', {
    attribution: '@osm',
    minZoom: 10,
    maxZoom: 14,
    preferCanvas: true
}
).addTo(map)



// TODO:批量添加markers

var pLayer = new PruneClusterForLeaflet();
var markers = []

var icon = L.icon({
    iconUrl: 'data/markers.png',
    iconSize: [20, 18],
    iconAnchor: [10, 9]
});

for (var i = 0; i < data.length; i++) {
    pLayer.RegisterMarker(new PruneCluster.Marker(data[i].Y, data[i].X, {
        title: 1,
        singleMarkerMode:true,
        popup:
     }));  
}

map.addLayer(pLayer);
pruneClusterView .ProcessView();




// TODO:图层切换