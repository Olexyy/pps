<!--suppress JSUnresolvedVariable -->
<template>
  <mdl-cell>
    <div class="mdl-card__supporting-text">
      Planning poker, also called Scrum poker, is a consensus-based, gamified technique for estimating, mostly used for timeboxing in Agile principles. <br>
      <a target="_blank" href="https://en.wikipedia.org/wiki/Planning_poker">Learn more.</a><br>
      Create new room or visit existing. <br>
    </div>
      <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
        <div class="mdl-card__title ">
          <span><b>Join room</b></span>
        </div>
        <div class="mdl-card__supporting-text">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
               v-bind:class="[roomNameJoinValid ? 'is-invalid is-focused' : '']">
            <input
                class="mdl-textfield__input"
                type="text"
                ref="join"
                id="join"
                name="join">
            <label class="mdl-textfield__label" for="name">Room name ...</label>
            <span class="mdl-textfield__error">Only alphanumeric, underlines and dashes allowed</span>
          </div>
        </div>
        <div class="mdl-card__actions mdl-card--border">
          <a v-on:click="onRoomJoin" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Join
          </a>
        </div>
      </div>
      <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
        <div class="mdl-card__title ">
          <span><b>Create room</b></span>
        </div>
        <div class="mdl-card__supporting-text">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label display-block"
            v-bind:class="[roomNameCreateInvalid ? 'is-invalid is-focused' : '']">
            <input
              class="mdl-textfield__input"
              type="text"
              ref="room"
              id="name"
              name="name">
            <label class="mdl-textfield__label" for="name">Room name ...</label>
            <span class="mdl-textfield__error">Only alphanumeric, underlines and dashes allowed, from 3 to 16 symbols</span>
          </div>
        </div>
        <div class="mdl-card__actions mdl-card--border">
          <a v-on:click="onOptionsClick" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Options
          </a>
          <a v-on:click="onRoomCreate" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Create
          </a>
        </div>
      </div>
  </mdl-cell>
</template>

<script>
  import MdlCell from "./mdl/MdlCell12";
  import Md5 from "crypto-js/md5";
  export default {
    components: {MdlCell},
    name: 'Landing',
    methods: {
      onRoomCreate(e) {
        e.preventDefault();
        e.stopPropagation();
        const name = this.$refs.room.value;
        if (!this.validName(name)) {
          this.$refs.room.parentNode.classList.add('is-invalid');
        }
        else {
          // Collect props.
          const state = {};
          state.sound = document.getElementById('option__sound').checked;
          state.proposeMax = document.getElementById('option__propose_max').checked;
          let pass = document.getElementById('option__pass').value;
          if (pass.length) {
            pass = Md5(pass).toString();
          }
          this.$store.state.app.emit('create_room', name, this.$store.state.app.getLocalData().uuid, pass, state);
        }
      },
      onOptionsClick() {
        this.$store.state.dialogs.options.showModal();
      },
      onRoomJoin(e) {
        e.preventDefault();
        e.stopPropagation();
        const name = this.$refs.join.value;
        if (!this.validName(name)) {
          this.$refs.join.parentNode.classList.add('is-invalid');
        }
        else {
          this.$store.state.app.emit('join_room', name);
        }
      },
      handleEventRoom(e) {
        const room = e.target.value;
        if (room) {
          if (!room.length) {
            e.target.parentNode.classList.add('is-invalid');
          }
          if (Object.keys(this.$store.state.app.rooms).includes(room)) {
            e.target.parentNode.classList.add('is-invalid');
          }
          else {
            e.target.parentNode.classList.remove('is-invalid');
            window.location.href = `/room/${room}`;
          }
        }
      },
      validName(str) {
        if (str === 'global') {
          return false;
        }
        const pattern = new RegExp('^[A-Za-z\\d_-]{3,16}$','i');
        return !!pattern.test(str);
      },
      onBlur(e) {
        this.handleEvent(e);
      },
      onKeyPress(e) {
        if (e.keyCode === 13) {
          this.handleEvent(e);
          e.target.blur();
          e.target.parentNode.classList.remove('is-focused');
        }
      },
      handleEvent(e) {
        this.$store.state.app.emit('update', {}, {topic: e.target.value});
      },
      onChange(e) {
        this.handleClasses(e.target, e.target.value);
      },
      handleClasses(el, value) {
        if (value) {
          el.parentNode.classList.add('is-dirty');
        }
        else {
          el.parentNode.classList.remove('is-dirty');
        }
      },
    },
    computed: {
      roomNameCreateInvalid: function () {
        return !this.$store.state.app.roomNameCreateValid;
      },
      roomNameJoinValid: function () {
        return !this.$store.state.app.roomNameJoinValid;
      },
      room() {
        return this.$store.state.app.room;
      },
      topic: {
        get() {
          const el = document.getElementById('topic');
          if (el) {
            this.handleClasses(document.getElementById('topic'), this.$store.state.app.topic);
          }
          return this.$store.state.app.topic;
        },
        set() { }
      },
      validTopic() {
        return this.$store.state.app.topic && this.validUrl(this.$store.state.app.topic);
      }
    },
  }
</script>
