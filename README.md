# *全国重点文物保护单位地图*

## 数据源

1. [立方数据学社-全国重点文物保护单位数据0417](https://mp.weixin.qq.com/s/Rf9V-mOu3B8lu93F1unVgg)
2. [全国一体化在线政务平台（国家文物局综合行政管理平台）](http://gl.ncha.gov.cn/#/public-service)

## 所用插件

1. [Leaflet](https://leafletjs.com/)
2. [jQuery](https://jquery.com/)
3. [marker-cluster](https://github.com/Leaflet/Leaflet.markercluster)
4. [iconfont-阿里巴巴矢量图标库](https://www.iconfont.cn/)

## ✨网页简介

### 1.界面

①界面如图(1)所示，主要包含了1个**可拖动的**综合地图控件（有切换图层、缩放地图、数据过滤、搜索等功能）和1个地图容器。

②**界面多采用圆角设计，更加美观**。设计了网页的图标，以及右下角的注记，点击Home标签可以链接到网页的github库。

<img src="E:/mdpic/image-20231113152102871.png" alt="image-20231113152102871" style="zoom: 50%;" />

<center>(图1)网页界面</center>

### 2.UI和交互设计



### 3.地图Toolbar

①实现如图(2)所示的功能：**主页、缩放、回到中心、切换底图源、更多信息**。

![image-20231113153241918](E:/mdpic/image-20231113153241918.png)

<center>(图2)Toolbar</center>

②**搜索功能**：比如搜索“天”字，**搜索结果窗口中包含了结果数量的统计**。**在点击列表中的结果之后，可以跳转到对应的标记点**，如图(3)所示。

<img src="E:/mdpic/image-20231113155235630.png" alt="image-20231113155235630" style="zoom: 50%;" />

<center>(图3)搜索功能</center>

③**过滤器功能：**可以根据“省份”和“批次”进行**多条件过滤**，若过滤条件为“*”，则为“选择该条件下的所有元素”。**我对结果进行分类展示，并标注出每个分类下的结果数量。**所过滤的结果均可**跳转到对应的标记点**，如图(4)所示。

<img src="E:/mdpic/image-20231113160708653.png" alt="image-20231113160708653" style="zoom:50%;" />

