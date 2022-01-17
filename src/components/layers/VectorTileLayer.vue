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
import VectorTileLayer from 'ol/layer/VectorTile'
import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'
import BaseLayer from "./BaseLayer"

export default {
    extends: BaseLayer,
    name: 'ol-vector-tile-layer',
    setup(props) {
        const map = inject('map')

        const {
            properties
        } = usePropsAsObjectProperties(props);

        const vectorTileLayer = computed(() => new VectorTileLayer(properties))

        watch(properties, () => {
            vectorTileLayer.value.setProperties(properties);
        })

        onMounted(() => {
            map.addLayer(vectorTileLayer.value);
        })

        onUnmounted(() => {
            map.removeLayer(vectorTileLayer.value)
        })

        provide('vectorTileLayer', vectorTileLayer)
        provide('stylable', vectorTileLayer)

        return {
            vectorTileLayer
        }
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
            type: Function,
        },
        updateWhileInteracting: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="">

</style>
