import {
  IWidgetData,
  IWidgetSettings,
  WidgetDefinitions,
  WidgetSettingsService,
  WidgetType,
} from 'services/widgets';
import { WIDGET_INITIAL_STATE } from './widget-settings';
import { InheritMutations } from 'services/core/stateful-service';

interface IEmoteWallSettings extends IWidgetSettings {
  combo_count: number;
  combo_required: boolean;
  combo_timeframe: number;
  emote_animation_duration: number;
  emote_scale: number;
  enabled: boolean;
  ignore_duplicates: boolean;
}

export interface IEmoteWallData extends IWidgetData {
  settings: IEmoteWallSettings;
}

@InheritMutations()
export class EmoteWallService extends WidgetSettingsService<IEmoteWallData> {
  static initialState = WIDGET_INITIAL_STATE;

  getApiSettings() {
    return {
      type: WidgetType.EmoteWall,
      url: WidgetDefinitions[WidgetType.EmoteWall].url(this.getHost(), this.getWidgetToken()),
      previewUrl: `https://${this.getHost()}/widgets/emote-wall?token=${this.getWidgetToken()}&simulate=1`,
      dataFetchUrl: `https://${this.getHost()}/api/v5/slobs/widget/emotewall`,
      settingsSaveUrl: `https://${this.getHost()}/api/v5/slobs/widget/emotewall`,
      settingsUpdateEvent: 'emoteWallSettingsUpdate',
      customCodeAllowed: false,
      customFieldsAllowed: false,
    };
  }
}
