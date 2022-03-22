<template>
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:400px">

    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="'EPSG:4326'" />
    <ol-tile-layer ref="osmLayer" title="OSM">
      <ol-source-osm />
    </ol-tile-layer>
    <!-- <ol-attribution-control /> -->
    <!-- <ol-image-layer>
      <ol-source-image-static :url="imgUrl" :imageSize="size" :imageExtent="extent" :projection="projection">
      </ol-source-image-static>
    </ol-image-layer> -->

    <ol-vector-layer>
      <ol-source-vector>
        <ol-basic-draw :type="'LineString'" />
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script>
import {
  ref, reactive
} from 'vue'
import {
  onMounted,

} from 'vue'
export default {
  setup () {
    const zoom = ref(2)
    const rotation = ref(0)
    const size = ref([1024, 968])
    const center = ref([108.61083984375,
      28.65203063036226,
    ])
    const extent = ref([
      107.61083984375,
      28.65203063036226, 114.78515624999999,
      35.67514743608467])
    const projection =
      reactive({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent,
      })
    onMounted(() => {
      console.log(projection)
    })
    const imgUrl = ref('http://172.16.67.185:6001/apiServer/rsmis-gf02-report/D:/zh1/image/2022-02-28/0DA5E3D714024681B914B9D9BFFEA9F2.jpg');
    return {
      center,
      projection,
      zoom,
      rotation,
      size,
      extent,
      imgUrl,
    }
  },
}
</script>

<style>
</style>