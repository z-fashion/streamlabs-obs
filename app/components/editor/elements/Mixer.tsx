import { Component } from 'vue-property-decorator';
import SlVueTree from 'sl-vue-tree';
import { AudioService } from 'services/audio';
import { Inject } from 'services/core/injector';
import MixerItem from 'components/MixerItem.vue';
import { $t } from 'services/i18n';
import { Menu } from 'util/menus/Menu';
import { EditorCommandsService } from 'services/editor-commands';
import BaseElement from './BaseElement';
import Scrollable from 'components/shared/Scrollable';

interface ISLVueTreeNode {
  title: string;
  isLeaf: boolean;
  isSelected: boolean;
  data: unknown;
}

@Component({})
export default class Mixer extends BaseElement {
  @Inject() audioService: AudioService;
  @Inject() editorCommandsService: EditorCommandsService;

  mins = { x: 150, y: 120 };

  advancedSettingsTooltip = $t('Open advanced audio settings');
  mixerTooltip = $t('Monitor audio levels. If the bars are moving you are outputting audio.');
  audioDisplayOrder: string[] = [];

  mounted() {
    this.audioDisplayOrder = Object.keys(this.audioSources);
  }

  showAdvancedSettings() {
    this.audioService.showAdvancedSettings();
  }

  handleRightClick() {
    const menu = new Menu();
    menu.append({
      label: $t('Unhide All'),
      click: () => this.editorCommandsService.executeCommand('UnhideMixerSourcesCommand'),
    });
    menu.popup();
  }

  handleSort(e: any) {
    console.log('firing');
    console.log(e);
  }

  get audioSources() {
    return this.audioService.views.sourcesForCurrentScene;
  }

  get mixerList() {
    return this.audioDisplayOrder.map(sourceId => {
      const audioSource = this.audioSources[sourceId];
      if (!audioSource || audioSource.mixerHidden) return null;
      return { title: sourceId, isLeaf: true, isSelected: false, data: { id: sourceId } };
    });
  }

  get scopedSlots() {
    return {
      title: (id: string) => <MixerItem audioSource={this.audioSources[id]} />,
    };
  }

  get element() {
    return (
      <div onContextmenu={() => this.handleRightClick()}>
        <div class="studio-controls-top">
          <h2
            class="studio-controls__label"
            v-tooltip={{ content: this.mixerTooltip, placement: 'bottom' }}
          >
            {$t('Mixer')}
          </h2>
          <div>
            <i
              class="icon-settings icon-button"
              onClick={() => this.showAdvancedSettings()}
              v-tooltip={{ content: this.advancedSettingsTooltip, placement: 'left' }}
            />
          </div>
        </div>
        <Scrollable className="studio-controls-selector mixer-panel">
          <SlVueTree value={this.mixerList} onInput={(e: any) => this.handleSort(e)}>
            <template scopedSlots={this.scopedSlots}></template>
          </SlVueTree>
        </Scrollable>
      </div>
    );
  }

  render() {
    return this.renderElement();
  }
}
