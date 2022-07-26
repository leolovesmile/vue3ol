<template lang="">
<div>
    <slot></slot>
</div>
</template>

<script>
import { inject, provide, onUnmounted, onMounted, watch } from "vue";

import ImageLayer from "ol/layer/Image";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";
import BaseLayer from "./BaseLayer";
import { max } from "lodash";

export default {
  extends: BaseLayer,
  name: "ol-image-layer",
  setup(props) {
    const map = inject("map");
    const { properties } = usePropsAsObjectProperties(props);

    const imageLayer = new ImageLayer(properties);

    watch(properties, () => {
      imageLayer.setProperties(properties);
    });

    const applyLayer = () => {
      if (properties.zIndexRange && !imageLayer.getZIndex()) {
        const mapZLevelRange = map.get("zLevelRange");
        const minLevel = mapZLevelRange?.[properties.zIndexRange]?.[0];
        if (minLevel) imageLayer.setZIndex(minLevel);
      }
      imageLayer.setProperties({ pin: pin });
      map.addLayer(imageLayer);
    };

    const removeLayer = () => {
      map.removeLayer(imageLayer);
    };

    const pin = () => {
      const mapZLevelRange = map.get("zLevelRange");
      const minLevel = mapZLevelRange?.[props.zIndexRange]?.[0];
      const sameRangeLayers = map.getAllLayers().filter((l) => l.get("zIndexRange") === props.zIndexRange);
      if (minLevel) {
        const maxLayerZIndex = max(sameRangeLayers.map((x) => x.getZIndex() || 0));
        imageLayer.setZIndex(maxLayerZIndex + 1);
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

    provide("imageLayer", imageLayer);

    return {
      imageLayer
    };
  }
};
</script>

<style lang="">
</style>
