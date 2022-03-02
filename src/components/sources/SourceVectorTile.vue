<template>
<div>
    <slot></slot>
</div>
</template>

<script>
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'
import {
    inject,
    watch,
    onMounted,
    onUnmounted,
    provide,
    computed
} from 'vue'
import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'

export default {
    name: 'ol-source-vector-tile',
    setup(props) {
        const layer = inject('vectorTileLayer')

        const {
            properties
        } = usePropsAsObjectProperties(props)

        let source = computed(() => new VectorTileSource({...properties, format: new MVT()}))

        const applySource = () => {
            layer.value.setSource(null)
            layer.value.setSource(source.value)
            layer.value.changed()
        }

        watch(properties, () => {
            applySource();
        })

        watch(layer, () => {
            applySource();
        });

        onMounted(() => {
            layer.value.setSource(source.value)
        });

        onUnmounted(() => {
            layer.value.setSource(null)
        });

        provide("vectorTileSource", source);

        return {
            layer,
            source
        }
    },
    props: {
        attributions: {
            type: [String, Array],
        },
        format: {
            type: Object
        },
        overlaps: {
            type: Boolean,
            default: true
        },
        projection: {
            type: String,
            default: 'EPSG:3857'
        },
        url: {
            type: [String, Function]
        },
        wrapX: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style lang="">

</style>
