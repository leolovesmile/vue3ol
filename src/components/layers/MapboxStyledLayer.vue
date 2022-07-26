<template lang="">
<div>
    <slot></slot>
</div>
</template>

<script>
import { inject, provide, onUnmounted, onMounted, watch, computed } from "vue";
import MapboxVector from "ol/layer/MapboxVector";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";
import BaseLayer from "./BaseLayer";
import { max } from "lodash";

export default {
  extends: BaseLayer,
  name: "ol-mvt-style-layer",
  setup(props) {
    const map = inject("map");

    const { properties } = usePropsAsObjectProperties(props);

    const mapboxVector = computed(() => new MapboxVector(properties));

    watch(properties, () => {
      mapboxVector.value.setProperties(properties);
    });

    const applyLayer = () => {
      if (properties.zIndexRange && !mapboxVector.value.getZIndex()) {
        const mapZLevelRange = map.get("zLevelRange");
        const minLevel = mapZLevelRange?.[properties.zIndexRange]?.[0];
        if (minLevel) mapboxVector.value.setZIndex(minLevel);
      }
      mapboxVector.value.setProperties({ pin: pin });
      map.addLayer(mapboxVector.value);
    };

    const removeLayer = () => {
      map.removeLayer(mapboxVector.value);
    };

    const pin = () => {
      const mapZLevelRange = map.get("zLevelRange");
      const minLevel = mapZLevelRange?.[props.zIndexRange]?.[0];
      const sameRangeLayers = map.getAllLayers().filter((l) => l.get("zIndexRange") === props.zIndexRange);
      if (minLevel) {
        const maxLayerZIndex = max(sameRangeLayers.map((x) => x.getZIndex() || 0));
        mapboxVector.value.setZIndex(maxLayerZIndex + 1);
        applyLayer();
        removeLayer();
      } else {
        throw "未找到对应层级范围！";
      }
    };

    onMounted(() => {
      applyLayer();
    });

    onUnmounted(() => {
      removeLayer();
    });

    provide("vectorTileLayer", mapboxVector);
    provide("stylable", mapboxVector);

    return {
      mapboxVector
    };
  },
  props: {
    renderBuffer: {
      type: Number,
      default: 100
    },
    renderMode: {
      type: String,
      default: "hybrid"
    },
    styleUrl: {
      type: String
    },
    updateWhileAnimating: {
      type: Boolean,
      default: false
    },
    updateWhileInteracting: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="">
</style>
