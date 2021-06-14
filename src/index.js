import {
    Map,
    MapControls
} from './components'

export default function install(app) {
    
    if (install.installed) {
        return
    }

    install.installed = true

    app.use(Map)
    app.use(MapControls)
}

export {
    install,
    Map,
}