# vue3ol

> 该GIS二维地图 [Vue3](https://v3.cn.vuejs.org/ "Vue3 Homepage") 组件库是基于 [OpenLayers](https://openlayers.org/ "OpenLayers Homepage") 开发的。  
>
> 本组件库是源于 Github 上的开源组件库 [vue3-openlayers by Melih Altıntaş](https://github.com/MelihAltintas/vue3-openlayers) ，在其基础上根据自身的需求进行了定制，并且修复了一些问题。

- 源代码仓库地址： https://github.com/leolovesmile/vue3ol

- npm package地址： https://www.npmjs.com/package/@rsmap/vue3ol

## 安装与使用

### 安装
```bash
# install current vue3ol version 
npm install @rsmap/vue3ol
# or
yarn add @rsmap/vue3ol
```

### 使用
- 在 main.js (或其它入口) 引入组件，关键代码如下：
```
import OpenLayersMap from '@rsmap/vue3ol'
import '@rsmap/vue3ol/dist/vue3ol.css'


app.use(OpenLayersMap)
```
- 由于目前没有类型定义文件，故创建一个 `d.ts` 文件（或使用已有的文件），文件内加入如下代码来声明module
```
declare module '@rsmap/vue3ol'
```

- 接下来便可以使用本组件库了

## change logs
### 2022年01月17日
- 新增矢量瓦片组件`ol-vector-tile-layer`和`ol-source-vector-tile`

### 2021年12月28日
- 组件`ol-source-image-wms`增加了`time`参数
- 修复了 `SourceWMTS.vue` 的一个bug

### 2021年12月21日
- `ol-swipe-control` bug修复：卷帘的图层列表变化时，卷帘未更新
- `ol-source-image-arcgis-rest`: 增加 arcgis rest 类型的栅格源