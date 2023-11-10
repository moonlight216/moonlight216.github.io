import data from './data/proj.json' assert {type: 'json'}

// TODO；初始化地图
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


// TODO:根据TYPE类型分类添加到itemlist中
function addLi(ul_id, elmnt) {
    var li = document.createElement('li')
    li.className = "item"
    function round(x) {
        return Math.round(x * 100) / 100.
    }
    li.innerHTML = "名称:" + elmnt.NAME + "<br/>" + "位置:" + round(elmnt.LAT) + "°N," + round(elmnt.LON) + "°E"
    document.getElementById(ul_id).appendChild(li)
    li.onclick = () => {
        map.setView([elmnt.LAT, elmnt.LON], 16)
        //map.flyTo([elmnt.LAT, elmnt.LON], 16, { duration: 1 })
        markers.get(elmnt.FID).openPopup()
    }
}

// TODO:间隔地给li上色

data.forEach(e => {
    const type = e.TYPE
    switch (type) {
        case "古建筑":
            addLi('gujianzhu', e)
            break
        case "古墓葬":
            addLi('gumuzang', e)
            break
        case "古遗址":
            addLi('guyizhi', e)
            break
        case "近现代重要史迹及代表性建筑":
            addLi('jindai', e)
            break
        case "石窟寺及石刻":
            addLi('shike', e)
            break
        case "其他":
            addLi('qita', e)
            break
    }
})

// TODO: 伸缩ul
$(function () {
    $('.submenu_header').click(function () {
        $(this).next().slideToggle().siblings('ul').slideUp(100);
    })
})

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

const markers = new Map()

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
    markers.set(item.FID, marker)
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