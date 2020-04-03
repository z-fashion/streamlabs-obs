<template>
<widget-editor :navItems="navItems">
    <validated-form slot="manage-wall-properties" @input="save()" v-if="loaded">
      <v-form-group title="Enable Emote Wall">
        <bool-input title="Enabled" v-model="wData.settings.enabled"/>
        <v-form-group :title="$t('Combo Count')">
          <number-input v-model="wData.settings.combo_count"/>
        </v-form-group>
        <v-form-group :title="$t('Combo Required')">
          <bool-input v-model="wData.settings.combo_required"/>
        </v-form-group>
        <v-form-group :title="$t('Combo Timeframe')">
          <number-input v-model="wData.settings.combo_timeframe"/>
        </v-form-group>
        <v-form-group :title="$t('Emote Animation Duration')">
          <number-input v-model="wData.settings.emote_animation_duration"/>
        </v-form-group>
        <v-form-group :title="$t('Emote Scale')">
          <number-input v-model="wData.settings.emote_scale"/>
        </v-form-group>
        <v-form-group :title="$t('Ignore Duplicates')">
          <bool-input v-model="wData.settings.ignore_duplicates"/>
        </v-form-group>
      </v-form-group>
    </validated-form>
  </widget-editor>
</template>

<script lang="ts" src="./EmoteWall.vue.ts"></script>
