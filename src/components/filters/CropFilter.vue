<template>
<div v-if="false">

</div>
</template>

<script>
import Crop from 'ol-ext/filter/Crop';
import {
    inject,
    watch,
    onMounted,
    onUnmounted
} from 'vue'

export default {
    name: 'ol-filter-crop',
    setup(props) {
        const layer =  inject('tileLayer') || inject('imageLayer') || inject('vectorTileLayer') || inject('vectorLayer') || inject('webglPointsLayer');

        let cropFilter;
        if(layer) {
            cropFilter = new Crop({
                inner: props.inner,
                wrapX: props.wrapX,
                feature: props.feature
            });

            watch(layer, () => {
                layer.value.addFilter(cropFilter)
            });
        }

        onMounted(() => {
            if(cropFilter && layer) {
                layer.value.addFilter(cropFilter)
            }
        });

        onUnmounted(() => {
            if(cropFilter && layer) {
                layer.value.removeFilter(cropFilter)
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
        }
    }

}
</script>

