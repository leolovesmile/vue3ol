<template lang="">
<div>
    <slot></slot>
</div>
</template>

<script>
import { inject, provide, onUnmounted, onMounted, watch, computed } from "vue";

import VectorLayer from "ol/layer/Vector";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";

import BaseLayer from "./BaseLayer";
import { max } from "lodash";

export default {
  extends: BaseLayer,
  name: "ol-vector-layer",
  setup(props) {
    const map = inject("map");

    const { properties } = usePropsAsObjectProperties(props);

    const vectorLayer = computed(() => new VectorLayer(properties));

    watch(properties, () => {
      vectorLayer.value.setProperties(properties);
    });

    const applyLayer = () => {
      if (properties.zIndexRange && !vectorLayer.value.getZIndex()) {
        const mapZLevelRange = map.get("zLevelRange");
        const minLevel = mapZLevelRange?.[properties.zIndexRange]?.[0];
        if (minLevel) vectorLayer.value.setZIndex(minLevel);
      }
      vectorLayer.value.setProperties({ pin: pin });
      map.addLayer(vectorLayer.value);
    };

    const removeLayer = () => {
      map.removeLayer(vectorLayer.value);
    };

    const pin = () => {
      const mapZLevelRange = map.get("zLevelRange");
      const minLevel = mapZLevelRange?.[props.zIndexRange]?.[0];
      const sameRangeLayers = map.getAllLayers().filter((l) => l.get("zIndexRange") === props.zIndexRange);
      if (minLevel) {
        const maxLayerZIndex = max(sameRangeLayers.map((x) => x.getZIndex() || 0));
        vectorLayer.value.setZIndex(maxLayerZIndex + 1);
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

    provide("vectorLayer", vectorLayer);
    provide("stylable", vectorLayer);

    return {
      vectorLayer
    };
  },
  props: {
    renderBuffer: {
      type: Number,
      default: 100
    },
    updateWhileAnimating: {
      type: Boolean,
      default: false
    },
    style: {
      type: Function
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
