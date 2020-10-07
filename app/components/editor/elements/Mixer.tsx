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
import { ScenesService } from 'services/scenes';

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
  @Inject() scenesService: ScenesService;

  mins = { x: 150, y: 120 };

  advancedSettingsTooltip = $t('Open advanced audio settings');
  mixerTooltip = $t('Monitor audio levels. If the bars are moving you are outputting audio.');

  showAdvancedSettings() {
    this.audioService.showAdvancedSettings();
  }

  get audioDisplayOrder() {
    if (this.scenesService.views.activeSceneMixerOrder) {
      return this.scenesService.views.activeSceneMixerOrder;
    }
    return Object.keys(this.audioSources);
  }

  handleRightClick() {
    const menu = new Menu();
    menu.append({
      label: $t('Unhide All'),
      click: () => this.editorCommandsService.executeCommand('UnhideMixerSourcesCommand'),
    });
    menu.popup();
  }

  handleSort(nodes: ISLVueTreeNode[]) {
    console.log('state', this.scenesService.views.activeSceneMixerOrder);
    console.log(
      'nodes',
      nodes.map(node => node.title),
    );
    this.scenesService.actions.setActiveSceneMixerOrder(nodes.map(node => node.title));
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
      title: (props: { node: ISLVueTreeNode }) => (
        <MixerItem audioSource={this.audioSources[props.node.title]} />
      ),
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
          <SlVueTree
            value={this.mixerList}
            onInput={(e: any) => this.handleSort(e)}
            scopedSlots={this.scopedSlots}
          />
        </Scrollable>
      </div>
    );
  }

  render() {
    return this.renderElement();
  }
}
