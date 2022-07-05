<template>
  <div class="mdl-card__menu">
    <span v-if="time">{{time}}</span>
    <span v-if="isOwnerOrAdmin">
      <button
        v-if="discuss === 'result'"
        id="discuss"
        v-on:click="onDiscussClick"
        class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
        Clear data
      </button>
      <button
        v-else-if="discuss === 'discuss'"
        id="discuss"
        v-on:click="onDiscussClick"
        class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
        Stop discussion
      </button>
      <button
        :disabled="topic === '' && discuss === 'idle'"
        v-else
        id="discuss"
        v-on:click="onDiscussClick"
        class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
        Start discussion
      </button>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'Menu',
    computed: {
      time() {
        return this.$store.state.app.timer.time;
      },
      discuss() {
        return this.$store.state.app.discuss;
      },
      topic() {
        return this.$store.state.app.topic;
      },
      isOwnerOrAdmin() {
        return this.$store.state.app.isOwnerOrAdmin();
      },
    },
    methods: {
      onDiscussClick() {
				if (this.$store.state.app.discuss === 'idle') {
          this.$store.state.app.emit('update', {}, {discuss: 'discuss'});
          this.$store.state.app.emit('trigger', 'sound');
				}
        else if (this.$store.state.app.discuss === 'discuss') {
					this.$store.state.app.emit('update', {}, {discuss: 'result'});
				}
				else {
					this.$store.state.app.emit('bulk', { vote: '' }, { discuss: 'idle', topic: '' });
				}
      }
    }
  }
</script>
