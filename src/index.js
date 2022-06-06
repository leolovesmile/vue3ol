import {
    Map,
    Layers,
    Sources,
    MapControls,
    Geometries,
    Styles,
    Interactions,
    Animations,
    Filters
} from './components'

import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import { Projection,addProjection} from 'ol/proj';
import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'

import 'ol-contextmenu/dist/ol-contextmenu.css'
import './assets/style.css'

import feature from 'ol/Feature';
import * as geom from 'ol/geom/';
import * as format from 'ol/format';
import * as loadingstrategy from 'ol/loadingstrategy';
import * as selectconditions from 'ol/events/condition';
import * as extent from 'ol/extent';
import * as animations from 'ol/easing'

function registerProjections() {
    proj4.defs("EPSG:4490","GEOGCS[\"China Geodetic Coordinate System 2000\",DATUM[\"China_2000\",SPHEROID[\"CGCS2000\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"1024\"]],AUTHORITY[\"EPSG\",\"1043\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4490\"]]");
    register(proj4);
    var projection = new Projection({
      code: 'EPSG:4490', 
      units: 'degrees',
      axisOrientation: 'neu'
    });
    projection.setExtent([-180, -90, 180, 90]);
    projection.setWorldExtent([-180, -90, 180, 90]);
    addProjection(projection);
}

export default function install(app) {
    
    if (install.installed) {
        console.error("OPENLAYERS MAP ALREADY INSTALLED")
        return
    }

    install.installed = true

    registerProjections()

    app.use(Map)
    app.use(Layers)
    app.use(Sources)
    app.use(MapControls)
    app.use(Geometries)
    app.use(Styles);
    app.use(Interactions);
    app.use(Animations);
    app.use(Filters)

    app.provide('ol-feature',feature)
    app.provide('ol-geom',geom)
    app.provide('ol-animations',animations)
    app.provide('ol-format',format)
    app.provide('ol-loadingstrategy',loadingstrategy)
    app.provide('ol-selectconditions',selectconditions)
    app.provide('ol-extent',extent)
}

export {
    install,
    Map,
    Layers,
    Sources,
    MapControls,
    Geometries,
    Styles,
    Interactions,
    Animations
  
}