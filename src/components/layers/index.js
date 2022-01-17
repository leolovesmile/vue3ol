import TileLayer from './TileLayer.vue'
import ImageLayer from './ImageLayer.vue'
import VectorLayer from './VectorLayer.vue'
import VectorTileLayer from './VectorTileLayer.vue'
import AnimatedClusterLayer from './AnimatedClusterLayer'
function install (app) {

    if (install.installed) {
      return
    }

    install.installed = true
  
    app.component(TileLayer.name, TileLayer)
    app.component(ImageLayer.name, ImageLayer)
    app.component(VectorLayer.name, VectorLayer)
    app.component(VectorTileLayer.name, VectorTileLayer)
    app.component(AnimatedClusterLayer.name, AnimatedClusterLayer)
  }
  
  export default install
  
  export {
    install,
    TileLayer,
    ImageLayer,
    VectorLayer,
    VectorTileLayer,
    AnimatedClusterLayer
  }