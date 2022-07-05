<template>
    <main class="mdl-layout__content">
    <div class="page-content">
      <div class="mdl-grid">
        <mdl-card v-if="room === 'global'" >
          <template v-slot:title>
            <div class="mdl-card__title">
              <h3 class="mdl-card__title-text">
                <span id='room_marker'>
                  <b v-if="room">Planning Poker</b>
                </span>
              </h3>
            </div>
          </template>
          <div class="mdl-card__actions mdl-card--border"></div>
          <Landing/>
        </mdl-card>
        <mdl-card v-else-if="hasAccess">
          <template v-slot:title>
            <span id='room_marker'>
              <b v-if="room">ROOM {{decodeURIComponent(room.toUpperCase())}}</b>
            </span>
          </template>
          <template v-slot:supporting_text>
            <span v-if="discuss === 'idle'">
              Wait for topic and discussion start.
            </span>
            <span v-if="discuss === 'discuss'">
              Estimate topic.
            </span>
            <span v-if="discuss === 'result'">
              Results of topic estimation.
            </span>
          </template>
          <div class="mdl-card__actions mdl-card--border"></div>
          <Topic/>  
          <Cards/>
          <Users/>
          <template v-slot:actions>
            <a id="change_name" v-on:click="onChangeNameClick" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Change name
            </a>
            <a v-if="voting" id="set_voting" v-on:click="setUnVoting" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Not voting
            </a>
            <a v-else id="set_voting" v-on:click="setVoting" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Voting
            </a>
            <a v-if="isOwner" id="change_options" v-on:click="changeOptions" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Settings
            </a>
            <a v-if="isOwner" id="delete_room" v-on:click="deleteRoom" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Delete room
            </a>
          </template>
          <Menu/>
        </mdl-card>
      </div>
    </div>
  </main>
</template>

<script>
  import Users from './Users.vue'
  import Cards from './Cards.vue'
  import Topic from './Topic.vue'
  import Menu from './Menu.vue'
  import Landing from "./Landing";
  import MdlCard from './mdl/MdlCard'
  export default {
    name: 'Main',
    components: {
      Users,
      Cards,
      Topic,
      Menu,
      Landing,
      MdlCard
    },
    computed: {
      room() {
        return this.$store.state.app.room;
      },
      voting() {
        return this.$store.state.app.voting;
      },
      isOwner() {
        return this.$store.state.app.isOwner;
      },
      hasAccess() {
        return this.$store.state.app.hasAccess;
      },
      discuss() {
        return this.$store.state.app.discuss;
      },
    },
    methods: {
      changeOptions() {

        this.$store.state.dialogs.options_change.showModal();
      },
      onChangeNameClick() {
        this.$store.state.dialogs.change.showModal();
      },
      playSound() {
        this.$store.state.app.emit('trigger', 'sound');
      },
      setVoting() {
        this.$store.state.app.emit('update', { vote: '', voting: true});
      },
      setUnVoting() {
        this.$store.state.app.emit('update', { vote: '', voting: false});
      },
      deleteRoom() {
        this.$store.state.app.emit('delete_room');
      },
    }
  }
</script>
