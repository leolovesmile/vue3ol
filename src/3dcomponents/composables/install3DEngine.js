


import VueCesium from 'vue-cesium'
import 'vue-cesium/dist/index.css'
import zhCN from 'vue-cesium/es/locale/lang/zh-hans'


const defaultConfig = {
    defaultMapEngine: 'ol',
    tiandituToken: '436ce7e50d27eede2f2929307e6b33c0',
    tiandituLayer: 'img_w',
    defaultCenter: [113.227791, 23.088038],
    defaultCameraHeigh: 500000
}

/**
 * This function is to register and config VueCesium components, using the following global config items under `globalThis`/`window` namespace.
 * 
 * Global configuration items:
 * - window.CESIUM_BASE_URL
 * - window.RS_MAP_VUE3OL_GLOBAL_CONFIG
 * ```
 * interface RsMapVue3OlGlobalConfig {
 *     defaultMapEngine: string
 *     cesiumIonToken?:string,
 *     tiandituToken?:string,
 *     tiandituLayer?:string,
 *     defaultCenter?:[],
 *     defaultCameraHeigh?: number
 * }
 * ```
 */
export default function install3DEngine(app){
    const rsMapVue3OlGlobalConfig = Object.assign(defaultConfig, window.RS_MAP_VUE3OL_GLOBAL_CONFIG ?? {})
    // register VueCesium components 
    const vueCesiumConfig = {
        accessToken: rsMapVue3OlGlobalConfig.cesiumIonToken ?? 'your Cesium Ion access token',
        locale: zhCN
    }
    if(!window.CESIUM_BASE_URL) {
        console.warn('window.CESIUM_BASE_URL is not defined, use Cesium.js module in CDN')
    } else {
        vueCesiumConfig.cesiumPath = `${window.CESIUM_BASE_URL}/Cesium.js`
        console.info(`cesiumPath ${vueCesiumConfig.cesiumPath} is used`)
    }
    app.provide('rsMapVue3OlGlobalConfig', rsMapVue3OlGlobalConfig)
    app.use(VueCesium, vueCesiumConfig)
}
