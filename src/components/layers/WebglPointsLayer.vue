<template lang="">
<div>
    <slot></slot>
</div>
</template>

<script>
import { inject, provide, onUnmounted, onMounted, watch, computed } from "vue";

import WebGLPointsLayer from "ol/layer/WebGLPoints";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";

import BaseLayer from "./BaseLayer";
import { max } from "lodash";

export default {
  extends: BaseLayer,
  name: "ol-webglpoints-layer",
  setup(props) {
    const map = inject("map");

    const { properties } = usePropsAsObjectProperties(props);

    const webglPointsLayer = computed(() => new WebGLPointsLayer(properties));

    watch(properties, () => {
      webglPointsLayer.value.setProperties(properties);
      // TODO: bug - `setVisible` does not work for webglPointsLayer
      // webglPointsLayer.value.setVisible(properties.visible);
    });

    const applyLayer = () => {
      if (properties.zIndexRange && !webglPointsLayer.value.getZIndex()) {
        const mapZLevelRange = map.get("zLevelRange");
        const minLevel = mapZLevelRange?.[properties.zIndexRange]?.[0];
        if (minLevel) webglPointsLayer.value.setZIndex(minLevel);
      }
      webglPointsLayer.value.setProperties({ pin: pin });
      map.addLayer(webglPointsLayer.value);
    };

    const removeLayer = () => {
      try {
        webglPointsLayer.value.dispose();
      } catch (e) {
        console.error(`get error ${e} when try to dispose webgl points layer`);
      }
      map.removeLayer(webglPointsLayer.value);
    };

    const pin = () => {
      const mapZLevelRange = map.get("zLevelRange");
      const minLevel = mapZLevelRange?.[props.zIndexRange]?.[0];
      const sameRangeLayers = map.getAllLayers().filter((l) => l.get("zIndexRange") === props.zIndexRange);
      if (minLevel) {
        const maxLayerZIndex = max(sameRangeLayers.map((x) => x.getZIndex() || 0));
        webglPointsLayer.value.setZIndex(maxLayerZIndex + 1);
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

    provide("webglPointsLayer", webglPointsLayer);

    return {
      webglPointsLayer
    };
  },
  props: {
    disableHitDetection: {
      type: Boolean,
      default: false
    },
    style: {
      type: Object,
      default: () => ({
        symbol: {
          symbolType: "circle",
          size: 8,
          color: "#33AAFF",
          opacity: 0.9
        }
      })
    }
    // visible: {
    //     type: Boolean,
    //     default: true
    // }
  }
};
</script>

<style lang="">
</style>
