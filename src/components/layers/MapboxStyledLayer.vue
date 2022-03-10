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
import MapboxVector from 'ol/layer/MapboxVector';
import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'
import BaseLayer from "./BaseLayer"

export default {
    extends: BaseLayer,
    name: 'ol-mvt-style-layer',
    setup(props) {
        const map = inject('map')

        const {
            properties
        } = usePropsAsObjectProperties(props);

        const mapboxVector = computed(() => new MapboxVector(properties))

        watch(properties, () => {
            mapboxVector.value.setProperties(properties);
        })

        onMounted(() => {
            map.addLayer(mapboxVector.value);
        })

        onUnmounted(() => {
            map.removeLayer(mapboxVector.value)
        })

        provide('vectorTileLayer', mapboxVector)
        provide('stylable', mapboxVector)

        return {
            mapboxVector
        }
    },
    props: {
        renderBuffer: {
            type: Number,
            default: 100
        },
        renderMode: {
            type: String,
            default: 'hybrid'
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
}
</script>

<style lang="">

</style>
