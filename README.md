# vue3ol

> 该 GIS 二维地图 [Vue3](https://v3.cn.vuejs.org/ "Vue3 Homepage") 组件库是基于 [OpenLayers](https://openlayers.org/ "OpenLayers Homepage") 开发的。
>
> 本组件库是源于 Github 上的开源组件库 [vue3-openlayers by Melih Altıntaş](https://github.com/MelihAltintas/vue3-openlayers) ，在其基础上根据自身的需求进行了定制，并且修复了一些问题。

- 源代码仓库地址： https://github.com/leolovesmile/vue3ol

- npm package 地址： https://www.npmjs.com/package/@rsmap/vue3ol

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

- 由于目前没有类型定义文件，故创建一个 `d.ts` 文件（或使用已有的文件），文件内加入如下代码来声明 module

```
declare module '@rsmap/vue3ol'
```

- 接下来便可以使用本组件库了

## change logs
### 2022 年 4 月 18 日
- `ol-source-wmts`组件的调整TileGrid默认的最高级别

### 2022 年 4 月 16 日

- `ol-webglpoints-layer`与`ol-source-webglpoints`组件的调优， 主动dispose资源，以及调整使用`features`属性时的性能

### 2022 年 4 月 7 日

- `ol-basic-draw`组件的完善 增加坐标系 允许单次绘制多个图形和单个图形 ，允许开启测面测距功能

### 2022 年 3 月 25 日

- 增加`ol-basic-draw`组件 增加属性`isMeasure`开启测量工具
- 组件`ol-source-wmts`绕过了 openlayers 自身的一个 bug

### 2022 年 3 月 17 日

- 组件`ol-source-wmts`增加了属性`capabilitiesUrl`，以支持通过 wmts 的元数据（GetCapabilities）来加载 wmts 图层

### 2022 年 3 月 16 日

- 组件`ol-source-wmts`的层级做了优化

### 2022 年 3 月 10 日

- 新增`ol-mvt-style-layer`，可以加载 mapbox style 定义的矢量瓦片
- `ol-source-wmts`组件增加`requestEncoding`属性

### 2022 年 3 月 2 日

- `ol-source-vector-tile`提供属性`projection`，用于配置**tile grid**的 projection

### 2022 年 2 月 25 日

- `ol-source-vector` 增加属性 `once`，若该属性为`true`，会将`features`属性`markRaw`[参考](https://v3.cn.vuejs.org/api/basic-reactivity.html#markraw)，可明显提升性能
- `ol-source-xyz` 增加属性 `attributions` 和属性 `tileGrid`
- 增加几个与 webgl 相关的组件：`ol-webglpoints-layer`, `ol-webgl-tile-layer`, `ol-source-webglpoints`
- 修复组件`ol-overlay`的属性`positioning`的类型的 bug

### 2022 年 01 月 25 日

- 合并代码，加入`ol-projection-register`组件，支持注册新的 projection

### 2022 年 01 月 17 日

- 新增矢量瓦片组件`ol-vector-tile-layer`和`ol-source-vector-tile`

### 2021 年 12 月 28 日

- 组件`ol-source-image-wms`增加了`time`参数
- 修复了 `SourceWMTS.vue` 的一个 bug

### 2021 年 12 月 21 日

- `ol-swipe-control` bug 修复：卷帘的图层列表变化时，卷帘未更新
- `ol-source-image-arcgis-rest`: 增加 arcgis rest 类型的栅格源
