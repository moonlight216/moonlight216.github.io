import data from './data/proj.json' assert {type: 'json'}

// TODO：初始化地图
var map = L.map('map_container', {
    zoomControl: false,
    minNativeZoom: 4,
    maxNativeZoom: 18,
    minZoom: 4,
    maxZoom: 18
}).setView([34.5, 90.0], 4)

map.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a> | <a href="https://github.com/moonlight216/moonlight216.github.io">Home</a>')

L.layerGroup([
    L.tileLayer('http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=0d84cf377db65d8f1af3b5f808876abe', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
    L.tileLayer('http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=0d84cf377db65d8f1af3b5f808876abe', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
], {
    attribution: '天地图',
}).addTo(map)

function round(x) {
    return Math.round(x * 100) / 100.
}
// TODO:根据TYPE类型分类添加到itemlist中
function addLi(ul_id, elmnt) {
    var li = document.createElement('li')
    li.className = "item"
    li.id = "item_" + elmnt.FID
    li.innerHTML = "<b>名称：</b>" + elmnt.NAME + "<br/>" +
        "<b>地址：</b>" + elmnt.ADDRESS + "<br/>" + " <b>经纬度：</b>" + round(elmnt.LAT) + "°N," + round(elmnt.LON) + "°E"
    document.getElementById(ul_id).appendChild(li)
    li.onclick = () => {
        map.setView([elmnt.LAT, elmnt.LON], 16)
        //map.flyTo([elmnt.LAT, elmnt.LON], 16, { duration: 1 })
        markers.get(elmnt.FID).openPopup()
    }
}

// TODO:间隔地给li上色

function colordif(p, elmnt) {
    var item = document.getElementById("item_" + elmnt.FID)
    if (p % 2 == 0) {
        item.style.backgroundColor = "#e7e7e7"
        item.onmouseover = () => {
            item.style.backgroundColor = "rgb(179, 179, 179)"
        }
        item.onmouseout = () => {
            item.style.backgroundColor = "#e7e7e7"
        }
    }
    return ++p
}
var p = [0, 0, 0, 0, 0, 0]
// TODO：过滤按钮
var buttonfilter = document.getElementById('buttonfilter')
buttonfilter.onclick = () => {
    const filterConditions = {
        PROJ: $("#s_proj option:selected").val(),
        BATCH: $("#s_batch option:selected").val()
    };

    const filteredData = data.filter(item => {
        return Object.entries(filterConditions).every(([key, value]) => {
            if (value === '*') {
                return true;
            }
            return item[key] === value;
        });
    });

    var subuls = document.getElementsByClassName("subul")
    for (var i = 0; i < subuls.length; i++) {
        var subul = subuls[i]
        while (subul.firstChild) {
            subul.removeChild(subul.firstChild)
        }
    }

    // TODO：分类
    var count = [0, 0, 0, 0, 0, 0]
    filteredData.forEach(e => {
        const type = e.TYPE
        switch (type) {
            case "古建筑":
                addLi('gujianzhu', e)
                p[0] = colordif(p[0], e)
                count[0]++
                break
            case "古墓葬":
                addLi('gumuzang', e)
                p[1] = colordif(p[1], e)
                count[1]++
                break
            case "古遗址":
                addLi('guyizhi', e)
                p[2] = colordif(p[2], e)
                count[2]++
                break
            case "近现代重要史迹及代表性建筑":
                addLi('jindai', e)
                p[3] = colordif(p[3], e)
                count[3]++
                break
            case "石窟寺及石刻":
                addLi('shike', e)
                p[4] = colordif(p[4], e)
                count[4]++
                break
            case "其他":
                addLi('qita', e)
                p[5] = colordif(p[5], e)
                count[5]++
                break
        }
    })
    var countspans = document.getElementsByClassName("count")
    for (var j = 0; j < countspans.length; j++) {
        countspans[j].innerHTML = "(" + count[j] + ")"
    }
}
// TODO: 添加数据到filter内

//省份PROJ
var s_proj = document.getElementById("s_proj");
var projSet = new Set();
data.forEach(item => {
    var projValue = item.PROJ;

    // 确保不重复添加
    if (!projSet.has(projValue)) {
        projSet.add(projValue);

        var option = document.createElement("option");
        option.text = projValue;
        option.value = projValue;

        s_proj.add(option);
    }
})

// TODO: 伸缩ul,添加选中颜色
$(function () {
    $('.submenu_header').click(function () {
        $(".submenu_header_active").attr('class', 'submenu_header')
        $(this).attr('class', 'submenu_header_active')
        //ul之间伸缩交替
        $('.subul').not($(this).siblings('.subul')).slideUp();
        $(this).siblings('.subul').slideToggle();
    })
})

// TODO：div-toolbar可拖动(拖动范围)
var toolbar = document.getElementById("toolbar")
var aside = document.getElementById('aside')
var searchInput = document.getElementById('search-input')

dragElement(toolbar);

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        // 检查鼠标点击的位置是否在search-input内
        if (e.target === searchInput || searchInput.contains(e.target)) {
            return;
        }
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

        aside.style.top = (aside.offsetTop - pos2) + "px";
        aside.style.left = (aside.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// TODO:添加markers

var marksLayer = L.markerClusterGroup()

const markers = new Map()

data.forEach(item => {
    var marker = L.marker([item.LAT, item.LON],
        {
            title: item.NAME
        }).bindPopup("<b>名称：</b>" + item.NAME + "<br/>" +
            "<b>地址：</b>" + item.ADDRESS + "<br/>" + " <b>经纬度：</b>" + round(item.LAT) + "°N," + round(item.LON) + "°E" + "<br/>" +
            "<b>文物类型：</b>" + item.TYPE + "<br/>" + "<b> 批次：</b>" + item.BATCH + "<br/>" + "<b> 时代：</b>" + item.AGE)

    marksLayer.addLayer(marker)
    markers.set(item.FID, marker)
})

map.addLayer(marksLayer)

// TODO： 处理onclick事件
var zoomin = document.getElementById('zoom_in')

zoomin.onclick = () => map.zoomIn(1);

var zoomout = document.getElementById('zoom_out')
zoomout.disabled = true;
zoomout.style.backgroundColor = "rgb(227,227,227)"
zoomout.onclick = () => map.zoomOut(1)

var full = document.getElementById('full')
full.onclick = () => map.setView([34.5, 90.0], 4)


var itemlist = document.getElementById('itemlist');
var infopage = document.getElementById('infopage');
var filter = document.getElementById('filter')
var searchdiv = document.getElementById('searchdiv')
var layerdiv = document.getElementById('layerdiv')

var info = document.getElementById('info')
info.onclick = () => {
    if (infopage.style.display !== 'block') {
        itemlist.style.display = 'none'
        searchdiv.style.display = 'none'
        filter.style.display = 'none'
        layerdiv.style.display = 'none'
        infopage.style.display = 'block'
    }
}

var home = document.getElementById('home')
home.onclick = () => {
    if (itemlist.style.display !== 'block') {
        itemlist.style.display = 'block'
        filter.style.display = 'block'
        searchdiv.style.display = 'none'
        infopage.style.display = 'none'
        layerdiv.style.display = 'none'
    }
}

var search = document.getElementById('search')
search.onclick = () => {
    const text = document.getElementById('search-input').value
    if (text !== "") {
        const result = data.filter(e => {
            return e.NAME.includes(text)
        })

        var searchresult = document.getElementById('searchresult')
        while (searchresult.firstChild) {
            searchresult.removeChild(searchresult.firstChild)
        }
        var p1 = 0 //计数指针
        result.forEach(e => {
            addLi('searchresult', e)
            p1 = colordif(p1, e)
        })

        var lis = searchresult.getElementsByTagName('li');
        var searchcount = document.getElementById('searchcount')
        if (lis.length != 0) {
            searchcount.innerHTML = "共有 " + lis.length + " 条结果"
        } else {
            searchcount.innerHTML = "无符合搜索条件的结果"
        }

        if (searchdiv.style.display !== 'block') {
            itemlist.style.display = 'none'
            infopage.style.display = 'none'
            filter.style.display = 'none'
            layerdiv.style.display = 'none'
            searchdiv.style.display = 'block'
        }
    }
}

var layers = document.getElementById('layers')
layers.onclick = () => {
    if (layerdiv.style.display !== 'block') {
        itemlist.style.display = 'none'
        searchdiv.style.display = 'none'
        filter.style.display = 'none'
        infopage.style.display = 'none'
        layerdiv.style.display = 'block'
    }
}

// TODO:按钮可用性设置
map.on('zoom', function () {
    var zoomLevel = map.getZoom();
    if (zoomLevel <= 4) {
        zoomout.disabled = true;
        zoomout.style.backgroundColor = "rgb(227,227,227)"
    } else {
        zoomout.disabled = false;
        zoomout.style.backgroundColor = "rgb(255,255,255)"
    }
    if (zoomLevel >= 18) {
        zoomin.disabled = true;
        zoomin.style.backgroundColor = "rgb(227,227,227)"
    } else {
        zoomin.disabled = false;
        zoomin.style.backgroundColor = "rgb(255,255,255)"
    }
});

// TODO:图层切换
//天地图:http://t2.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=0d84cf377db65d8f1af3b5f808876abe
//OSM:https://tile.openstreetmap.org/{z}/{x}/{y}.png
//Arcgis遥感图:https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}

// 定义底图图层
var txLayer = L.tileLayer('http://rt0.map.gtimg.com/realtimerender?z={z}&x={x}&y={-y}&type=vector&style=0', {
    attribution: '腾讯地图'
});

var amapLayer = L.tileLayer('http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}', {
    attribution: '高德地图'
});

var tiandituLayer = L.layerGroup([
    L.tileLayer('http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=0d84cf377db65d8f1af3b5f808876abe', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
    L.tileLayer('http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=0d84cf377db65d8f1af3b5f808876abe', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
], {
    attribution: '天地图'
})

var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OSM'
});

var arcgisLayer = L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'ArcGIS'
});

var googleLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: 'Google Maps'
});

// 创建底图图层组
var basemaps = {
    "tx": txLayer,
    "amap": amapLayer,
    "tianditu": tiandituLayer,
    "osm": osmLayer,
    "arcgis": arcgisLayer,
    "google": googleLayer
};

// 添加底图切换事件
document.getElementById('basemaps').addEventListener('click', e => {
    var basemap = e.target.getAttribute('data-basemap')
    if (basemaps[basemap]) {
        map.eachLayer(layer => { map.removeLayer(layer) })
        basemaps[basemap].addTo(map)
        map.addLayer(marksLayer)
    }
});