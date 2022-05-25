import CropFiler from './CropFilter.vue'
import MaskFiler from './MaskFilter.vue'

function install(app) {
  if (install.installed) {
    return
  }

  install.installed = true

  app.component(CropFiler.name, CropFiler)
  app.component(MaskFiler.name, MaskFiler)
}

export default install

export {
  install,
  CropFiler,
  MaskFiler
}