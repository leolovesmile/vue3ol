/* eslint-disable no-unused-vars */
import {
    inject,
    watch,
    onMounted,
    ref
} from 'vue'
import Projection from 'ol/proj/Projection';
import usePropsAsObjectProperties from '../../composables/usePropsAsObjectProperties'
import {toLonLat} from 'ol/proj';
import { useVueCesium } from 'vue-cesium'


export default function use3DView(props, emit) {
    const map = inject('map');
    const {
        properties
    } = usePropsAsObjectProperties(props);

    const createProp = () => {

        return {
            ...properties,
            projection: typeof properties.projection == "string" ? properties.projection : new Projection({
                ...properties.projection
            })
        };
    };

    const rsMapVue3OlGlobalConfig = inject('rsMapVue3OlGlobalConfig')
    const $vc = useVueCesium()
    onMounted(() => {
        //TODO: 处理 zoom 等其它参数
        console.info(`use3DView is called since 3d engine is used, viewer provider is ${$vc}`)
        // const camera = ref({
            //     position: [107.033, 26.976, 5725046.53],
            //     heading: 14,
            //     pitch: -79,
            //     roll: 0.06
            //   })
            
            $vc.creatingPromise.then(readyObj => {
                const {Cesium, viewer} = readyObj
                let center = props.center
                if(center[0] === 0 && center[1] === 0 && rsMapVue3OlGlobalConfig.defaultCenter) {
                    center = rsMapVue3OlGlobalConfig.defaultCenter
                } else {
                    center = toLonLat(props.center, props.projection)
                }
                // eslint-disable-next-line no-debugger
                // debugger
                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(center[0], center[1], rsMapVue3OlGlobalConfig.defaultCameraHeigh),
                    // orientation : {
                    //     heading : window.Cesium.Math.toRadians(175.0),
                    //     pitch : window.Cesium.Math.toRadians(-35.0),
                    //     roll : 0.0
                    // }
                });
            })
    });

    return {
        viewer: $vc.viewer
    }

    // view.on('change:center', () => {
    //     emit('centerChanged', getCenter())
    //     emit('zoomChanged', getZoom())
    // });

    // view.on('change:resolution', () => emit('resolutionChanged', getResolution()));

    // view.on('change:rotation', () => emit('rotationChanged', getRotation()));

    // watch(properties, () => {
    //     let pr = createProp();
    //     view.setProperties(pr);
    //     view.applyOptions_(pr);

    // });

    // const adjustCenter = (deltaCoordinates) => view.adjustCenter(deltaCoordinates);
    // const adjustResolution = (ratio, opt_anchor) => view.adjustResolution(ratio, opt_anchor);
    // const adjustRotation = (delta, opt_anchor) => view.adjustRotation(delta, opt_anchor);
    // const adjustZoom = (delta, opt_anchor) => view.adjustZoom(delta, opt_anchor);
    // const animate = (var_args) => view.animate(var_args);
    // const beginInteraction = () => view.beginInteraction();
    // const calculateExtent = (opt_size) => view.calculateExtent(opt_size);
    // const cancelAnimations = () => view.cancelAnimations();
    // const centerOn = (coordinate, size, position) => view.centerOn(coordinate, size, position);
    // const changed = () => view.changed();
    // const dispatchEvent = (event) => view.dispatchEvent(event);
    // const endInteraction = (opt_duration, opt_resolutionDirection, opt_anchor) => view.endInteraction(opt_duration, opt_resolutionDirection, opt_anchor);
    // const fit = (geometryOrExtent, opt_options) => view.fit(geometryOrExtent, opt_options);
    // const get = (key) => view.get(key);
    // const getAnimating = () => view.getAnimating();
    // const getCenter = () => view.getCenter();
    // const getInteracting = () => view.getInteracting();
    // const getKeys = () => view.getKeys();
    // const getMaxResolution = () => view.getMaxResolution();
    // const getMaxZoom = () => view.getMaxZoom();
    // const getMinResolution = () => view.getMinResolution();
    // const getMinZoom = () => view.getMinZoom();
    // const getProjection = () => view.getProjection();
    // const getProperties = () => view.getProperties();
    // const getResolution = () => view.getResolution();
    // const getResolutionForExtent = (extent, opt_size) => view.getResolutionForExtent(extent, opt_size);
    // const getResolutionForZoom = (zoom) => view.getResolutionForZoom(zoom);
    // const getResolutions = () => view.getResolutions();
    // const getRevision = () => view.getRevision();
    // const getRotation = () => view.getRotation();
    // const getZoom = () => view.getZoom();
    // const getZoomForResolution = (resolution) => view.getZoomForResolution(resolution);

    // const setCenter = (center) => view.setCenter(center);
    // const setConstrainResolution = (enabled) => view.setConstrainResolution(enabled);
    // const setMaxZoom = (zoom) => view.setMaxZoom(zoom);
    // const setMinZoom = (zoom) => view.setMinZoom(zoom);
    // const setResolution = (resolution) => view.setResolution(resolution);
    // const setRotation = (rotation) => view.setRotation(rotation);
    // const setZoom = (zoom) => view.setZoom(zoom);



    // return {
    //     view,

    //     adjustCenter,
    //     adjustResolution,
    //     adjustRotation,
    //     adjustZoom,
    //     animate,
    //     beginInteraction,
    //     calculateExtent,
    //     cancelAnimations,
    //     centerOn,
    //     changed,
    //     dispatchEvent,
    //     endInteraction,
    //     fit,
    //     get,
    //     getAnimating,
    //     getCenter,
    //     getInteracting,
    //     getKeys,
    //     getMaxResolution,
    //     getMaxZoom,
    //     getMinResolution,
    //     getMinZoom,
    //     getProjection,
    //     getProperties,
    //     getResolution,
    //     getResolutionForExtent,
    //     getResolutionForZoom,
    //     getResolutions,
    //     getRevision,
    //     getRotation,
    //     getZoom,
    //     getZoomForResolution,

    //     setCenter,
    //     setConstrainResolution,
    //     setMaxZoom,
    //     setMinZoom,
    //     setResolution,
    //     setRotation,
    //     setZoom
    // }

}