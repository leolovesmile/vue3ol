import SourceXYZ from './SourceXYZ.vue'
import SourceOSM from './SourceOSM.vue'
import SourceImageStatic from './SourceImageStatic.vue'
import SourceWMTS from './SourceWMTS.vue'
import SourceVector from './SourceVector.vue'
import SourceVectorTile from './SourceVectorTile.vue'
import SourceCluster from './SourceCluster.vue'
import SourceBingMaps from './SourceBingMaps.vue'
import SourceTianDiTu from './SourceTianDiTu.vue'
import SourceImageWMS from './SourceImageWMS.vue'
import SourceImageArcgisRest from './SourceImageArcgisRest.vue'
import SourceWebglPoints from './SourceWebglPoints.vue'

function install(app) {

  if (install.installed) {
    return
  }

  install.installed = true

  app.component(SourceXYZ.name, SourceXYZ)
  app.component(SourceOSM.name, SourceOSM)
  app.component(SourceImageStatic.name, SourceImageStatic)
  app.component(SourceWMTS.name, SourceWMTS)
  app.component(SourceVector.name, SourceVector)
  app.component(SourceVectorTile.name, SourceVectorTile)
  app.component(SourceCluster.name, SourceCluster)
  app.component(SourceBingMaps.name, SourceBingMaps)
  app.component(SourceTianDiTu.name, SourceTianDiTu)
  app.component(SourceImageWMS.name, SourceImageWMS)
  app.component(SourceImageArcgisRest.name, SourceImageArcgisRest)
  app.component(SourceWebglPoints.name, SourceWebglPoints)
}

export default install

export {
  install,
  SourceXYZ,
  SourceOSM,
  SourceImageStatic,
  SourceWMTS,
  SourceVectorTile,
  SourceVector,
  SourceCluster,
  SourceTianDiTu,
  SourceImageWMS,
  SourceWebglPoints
}