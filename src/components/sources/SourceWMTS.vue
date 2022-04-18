<template>
  <div v-if="false">

  </div>
</template>

<script>
import Projection from 'ol/proj/Projection';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {
  get as getProjection
} from 'ol/proj';
import {
  getTopLeft,
  getWidth
} from 'ol/extent';
import {
  inject,
  onMounted,
  onUnmounted,
  watch,
  computed,
  ref
} from 'vue'
import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'
export default {
  name: 'ol-source-wmts',
  setup (props) {
    const tileLayer = inject('tileLayer')
    const {
      properties
    } = usePropsAsObjectProperties(props)
    const extent = computed(() => getProjection(properties.projection)?.getExtent() || []);
    const origin = computed(() => getTopLeft(extent.value));
    const size = computed(() => getWidth(extent.value) / 256);

    const getTileGrid = computed(() => {
      const resolutions = new Array(30);
      const matrixIds = new Array(30);
      for (let z = 0; z < 30; ++z) {
        resolutions[z] = size.value / Math.pow(2, z);
        matrixIds[z] = z;
      }

      return new WMTSTileGrid({
        origin: origin.value,
        resolutions,
        matrixIds
      });
    })

    const getWmtsOptionFromCapabilitiesUrl = async () => {
      if (props.capabilitiesUrl) {
        const parser = new WMTSCapabilities();
        const response = await fetch(props.capabilitiesUrl);
        if (response.status != 200) {
          throw 'http error when trying to get wmts meta info'
        }
        const wmtsXml = await response.text();
        if(wmtsXml.indexOf('<Capabilities') < 0){
          throw 'it looks like that this is not a valid wmts Capabilities xml file'
        }
        
        const result = parser.read(wmtsXml);

        // use the first layer by default if no layer is specified
        const layerName = props.layer ?? result.Contents.Layer[0].Identifier
        const wmtsConfig = { layer: layerName }
        // in case that `<Style>` tags are missed, create default ones
        for (let layer of result.Contents.Layer) {
          if (!layer.Style) {
            layer.Style = [{ Identifier: "default", isDefault: true }]
            console.debug(`Layer ${layer.Identifier} has no Style defined, create a default one.`)
          }

          // to fix a bug that the "TileMatrixSetLink" node of layer is not correctly parsed from the wmts capabilities xml by openlayers
          if (props.matrixSet && layer.Identifier === layerName) {
            layer.TileMatrixSetLink = [{ "TileMatrixSet": props.matrixSet }]
            wmtsConfig.matrixSet = props.matrixSet
          }
        }

        const options = optionsFromCapabilities(result, wmtsConfig);
        return options
      } else {
        return {}
      }
    }

    const wmtsOptionFromCapabilitiesUrl = ref({})

    const source = computed(() => {
      return new WMTS({
        ...properties,
        projection: typeof properties.projection === 'string' ? properties.projection : new Projection({
          ...properties.projection
        }),
        tileGrid: properties.tileGrid || getTileGrid.value,
        ...wmtsOptionFromCapabilitiesUrl.value,
        wrapX: properties.wrapX
      })
    })

    watch(source, () => {
      tileLayer.value.setSource(source.value)
    })

    watch(tileLayer, () => {
      tileLayer.value.setSource(source.value)
    })

    onMounted(async () => {
      wmtsOptionFromCapabilitiesUrl.value = await getWmtsOptionFromCapabilitiesUrl()
      tileLayer.value.setSource(source.value)
    })

    onUnmounted(() => {
      tileLayer.value.setSource(null)
    })

    return {
      tileLayer,
      source
    }
  },
  props: {
    attributions: {
      type: String
    },
    cacheSize: {
      type: Number
    },
    crossOrigin: {
      type: String
    },
    imageSmoothing: {
      type: Boolean,
      default: true
    },
    projection: {
      type: [String, Object],
      default: 'EPSG:4490'
    },
    reprojectionErrorThreshold: {
      type: Number,
      default: 0.5
    },
    tilePixelRatio: {
      type: Number,
      default: 1
    },
    format: {
      type: String,
      default: 'image/jpeg'
    },
    version: {
      type: String,
      default: '1.0.0'
    },
    matrixSet: {
      type: String
    },
    dimensions: {
      type: Object
    },
    url: {
      type: String
    },
    urls: {
      type: Array
    },
    capabilitiesUrl: {
      type: String
    },
    requestEncoding: {
      type: String,
      default: "KVP"
    },
    wrapX: {
      type: Boolean,
      default: true
    },
    transition: {
      type: Number
    },
    layer: {
      type: String
    },
    style: {
      type: String
    },
    matrixIds: {
      type: Array
    },
    resolutions: {
      type: Array
    },
    tileGrid: {
      type: Object
    }
  }
}
</script>


