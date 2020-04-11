import { Component } from 'vue-property-decorator';
import { AudioService } from 'services/audio';
import { Inject } from 'services/core/injector';
import MixerItem from 'components/MixerItem.vue';
import { Menu } from 'util/menus/Menu';
import { EditorCommandsService } from 'services/editor-commands';
import Volmeters from './Volmeters';
import { CustomizationService } from 'services/customization';
import TsxComponent from 'components/tsx-component';

@Component({})
export default class MixerFrame extends TsxComponent {
  @Inject() audioService: AudioService;
  @Inject() editorCommandsService: EditorCommandsService;
  @Inject() customizationService: CustomizationService;

  mins = { x: 150, y: 120 };

  advancedSettingsTooltip = 'Open advanced audio settings';
  mixerTooltip = 'Monitor audio levels. If the bars are moving you are outputting audio.';
  needToRenderVolmetes: boolean = (() => {
    // render volmeters without hardware acceleration only if we don't have the webgl context
    const canvas = document.createElement('canvas');
    return !canvas.getContext('webgl');
  })();

  get performanceMode() {
    return this.customizationService.state.performanceMode;
  }

  showAdvancedSettings() {
    this.audioService.showAdvancedSettings();
  }

  handleRightClick() {
    const menu = new Menu();
    menu.append({
      label: 'Unhide All',
      click: () => this.editorCommandsService.executeCommand('UnhideMixerSourcesCommand'),
    });
    menu.popup();
  }

  get audioSources() {
    return this.audioService.views.sourcesForCurrentScene.filter(source => {
      return !source.mixerHidden;
    });
  }

  render() {
    return (
      <div onContextmenu={() => this.handleRightClick()}>
        <div class="studio-controls-top">
          <h2
            class="studio-controls__label"
            v-tooltip={{ content: this.mixerTooltip, placement: 'bottom' }}
          >
            'Mixer'
          </h2>
          <div>
            <i
              class="icon-settings icon-button"
              onClick={() => this.showAdvancedSettings()}
              v-tooltip={{ content: this.advancedSettingsTooltip, placement: 'left' }}
            />
          </div>
        </div>
        <div class="studio-controls-selector mixer-panel">
          <div style={{ position: 'relative' }}>
            {this.audioSources.length && !this.performanceMode && (
              <Volmeters style={{ left: '17px', right: '17px', height: '100%' }} />
            )}
            {this.audioSources.map(audioSource => (
              <MixerItem
                audioSource={audioSource}
                key={audioSource.sourceId}
                volmetersEnabled={this.needToRenderVolmetes}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
