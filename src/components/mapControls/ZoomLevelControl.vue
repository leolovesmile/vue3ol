<template lang="">
<div v-if="false">

</div>
</template>

<script>
import useControl from '@/composables/useControl'
import {Control} from 'ol/control';
import {listen} from 'ol/events';

class OlZoomLevelControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control '
    element.className += options.className !== undefined ? options.className : 'ol-zoom-level-control';
    element.innerHTML = '';

    super({
      element: element,
      target: options.target,
    });

    this.on;
    
    this.once;

    this.un;

    let placeholder = '&#160;';

    if ('undefinedHTML' in options) {
      // deprecated behavior
      if (options.undefinedHTML !== undefined) {
        placeholder = options.undefinedHTML;
      }
    } else if ('placeholder' in options) {
        placeholder = String(options.placeholder);
    }

    this.placeholder_ = placeholder;

    this.renderedHTML_ = element.innerHTML;
  }

  updateHTML_() {
    const zoom = this.getMap().getView().getZoom()
    let html = typeof zoom === 'number' ? zoom.toFixed(0) : this.placeholder_;
    if (!this.renderedHTML_ || html !== this.renderedHTML_) {
      this.element.innerHTML = html;
      this.renderedHTML_ = html;
    }
  }

  setMap(map) {
    super.setMap(map);
    if (map) {
      this.listenerKeys.push(
        listen(map.getView(), 'change:resolution', this.updateHTML_, this)
      );
      this.updateHTML_();
    }
  }

}

export default {
    name: 'ol-zoom-level-control',
    setup(props,context) {
        const {
            control
        } = useControl(OlZoomLevelControl, props,context);
        return {
            control
        }
    },
    props: {
        className: {
            type: String,
            default: 'ol-zoom-level-control'
        },
        target: {
            type: HTMLElement,
        },
        undefinedHTML: {
            type: String,
            default: '&#160;'
        }
    }
}
</script>

<style>
.ol-zoom-level-control {
  top: .5em;
  right: .5em;
  font-size: 20px;
}
</style>
