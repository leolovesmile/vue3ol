<template lang="">
<div v-if="false">

</div>
</template>

<script>
import Swipe from 'ol-ext/control/Swipe';
import useControl from '@/composables/useControl'
import { watch, toRefs } from "vue"
export default {
    name: 'ol-swipe-control',
    setup(props,context) {
        const {
            control
        } = useControl(Swipe, props,context);

        const {
            layerList
        } = toRefs(props)

        watch(layerList, (newVal, oldVal)=>{
            oldVal.forEach((layer) => {
                control.value.removeLayer(layer)
            })

            newVal.forEach((layer,index) => {
                control.value.addLayer(layer,index==1 ? true:false)
            })
        })

        layerList.value.forEach((layer,index) => {
            control.value.addLayer(layer,index==1 ? true:false)
        })

        return {
            control
        }
    },
    props: {
        layerList: {
            type: Array,

        },
        className: {
            type: String,
            default:"ol-swipe"
        },
        position: {
            type: Number,
            default: 0.5
        },
        orientation: {
            type: String,
            default: 'vertical'
        },

    }
}
</script>

<style lang="">

</style>
