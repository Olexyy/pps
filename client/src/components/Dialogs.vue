<template>
    <span>
      <dialog class="mdl-dialog" ref="name" id="name_dialog">
        <h4 class="mdl-dialog__title">Name yourself</h4>
        <div class="mdl-dialog__content">
          <p>Field is required, cannot match any existing name.</p>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              v-model="userName"
              v-on:blur="onBlur"
              v-on:keypress="onKeyPress"
              class="mdl-textfield__input"
              type="text"
              data-ref="name"
              id="name"
              name="name">
            <label class="mdl-textfield__label" for="name">Name...</label>
          </div>
        </div>
      </dialog>
      <dialog class="mdl-dialog" ref="change" id="change_dialog">
        <h4 class="mdl-dialog__title">Change name</h4>
        <div class="mdl-dialog__content">
          <p>Field is required, cannot match any existing name, press ESC to cancel.</p>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
              v-model="userName"
              v-on:blur="onBlur"
              v-on:keypress="onKeyPress"
              data-ref="change"
              class="mdl-textfield__input"
              type="text"
              id="name"
              name="name">
          <label class="mdl-textfield__label" for="name">Name...</label>
          </div>
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
      <dialog class="mdl-dialog" ref="pass" id="pass_dialog">
        <h4 class="mdl-dialog__title">Password</h4>
        <div class="mdl-dialog__content">
          <p>This room requires password. Input password to join room.</p>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
              v-on:blur="onPassBlur"
              v-on:keypress="onPassKeyPress"
              data-ref="pass"
              class="mdl-textfield__input"
              type="text"
              id="pass"
              name="pass">
          <label class="mdl-textfield__label" for="pass">Password...</label>
          </div>
        </div>
      </dialog>
      <dialog class="mdl-dialog" ref="options" id="options">
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
          </div>
          <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="option__sound">
            <input type="checkbox" id="option__sound" class="mdl-checkbox__input">
            <span class="mdl-checkbox__label">Play sound</span>
          </label>
          <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="option__propose_max">
            <input type="checkbox" id="option__propose_max" class="mdl-checkbox__input">
            <span class="mdl-checkbox__label">Higher proposed estimation</span>
          </label>
          <div class="mdl-dialog__actions">
            <button data-ref="options" v-on:click="onClickClose" type="button" class="mdl-button mdl-button--colored">Close</button>
          </div>
        </div>
      </dialog>
    </span>
</template>

<script>
  import Md5 from "crypto-js/md5";
  export default {
    name: 'Dialogs',
    mounted() {
      this.$store.dispatch('setDialog', {name: 'name', element: this.$refs.name});
      this.$store.dispatch('setDialog', {name: 'error', element: this.$refs.error});
      this.$store.dispatch('setDialog', {name: 'start', element: this.$refs.start});
      this.$store.dispatch('setDialog', {name: 'change', element: this.$refs.change});
      this.$store.dispatch('setDialog', {name: 'not_exist', element: this.$refs.not_exist});
      this.$store.dispatch('setDialog', {name: 'pass', element: this.$refs.pass});
      this.$store.dispatch('setDialog', {name: 'options', element: this.$refs.options});
      this.$refs.name.addEventListener('cancel', e => {
        e.preventDefault();
      });
    },
    methods: {
      handlePassEvent(e) {
        let pass = e.target.value;
        if (pass.length) {
          pass = Md5(pass).toString();
        }
        this.$store.state.app.emit('join', this.$store.state.app.getLocalData().uuid, pass);
      },
      onPassBlur(e) {
        this.handlePassEvent(e);
      },
      onPassKeyPress(e) {
        if (e.keyCode === 13) {
          this.handlePassEvent(e);
          e.target.blur();
          e.target.parentNode.classList.remove('is-focused');
          const ref = e.target.getAttribute('data-ref');
          this.$refs[ref].close();
        }
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
      onClickClose(e) {
        const ref = e.target.getAttribute('data-ref');
        this.$refs[ref].close();
      },
      handleEvent(e) {
        const name = e.target.value;
        if (name && name.length) {
          e.target.parentNode.classList.add('is-dirty');
          if (this.$store.state.app.nameExists(name)) {
            e.target.parentNode.classList.add('is-invalid');
          }
          else {
            e.target.parentNode.classList.remove('is-invalid');
            const localData = this.$store.state.app.getLocalData();
            localData.name = e.target.value;
            this.$store.state.app.setLocalData(localData);
            this.$store.state.app.emit('update', this.$store.state.app.buildUser({
              name: localData.name
            }));
            const ref = e.target.getAttribute('data-ref');
            this.$refs[ref].close();
          }
        }
      },
    },
    computed: {
      userName: {
        get() {
          return this.$store.state.app.userName;
        },
        // eslint-disable-next-line no-unused-vars
        set(value) { }
      }
    }
  }
</script>
