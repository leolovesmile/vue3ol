/* eslint-disable no-unused-vars */
import {
    inject,
    computed
} from 'vue'
import usePropsAsObjectProperties from '../../composables/usePropsAsObjectProperties'


export default function use3DView(props, emit) {
    const rsMapVue3OlGlobalConfig = inject('rsMapVue3OlGlobalConfig')
    rsMapVue3OlGlobalConfig.mapEngine = props.mapEngine??rsMapVue3OlGlobalConfig.defaultMapEngine
    rsMapVue3OlGlobalConfig.isCesiumEngine = rsMapVue3OlGlobalConfig.mapEngine === 'cesium'
    rsMapVue3OlGlobalConfig.hasTiandituToken = rsMapVue3OlGlobalConfig.tiandituToken ? true : false

    return {
        ...rsMapVue3OlGlobalConfig
    }
}