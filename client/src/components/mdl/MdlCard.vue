<template>
  <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col">
    <div v-if="$slots.title" class="mdl-card__title">
      <h3 class="mdl-card__title-text">
        <slot name="title"></slot>
      </h3>
    </div>
    <div v-if="$slots.supporting_text" class="mdl-card__supporting-text">
      <slot name="supporting_text"></slot>
    </div>
    <slot></slot>
    <div v-if="$slots.actions" class="mdl-card__actions mdl-card--border">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
