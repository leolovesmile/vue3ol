
<template lang="">
<slot>

</slot>
</template>

<script>
import {
  provide,
  inject,
  watch,
  onMounted,
  onUnmounted,
  toRefs,
} from 'vue'

import Draw from 'ol/interaction/Draw';
import { createBox } from 'ol/interaction/Draw';
import { getArea, getLength } from 'ol/sphere';
import { LineString, Polygon } from 'ol/geom';
import Overlay from 'ol/Overlay';
import { unByKey } from 'ol/Observable';
export default {
  name: 'ol-basic-draw',
  emits: ["drawstart", "drawend"],
  setup (props, {
    emit
  }) {

    const map = inject("map");
    const source = inject("vectorSource");
    let measureTooltipElement;
    let measureTooltip;
    let helpTooltipElement;
    let helpTooltip;
    const {
      type,
      clickTolerance,
      dragVertexDelay,
      snapTolerance,
      stopClick,
      maxPoints,
      minPoints,
      finishCondition,
      geometryFunction,
      geometryName,
      condition,
      freehand,
      freehandCondition,
      wrapX, drawShapeMore,
      isMeasure, disabled
    } = toRefs(props);

    let createDraw = () => {
      let listener;
      let draw = new Draw({
        source: source.value,
        type: type.value == 'rectangle' ? 'Circle' : type.value,
        clickTolerance: clickTolerance.value,
        dragVertexDelay: dragVertexDelay.value,
        snapTolerance: snapTolerance.value,
        stopClick: stopClick.value,
        maxPoints: maxPoints.value,
        minPoints: minPoints.value,
        finishCondition: finishCondition.value,
        // 拉框选择矩形
        geometryFunction: type.value == 'rectangle' ? createBox() : geometryFunction.value,
        geometryName: geometryName.value,
        condition: condition.value,
        freehand: freehand.value,
        freehandCondition: freehandCondition.value,
        wrapX: wrapX.value,
      });
      draw.on('drawstart', (event) => {
        //   如果开启测量工具
        if (isMeasure.value) {
          createMeasureTooltip();
          const sketch = event.feature;
          let tooltipCoord = event.coordinate;
          listener = sketch.getGeometry().on('change', (evt) => {
            const geom = evt.target;
            let output;
            if (geom instanceof Polygon) {
              output = formatArea(geom);
              tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
              output = formatLength(geom);
              tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
          });
        }
        emit('drawstart', event)
      })

      draw.on('drawend', (event) => {
        //   如果开启测量工具
        if (isMeasure.value) {
          measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
          measureTooltip.setOffset([0, -7]);
          measureTooltipElement = null;
          unByKey(listener);
        }
        if (!drawShapeMore.value) {
          map.removeInteraction(draw);
          map.un('pointermove', pointerMoveHandler)
          map.removeOverlay(helpTooltip)
        }
        emit('drawend', event)

      })

      return draw;

    };
    // 测距
    const formatLength = (line) => {
      const sourceProj = map.getView().getProjection();//获取投影坐标系
      const length = getLength(line, { projection: sourceProj });
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
      }
      return output;
    };
    const createHelpTooltip = () => {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
      helpTooltipElement = document.createElement('div');
      helpTooltipElement.className = 'ol-tooltip hidden';
      helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
      });
      map.addOverlay(helpTooltip);
    }
    const createMeasureTooltip = () => {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
      measureTooltipElement = document.createElement('div');
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
      measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false,
      });
      map.addOverlay(measureTooltip);
    }

    // 测面
    const formatArea = (polygon) => {
      const sourceProj = map.getView().getProjection();//获取投影坐标系
      const area = getArea(polygon, { projection: sourceProj });
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
      } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
      }
      return output;
    };
    let draw = createDraw();
    const pointerMoveHandler = function (evt) {
      if (evt.dragging) {
        return;
      }
      /** @type {string} */
      let helpMsg = '单击开始绘制，双击结束';

      helpTooltipElement.innerHTML = helpMsg;
      helpTooltip.setPosition(evt.coordinate);

      helpTooltipElement.classList.remove('hidden');
    };
    watch([type,
      clickTolerance,
      dragVertexDelay,
      snapTolerance,
      stopClick,
      maxPoints,
      minPoints,
      finishCondition,
      geometryFunction,
      geometryName,
      condition,
      freehand,
      freehandCondition,
      wrapX, disabled
    ], () => {
      map.removeInteraction(draw);
      draw = createDraw();
      map.addInteraction(draw);
      source.value.clear()
      map.removeOverlay(helpTooltip)
      map.removeOverlay(measureTooltip)
      measureTooltip.setPosition(undefined)
      createHelpTooltip();
      draw.changed()
      map.changed()
      map.on('pointermove', pointerMoveHandler);
    })
    onMounted(() => {
      map.addInteraction(draw);
      createHelpTooltip();
      map.on('pointermove', pointerMoveHandler);
    });

    onUnmounted(() => {
      map.removeInteraction(draw);
      map.un('pointermove', pointerMoveHandler)
    });

    provide('stylable', draw)

  },
  props: {

    type: {
      type: String,
      required: false,
      default: 'Polygon'//Polygon 矩形 Circle圆  Point点   LineString线
    },
    clickTolerance: {
      type: Number,
      default: 6
    },
    dragVertexDelay: {
      type: Number,
      default: 500
    },
    snapTolerance: {
      type: Number,
      default: 12
    },
    stopClick: {
      type: Boolean,
      default: false
    },
    maxPoints: {
      type: Number,
    },
    minPoints: {
      type: Number,

    },
    finishCondition: {
      type: Function,

    },
    geometryFunction: {
      type: Function,

    },
    geometryName: {
      type: String,

    },
    condition: {
      type: Function,

    },
    freehand: {
      type: Boolean,
      default: false

    },
    freehandCondition: {
      type: Function,

    },
    wrapX: {
      type: Boolean,
      default: false

    },
    // 允许绘制多个图形
    drawShapeMore: {
      type: Boolean,
      default: true
    },
    // 是否开启测量工具
    isMeasure: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }

}
</script>

<style >
.overlay-content {
  background: rgba(255, 255, 255, 0.5);
  padding: 0 10px;
}
.ol-tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}
.ol-tooltip-measure {
  opacity: 1;
  font-weight: bold;
}
.ol-tooltip-static {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}
.ol-tooltip-measure:before,
.ol-tooltip-static:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}
.ol-tooltip-static:before {
  border-top-color: #ffcc33;
}
</style>
