
<template lang="">
     <ol-overlay v-for="(x,index) in overLayOptions" :key="index" :position='x.position' :offset='[-50,5]'>
            <!-- eslint-disable-next-line vue/no-unused-vars -->
    <template  v-slot="slotProps">
            <div class="overlay-content" >
                <p v-html="x.html"></p>
            </div>
        </template>
    </ol-overlay >
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
  ref
  //computed
} from 'vue'

import Draw from 'ol/interaction/Draw';
import { createBox } from 'ol/interaction/Draw';
import { getArea, getLength } from 'ol/sphere';
import { LineString, Polygon } from 'ol/geom';

export default {
  name: 'ol-basic-draw',
  emits: ["drawstart", "drawend"],
  setup (props, {
    emit
  }) {

    const map = inject("map");
    const source = inject("vectorSource");
    let overLayOptions = ref([{}])
    let index = 0
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
      isMeasure
    } = toRefs(props);

    let createDraw = () => {

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
      //   let listener = null;
      draw.on('drawstart', (event) => {
        //   如果开启测量工具
        if (isMeasure.value) {
          overLayOptions.value.push({ position: [], html: '' })
          const sketch = event.feature;
          let tooltipCoord = event.coordinate;
          sketch.getGeometry().on('change', (evt) => {

            const geom = evt.target;
            let output;
            if (geom instanceof Polygon) {
              output = formatArea(geom);
              tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
              output = formatLength(geom);
              tooltipCoord = geom.getLastCoordinate();
            }
            overLayOptions.value[index] = { position: tooltipCoord, html: output }
          });
        }
        emit('drawstart', event)
      })

      draw.on('drawend', (event) => {
        //   如果开启测量工具
        if (isMeasure.value) {
          index++
        }

        if (!drawShapeMore.value) {
          map.removeInteraction(draw);
        }
        emit('drawend', event)

      })

      return draw;

    };
    // 测距
    // eslint-disable-next-line no-unused-vars
    const formatLength = (line) => {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
      }
      return output;
    };

    // 测面
    // eslint-disable-next-line no-unused-vars
    const formatArea = (polygon) => {
      const area = getArea(polygon);
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
      } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
      }
      return output;
    };
    let draw = createDraw();

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
      wrapX
    ], () => {

      map.removeInteraction(draw);
      draw = createDraw();
      map.addInteraction(draw);
      draw.changed()

      map.changed()
    })


    onMounted(() => {
      map.addInteraction(draw);

    });

    onUnmounted(() => {
      map.removeInteraction(draw);
    });

    provide('stylable', draw)
    return { overLayOptions }

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
      default: true
    }
  }

}
</script>

<style >
.overlay-content {
  background: rgba(255, 255, 255, 0.5);
  padding: 0 10px;
}
</style>
