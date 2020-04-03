import { Component } from 'vue-property-decorator';
import WidgetEditor from 'components/windows/WidgetEditor.vue';
import WidgetSettings from './WidgetSettings.vue';
import { inputComponents } from 'components/widgets/inputs';
import VFormGroup from 'components/shared/inputs/VFormGroup.vue';
import { IEmoteWallData, EmoteWallService } from 'services/widgets/settings/emote-wall';
import { $t } from 'services/i18n';

import ValidatedForm from 'components/shared/inputs/ValidatedForm';
@Component({
  components: {
    WidgetEditor,
    VFormGroup,
    ValidatedForm,
    ...inputComponents,
  },
})
export default class EmoteWall extends WidgetSettings<IEmoteWallData, EmoteWallService> {
  navItems = [
    { value: 'manage-wall', label: $t('Manage Emote Wall') },
    { value: 'source', label: $t('Source') },
  ];
}
