<template lang="">
<div>
    <slot></slot>
</div>
</template>

<script>
import {
    inject,
    provide,
    onUnmounted,
    onMounted,
    watch,
    computed,
} from 'vue'

import WebGLPointsLayer from 'ol/layer/WebGLPoints'
import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'

import BaseLayer from "./BaseLayer"
export default {
    extends: BaseLayer,
    name: 'ol-webglpoints-layer',
    setup(props) {
        const map = inject('map');
        const {
            properties
        } = usePropsAsObjectProperties(props);
        const webglPointsLayer = computed(() => new WebGLPointsLayer(properties));
        watch(properties, () => {
            webglPointsLayer.value.setProperties(properties);
            // TODO: bug - `setVisible` does not work for webglPointsLayer
            // webglPointsLayer.value.setVisible(properties.visible);
        });
        onMounted(() => {
            map.addLayer(webglPointsLayer.value);
        });
        onUnmounted(() => {
            try {
                webglPointsLayer.value.dispose();
            } catch (e) {
                console.error(`get error ${e} when try to dispose webgl points layer`);
            }
            map.removeLayer(webglPointsLayer.value)
        });
        provide('webglPointsLayer', webglPointsLayer);
        return {
            webglPointsLayer
        }
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
                    symbolType: 'circle',
                    size: 8,
                    color: '#33AAFF',
                    opacity: 0.9
                }
            })
        },
        // visible: {
        //     type: Boolean,
        //     default: true
        // }
    }
}
</script>

<style lang="">

</style>
