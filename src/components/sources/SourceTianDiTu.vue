<template>
  <div v-if="false"></div>
</template>

<script>
import WMTSSource from "ol/source/WMTS";
import TileGridWMTS from "ol/tilegrid/WMTS";
import { inject, watch, onMounted, onUnmounted, computed } from "vue";
import usePropsAsObjectProperties from "../../composables/usePropsAsObjectProperties";

export class Tianditu extends WMTSSource {
  constructor(opt_options) {
    Tianditu.layerLabelMap = {
      vec: "cva",
      ter: "cta",
      img: "cia",
    };
    Tianditu.layerZoomMap = {
      vec: 18,
      ter: 14,
      img: 18,
    };
    let options = opt_options || {};

    options.layerType = options.layerType || "vec";
    options.layerType = options.isLabel
      ? Tianditu.layerLabelMap[options.layerType]
      : options.layerType;
    options.matrixSet =
      options.projection === "EPSG:4326" || options.projection === "EPSG:4490"
        ? "c"
        : "w";
    if (!options.url && !options.urls) {
      options.url = "https://t{0-7}.tianditu.gov.cn/{layer}_{proj}/wmts?";
    }
    if (options.tk) {
      options.url = `${options.url}tk=${options.tk}`;
    }
    options.url = options.url
      .replace("{layer}", options.layerType)
      .replace("{proj}", options.matrixSet);
    let tileGrid =
      options.tileGrid ||
      Tianditu.getTileGrid(options.projection || "EPSG:3857");
    let crossOrigin =
      options.crossOrigin !== undefined ? options.crossOrigin : "anonymous";
    let superOptions = {
      version: options.version || "1.0.0",
      format: options.format || "tiles",
      dimensions: options.dimensions || {},
      layer: options.layerType,
      matrixSet: options.matrixSet,
      tileGrid: tileGrid,
      style: options.style || "default",
      cacheSize: options.cacheSize,
      crossOrigin: crossOrigin,
      opaque: options.opaque === undefined ? true : options.opaque,
      maxZoom: Tianditu.layerZoomMap[options.layerType],
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      url: options.url,
      urls: options.urls,
      projection: options.projection || "EPSG:3857",
      wrapX: options.wrapX,
    };
  

    if (options.tileProxy) {
      superOptions.tileLoadFunction = tileLoadFunction;
    }
    super(superOptions);
    if (options.tileProxy) {
      this.tileProxy = options.tileProxy;
    }

    let me = this;
    function tileLoadFunction(imageTile, src) {
      imageTile.getImage().src = me.tileProxy + encodeURIComponent(src);
    }
  }

  static getTileGrid(projection) {
    if (projection === "EPSG:4326" || projection === "EPSG:4490") {
      return Tianditu.default4326TileGrid();
    }
    return Tianditu.default3857TileGrid();
  }

  static default4326TileGrid() {
    let tdt_WGS84_resolutions = [];
    let matrixIds = [];
    for (let i = 1; i < 19; i++) {
      tdt_WGS84_resolutions.push((0.703125 * 2) / Math.pow(2, i));
      matrixIds.push(i);
    }
    let tileGird = new TileGridWMTS({
      extent: [-180, -90, 180, 90],
      resolutions: tdt_WGS84_resolutions,
      origin: [-180, 90],
      matrixIds: matrixIds,
      minZoom: 1,
    });
    return tileGird;
  }

  static default3857TileGrid() {
    let tdt_Mercator_resolutions = [];
    let matrixIds = [];
    for (let i = 1; i < 19; i++) {
      tdt_Mercator_resolutions.push((78271.5169640203125 * 2) / Math.pow(2, i));
      matrixIds.push(i);
    }
    let tileGird = new TileGridWMTS({
      extent: [
        -20037508.3427892,
        -20037508.3427892,
        20037508.3427892,
        20037508.3427892,
      ],
      resolutions: tdt_Mercator_resolutions,
      matrixIds: matrixIds,
      origin: [-20037508.3427892, 20037508.3427892],
      minZoom: 1,
    });
    return tileGird;
  }
}
export default {
  name: "ol-source-tianditu",
  setup(props) {
    const layer = inject("tileLayer");
    const { properties } = usePropsAsObjectProperties(props);
    let source = computed(() => {
      return new Tianditu(properties);
    });
    watch(source, () => {
      layer.value.setSource(source.value);
    });
    watch(layer, () => {
      layer.value.setSource(source.value);
    });
    onMounted(() => {
      layer.value.setSource(source.value);
    });
    onUnmounted(() => {
      layer.value.setSource(null);
    });
    return {
      layer,
      source,
    };
  },
  props: {
    layerType: {
      type: String,
      default: "img", 
    },
    tk: {
      type: String,
    },
    isLabel: {
      type: Boolean,
      default: false,
    },
    cacheSize: {
      type: Number,
    },
    crossOrigin: {
      type: String,
    },
    projection: {
      Type: String,
      default: "EPSG:3857",
    },
    hidpi: {
      type: Boolean,
      default: false,
    },
    requestEncoding: {
      type: String,
      default: "KVP",
    },
    format: {
      type: String,
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    culture: {
      type: String,
      default: "en-us",
    },
    matrixSet: {
      type: String,
    },
    dimensions: {
      type: Object,
      default: () => {},
    },
    imageSmoothing: {
      type: Boolean,
      default: true,
    },
    maxZoom: {
      type: Number,
      default: 21,
    },
    reprojectionErrorThreshold: {
      type: Number,
    },
    tileLoadFunction: {
      type: Function,
      default: (imageTile, src) => (imageTile.getImage().src = src),
    },
    wrapX: {
      type: Boolean,
      default: true,
    },
    transition: {
      type: Number,
    },
  },
};
</script>

<style lang=""></style>