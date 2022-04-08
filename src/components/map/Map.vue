<template lang="">
    <vc-viewer v-if='rsMapVue3OlGlobalConfig.isCesiumEngine' :showCredit='false' :skeleton='true' :fullscreenButton	="true" :homeButton="true" :baseLayerPicker='true'>
        <vc-layer-imagery :alpha="1" :brightness="1" :contrast="1" :sort-order="20" v-if="rsMapVue3OlGlobalConfig.hasTiandituToken">
            <vc-imagery-provider-tianditu map-style="cva_c" :token="rsMapVue3OlGlobalConfig.tiandituToken"></vc-imagery-provider-tianditu>
        </vc-layer-imagery>
        <vc-layer-imagery :alpha="1" :brightness="1" :contrast="1" :sort-order="10" v-if="rsMapVue3OlGlobalConfig.hasTiandituToken">
            <vc-imagery-provider-tianditu :map-style="rsMapVue3OlGlobalConfig.tiandituLayer" :token="rsMapVue3OlGlobalConfig.tiandituToken"></vc-imagery-provider-tianditu>
        </vc-layer-imagery>
        <slot></slot>
    </vc-viewer>
<div :ref="el => mapRef = el" v-else>
    <slot></slot>
</div>
</template>

<script>
import {
    ref,
    provide,
    onMounted,
    onUnmounted,
    watch
} from "vue";

import Map from "ol/Map";
import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'
import use3DMap from '@/3dcomponents/composables/use3DMap'

export default {
    name: 'ol-map',
    setup(props, {
        emit
    }) {

        const {
            properties
        } = usePropsAsObjectProperties(props);

        const mapRef = ref(null);

        let map = new Map(properties);


        watch(properties, () => {

            map.setProperties(properties);

        });

        const rsMapVue3OlGlobalConfig = use3DMap(props, emit)

        onMounted(() => {
            if(rsMapVue3OlGlobalConfig.isCesiumEngine) {
                console.log('using 3d map engine instead of openlayers')
            } else {
                map.setTarget(mapRef.value);
            }
        });

        onUnmounted(() => {
            map.setTarget(null);
            map = null;
        });

        provide('map', map);

        const focus = () => map.focus();
        const forEachFeatureAtPixel = (pixel, callback, options = {}) => map.forEachFeatureAtPixel(pixel, callback, options)
        const forEachLayerAtPixel = (pixel, callback, layerFilter) => map.forEachLayerAtPixel(pixel, callback, layerFilter)
        const getCoordinateFromPixel = (pixel) => map.getCoordinateFromPixel(pixel);
        const refresh = () => map.refresh();
        const render = () => map.render();
        const updateSize = () => map.updateSize();

        map.on('click', (event) => emit('click', event));
        map.on('dblclick', (event) => emit('dblclick', event));
        map.on('singleclick', (event) => emit('singleclick', event));
        map.on('pointerdrag', (event) => emit('pointerdrag', event));
        map.on('pointermove', (event) => emit('pointermove', event));

        map.on('movestart', (event) => emit('movestart', event));
        map.on('moveend', (event) => emit('moveend', event));
        map.on('postrender', (event) => emit('postrender', event));
        map.on('precompose', (event) => emit('precompose', event));
        map.on('postcompose', (event) => emit('postcompose', event));

        return {
            map,
            mapRef,
            focus,
            forEachFeatureAtPixel,
            forEachLayerAtPixel,
            getCoordinateFromPixel,
            refresh,
            render,
            updateSize,
            rsMapVue3OlGlobalConfig
        }
    },
    props: {
        loadTilesWhileAnimating: {
            type: Boolean,
            default: false
        },
        loadTilesWhileInteracting: {
            type: Boolean,
            default: false
        },
        moveTolerance: {
            type: Number,
            default: 1
        },
        pixelRatio: {
            type: Number,
            default: 1
        },
        controls:{
            type:Array,
            default:()=>[]
        },
        mapEngine: {
            type: String
        }

    },

};
</script>

<style lang=""></style>
