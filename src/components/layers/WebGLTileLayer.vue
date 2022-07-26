<template lang="">
<div>
    <slot></slot>
</div>
</template>

<script>
import { inject, provide, onUnmounted, onMounted, watch, computed } from "vue";

import TileLayer from "ol/layer/WebGLTile";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";
import BaseLayer from "./BaseLayer";
import { max } from "lodash";

export default {
  extends: BaseLayer,
  name: "ol-webgl-tile-layer",
  setup(props) {
    const map = inject("map");
    const overViewMap = inject("overviewMap", null);

    const { properties } = usePropsAsObjectProperties(props);

    const tileLayer = computed(() => new TileLayer(properties));

    const applyTileLayer = () => {
      if (properties.zIndexRange && !tileLayer.value.getZIndex()) {
        const mapZLevelRange = map.get("zLevelRange");
        const minLevel = mapZLevelRange?.[properties.zIndexRange]?.[0];
        if (minLevel) tileLayer.value.setZIndex(minLevel);
      }
      tileLayer.value.setProperties({ pin: pin });
      if (overViewMap != null) {
        overViewMap.value.getOverviewMap().addLayer(tileLayer.value);
        overViewMap.value.changed();
      } else {
        map.addLayer(tileLayer.value);
      }
    };

    const removeTileLayer = () => {
      if (overViewMap != null) {
        overViewMap.value.getOverviewMap().removeLayer(tileLayer.value);
        overViewMap.value.changed();
      } else {
        map.removeLayer(tileLayer.value);
      }
    };

    const pin = () => {
      const mapZLevelRange = map.get("zLevelRange");
      const minLevel = mapZLevelRange?.[props.zIndexRange]?.[0];
      const sameRangeLayers = map.getAllLayers().filter((l) => l.get("zIndexRange") === props.zIndexRange);
      if (minLevel) {
        const maxLayerZIndex = max(sameRangeLayers.map((x) => x.getZIndex() || 0));
        tileLayer.value.setZIndex(maxLayerZIndex + 1);
        removeTileLayer();
        applyTileLayer();
      } else {
        throw "未找到对应层级范围！";
      }
    };

    if (overViewMap != null) {
      watch(overViewMap, () => {
        removeTileLayer();
        applyTileLayer();
      });
    }

    onMounted(() => {
      applyTileLayer();
    });

    onUnmounted(() => {
      removeTileLayer();
    });

    provide("tileLayer", tileLayer);

    return {
      tileLayer
    };
  },
  props: {
    preload: {
      type: Number,
      default: 1
    }
  }
};
</script>

<style lang="">
</style>
