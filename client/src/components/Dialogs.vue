<template>
    <span>
      <dialog class="mdl-dialog" ref="name_dialog" id="name_dialog">
        <h4 class="mdl-dialog__title">Name yourself</h4>
        <div class="mdl-dialog__content">
          <p>Field is required, cannot match any existing name.</p>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              v-model="userName"
              class="mdl-textfield__input"
              type="text"
              data-ref="name_dialog"
              id="name"
              name="name"
              ref="name_input">
            <label class="mdl-textfield__label" for="name">Name...</label>
          </div>
        </div>
        <div class="mdl-dialog__actions">
          <button data-ref="name_dialog" v-on:click="onNameInput" type="button" class="mdl-button mdl-button--colored">Join</button>
        </div>
      </dialog>
      <dialog class="mdl-dialog" ref="change" id="change_dialog">
        <h4 class="mdl-dialog__title">Change name</h4>
        <div class="mdl-dialog__content">
          <p>Field is required, cannot match any existing name, press ESC to cancel.</p>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
              v-model="userName"
              data-ref="change"
              class="mdl-textfield__input"
              type="text"
              id="name"
              name="name"
              ref="name_change">
          <label class="mdl-textfield__label" for="name">Name...</label>
          </div>
        </div>
        <div class="mdl-dialog__actions">
          <button data-ref="change" v-on:click="onClose" type="button" class="mdl-button mdl-button--colored">Cancel</button>
          <button data-ref="change" v-on:click="onNameChange" type="button" class="mdl-button mdl-button--colored">Change</button>
        </div>
      </dialog>
      <dialog class="mdl-dialog" ref="start" id="start_dialog">
        <h4 class="mdl-dialog__title">Starting</h4>
        <div class="mdl-dialog__content">
          <p>
          Please wait for connection.
          </p>
        </div>
      </dialog>
      <dialog class="mdl-dialog" ref="error" id="error_dialog">
        <h4 class="mdl-dialog__title">Error</h4>
        <div class="mdl-dialog__content">
          <p>
          Something went wrong, try reload page.
          </p>
        </div>
      </dialog>
      <dialog class="mdl-dialog" ref="not_exist" id="not_exist_dialog">
        <h4 class="mdl-dialog__title">Error</h4>
        <div class="mdl-dialog__content">
          <p>
            Room not exists. Please <a href="/">create room</a>.
          </p>
        </div>
      </dialog>
      <dialog class="mdl-dialog" ref="pass_dialog" id="pass_dialog">
        <h4 class="mdl-dialog__title">Password</h4>
        <div class="mdl-dialog__content">
          <p>This room requires password. Input password to join room.</p>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-bind:class="[passAttempt === 'fail' ? 'is-invalid is-focused' : '']">
          <input
              ref="pass_input"
              data-ref="pass_dialog"
              class="mdl-textfield__input"
              type="password"
              id="pass"
              name="pass">
          <label class="mdl-textfield__label" for="pass">Password...</label>
          </div>
        </div>
        <div class="mdl-dialog__actions">
          <button data-ref="options" v-on:click="onPassJoin" type="button" class="mdl-button mdl-button--colored">Join</button>
        </div>
      </dialog>
      <dialog class="mdl-dialog no-close" ref="options" id="options">
        <h4 class="mdl-dialog__title">Room options</h4>
        <div class="mdl-dialog__content">
          <div>Choose room options.</div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
                class="mdl-textfield__input"
                type="password"
                id="option__pass"
                name="option__pass">
            <label class="mdl-textfield__label" for="option__pass">Room pass ...</label>
            <span class="mdl-textfield__error">Required from 3 to 16 symbols</span>
          </div>
          <label for="option__sound">
            <input type="checkbox" id="option__sound">
            <span>Play sound</span>
          </label>
          <label for="option__propose_max">
            <input type="checkbox" id="option__propose_max">
            <span>Higher proposed estimation</span>
          </label>
        </div>
        <div class="mdl-dialog__actions">
          <button data-ref="options" v-on:click="onOptionsClose" type="button" class="mdl-button mdl-button--colored">Close</button>
        </div>
      </dialog>
      <dialog class="mdl-dialog no-close" ref="options_change" id="options_change">
        <h4 class="mdl-dialog__title">Room options</h4>
        <div class="mdl-dialog__content">
          <div>Change room options:</div>
          <label for="option__sound_change" style="display: block;">
            <input type="checkbox" id="option__sound_change" v-model="sound">
            <span >Play sound </span>
          </label>
          <label for="option__propose_max_change" style="display: block;">
            <input type="checkbox" id="option__propose_max_change" v-model="proposeMax" >
            <span >Higher proposed estimation </span>
          </label>
          <div v-if="Object.keys(users).length">Admin users:</div>
          <label v-for="(userName, id) in users" :key="`ind-${userName}-${id}`" for="option__sound_change" style="display: block;">
            <input type="checkbox" :id="id" :value="id" v-model="adminUsers">
            <span>{{userName}}</span>
          </label>
        </div>
        <div class="mdl-dialog__actions">
          <button data-ref="options_change" v-on:click="onClose" type="button" class="mdl-button mdl-button--colored">Close</button>
        </div>
      </dialog>
    </span>
</template>

<script>
  import Md5 from "crypto-js/md5";
  export default {
    name: 'Dialogs',
    mounted() {
      this.$store.dispatch('setDialog', {name: 'name_dialog', element: this.$refs.name_dialog});
      this.$store.dispatch('setDialog', {name: 'error', element: this.$refs.error});
      this.$store.dispatch('setDialog', {name: 'start', element: this.$refs.start});
      this.$store.dispatch('setDialog', {name: 'change', element: this.$refs.change});
      this.$store.dispatch('setDialog', {name: 'not_exist', element: this.$refs.not_exist});
      this.$store.dispatch('setDialog', {name: 'pass_dialog', element: this.$refs.pass_dialog});
      this.$store.dispatch('setDialog', {name: 'options', element: this.$refs.options});
      this.$store.dispatch('setDialog', {name: 'options_change', element: this.$refs.options_change});
      this.$refs.name_dialog.addEventListener('cancel', e => {
        e.preventDefault();
      });
      this.$refs.error.addEventListener('cancel', e => {
        e.preventDefault();
      });
      this.$refs.not_exist.addEventListener('cancel', e => {
        e.preventDefault();
      });
      this.$refs.options.addEventListener('cancel', e => {
        e.preventDefault();
      });
      this.$refs.options_change.addEventListener('cancel', e => {
        e.preventDefault();
      });
    },
    methods: {
      validPassword(pass) {
        if (pass.length) {
          const pattern = new RegExp('^.{3,16}$','i');
          return !!pattern.test(pass);
        }
        return true;
      },
      onPassJoin() {
        const el = this.$refs.pass_input;
        let pass = el.value;
        if (this.validPassword(pass)) {
          el.parentNode.classList.remove('is-invalid');
          if (pass.length) {
            pass = Md5(pass).toString();
          }
          this.$store.state.app.emit('join', this.$store.state.app.getLocalData().uuid, pass);
          this.$store.state.app.passAttempt = 'try';
          //el.blur();
          //el.parentNode.classList.remove('is-focused');
          const ref = el.getAttribute('data-ref');
          this.$refs[ref].close();
        } else {
          el.parentNode.classList.add('is-invalid');
        }
      },
      onNameInput() {
        this.handleEvent('name_input');
      },
      onNameChange() {
        this.handleEvent('name_change');
      },
      onKeyPress(e) {
        if (e.keyCode === 13) {
          this.handleEvent(e);
          e.target.blur();
          e.target.parentNode.classList.remove('is-focused');
        }
      },
      onClose(e) {
        const ref = e.target.getAttribute('data-ref');
        this.$refs[ref].close();
      },
      onOptionsClose(e) {
        const passEl = document.getElementById('option__pass');
        const pass = passEl.value;
        if (!this.validPassword(pass)) {
          passEl.parentNode.classList.add('is-invalid');
        }
        else {
          passEl.parentNode.classList.remove('is-invalid');
          const ref = e.target.getAttribute('data-ref');
          this.$refs[ref].close();
        }
      },
      handleEvent(name_input) {
        const el = this.$refs[name_input];
        const name = el.value;
        if (name && name.length) {
          el.parentNode.classList.add('is-dirty');
          if (this.$store.state.app.nameExists(name)) {
            el.parentNode.classList.add('is-invalid');
          }
          else {
            el.parentNode.classList.remove('is-invalid');
            const localData = this.$store.state.app.getLocalData();
            localData.name = el.value;
            this.$store.state.app.setLocalData(localData);
            this.$store.state.app.emit('update', this.$store.state.app.buildUser({
              name: localData.name
            }));
            const ref = el.getAttribute('data-ref');
            this.$refs[ref].close();
          }
        } else {
          el.parentNode.classList.add('is-invalid');
        }
      },
    },
    computed: {
      passAttempt() {
        return this.$store.state.app.passAttempt;
      },
      users() {
        return this.$store.state.app.getAllExceptOwner()
      },
      sound: {
        get() {
          return this.$store.state.app.sound;
        },
        set(value) {
          this.$store.state.app.emit('update', {}, {sound: value});
        }
      },
      userName: {
        get() {
          return this.$store.state.app.userName;
        },
        // eslint-disable-next-line no-unused-vars
        set(value) { }
      },
      proposeMax: {
        get() {
          return this.$store.state.app.proposeMax;
        },
        set(value) {
          this.$store.state.app.emit('update', {}, {proposeMax: value});
        }
      },
      adminUsers: {
        get() {
          return this.$store.state.app.adminUsers;
        },
        set(value) {
          this.$store.state.app.emit('update', {}, {adminUsers: value});
        }
      }
    }
  }
</script>
