import data from './data/proj.json' assert {type: 'json'}

// TODO:根据TYPE类型分类添加到itemlist中
data.forEach(e => {
    
})

var map = L.map('map_container', {
    zoomControl: false
}).setView([34.5, 119.0], 4)

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '@osm',
    minNativeZoom: 4,
    maxNativeZoom: 18,
    minZoom: 4,
    maxZoom: 18,
    preferCanvas: true
}
).addTo(map)

// TODO：div-toolbar可拖动
var toolbar = document.getElementById(("toolbar"))
var view = document.getElementById("view")

dragElement(toolbar);

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



// TODO:添加markers

var marksLayer = L.markerClusterGroup()

var markers = []

var icon = L.icon({
    iconUrl: 'image/markers.png',
    iconSize: [20, 18],
    iconAnchor: [10, 9]
});

data.forEach(item => {
    var marker = L.marker([item.LAT, item.LON],
        {
            title: item.NAME
        }).bindPopup(item.NAME)

    marksLayer.addLayer(marker)
    markers.push(marker)
})

map.addLayer(marksLayer)

// TODO； 处理onclick事件
var zoomin = document.getElementById('zoom_in')
zoomin.onclick = () => map.zoomIn(1)

var zoomout = document.getElementById('zoom_out')
zoomout.onclick = () => map.zoomOut(1)

var full = document.getElementById('full')
full.onclick = () => map.setView([34.5, 119.0], 4)

// TODO:图层切换
//天地图:http://t2.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=0d84cf377db65d8f1af3b5f808876abe
//OSM:https://tile.openstreetmap.org/{z}/{x}/{y}.png
//Arcgis地形图:https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}