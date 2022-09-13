<template lang="">
<div>
    <slot></slot>
</div>
</template>

<script>
import { inject, provide, onUnmounted, onMounted, watch, computed } from "vue";
import TileLayer from "ol/layer/Tile";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";
import BaseLayer from "./BaseLayer";
import { max } from "lodash";

export default {
  extends: BaseLayer,
  name: "ol-tile-layer",
  emits: ["postrender", "prerender", "propertychange", "change", "moveend"],
  setup(props, { emit }) {
    const map = inject("map");
    const overViewMap = inject("overviewMap", null);

    const { properties } = usePropsAsObjectProperties(props);

    const tileLayer = computed(() => {
      const tilelayer = new TileLayer(properties);
      tilelayer.on("postrender", (event) => emit("postrender", event));
      tilelayer.on("prerender", (event) => emit("prerender", event));
      tilelayer.on("propertychange", (event) => emit("propertychange", event));
      tilelayer.on("change", (event) => emit("change", event));

      return tilelayer;
    });

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

      map.on("moveend", moveendEventListener);
    };

    const removeTileLayer = () => {
      if (overViewMap != null) {
        overViewMap.value.getOverviewMap().removeLayer(tileLayer.value);
        overViewMap.value.changed();
      } else {
        // TODO: check if this is a bug - whether the layer is only removed from overview map in this case?
        map.removeLayer(tileLayer.value);
      }

      map.un("moveend", moveendEventListener);
    };

    if (overViewMap != null) {
      watch(overViewMap, () => {
        removeTileLayer();
        applyTileLayer();
      });
    }

    const moveendEventListener = (event) => emit("moveend", Object.assign(event, { layer: tileLayer.value }));

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
