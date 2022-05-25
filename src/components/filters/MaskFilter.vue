<template>
<div v-if="false">

</div>
</template>

<script>
import Mask from 'ol-ext/filter/Mask';
import {
    inject,
    watch,
    onMounted,
    onUnmounted
} from 'vue'

export default {
    name: 'ol-filter-mask',
    setup(props) {
        const layer =  inject('tileLayer') || inject('imageLayer') || inject('vectorTileLayer') || inject('vectorLayer') || inject('webglPointsLayer');

        let maskFilter;
        if(layer) {
            maskFilter = new Mask({
                inner: props.inner,
                wrapX: props.wrapX,
                feature: props.feature,
                fill: props.fill
            });

            watch(layer, () => {
                layer.value.addFilter(maskFilter)
            });
        }

        onMounted(() => {
            if(layer && maskFilter){
                layer.value.addFilter(maskFilter)
            }
        });

        onUnmounted(() => {
            if(layer && maskFilter){
                layer.value.removeFilter(maskFilter)
            }
        });

        return {
        }
    },
    props: {
        inner: {
            type: Boolean,
            default: true
        },
        wrapX: {
            type: Boolean,
            default: false
        },
        feature: {
            type: Object,
            required: true
        },
        fill: {
            type: Object,
            required: true
        },
    }

}
</script>

