import { Component } from 'vue-property-decorator';

import BaseElement from './BaseElement';

@Component({})
export default class Mixer extends BaseElement {
  $refs: {
    webview: any;
  };

  mounted() {
    const webview = this.$refs.webview;
    webview.addEventListener('dom-ready', () => {
      webview.openDevTools();
    });
  }

  get volmetersSrc() {
    const mainWindowSrc = window.location.href.split('?')[0];
    return `${mainWindowSrc}?windowId=volmeters&componentName=MixerFrame&isFullScreen=true`;
  }

  get element() {
    return (
      <webview
        ref="webview"
        src={this.volmetersSrc}
        nodeintegration={true}
        style={{ left: '17px', right: '17px', height: '100%' }}
      />
    );
  }

  render() {
    return this.renderElement();
  }
}
