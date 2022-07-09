<template>
  <mdl-cell>
    <mdl-table>
      <thead>
        <tr>
          <th class="width-fixed-50">№</th>
          <th class="width-minus-100">Name</th>
          <th class="width-fixed-50">Vote</th>
          <th class="width-fixed-50">Is voting</th>
          <th class="width-fixed-50">Status</th>
          <th v-if="isOwner" class="width-fixed-50">Role</th>
          <th v-if="isOwnerOrAdmin" class="width-fixed-50">Kick</th>
        </tr>
      </thead>
      <tbody v-if="dataExists" id="table_body">
        <tr v-for="(player, id, i) in userList" :key="`ind-${id}-${i}`">
          <td class="width-fixed-50">{{ i + 1 }}</td>
          <td class="width-minus-100">{{ (player.name && player.name.length) ? player.name : '[connecting]' }}</td>
          <td v-if="su" class="width-fixed-50">
            {{ (player.vote) ? player.vote : 'n/a'}}
          </td>
          <td v-else-if="!player.voting" class="width-fixed-50">n/a</td>
          <td v-else-if="player.vote === '' && !isOnline(id)" class="width-fixed-50">n/a</td>
          <td v-else-if="player.vote === '' && discuss === 'discuss'" class="width-fixed-50">
            <img class="wait-throbber" src="./../assets/waiting.gif" alt="waiting"/>
          </td>
          <td v-else-if="discuss === 'discuss'" class="width-fixed-50">
            <span style="color: gray" class="material-icons">done</span>
          </td>
          <td v-else class="width-fixed-50">
            {{(player.vote) ? player.vote : 'n/a'}}
          </td>
          <td v-if="player.voting" class="width-fixed-50"><span style="color: gray" class="material-icons">task_alt</span></td>
          <td v-else class="width-fixed-50"><span style="color: gray" class="material-icons">highlight_off</span></td>
          <td v-if="isOnline(id)" class="width-fixed-50"><span style="color: gray" class="material-icons">task_alt</span></td>
          <td v-else class="width-fixed-50"><span style="color: gray" class="material-icons">highlight_off</span></td>
          <td v-if="isOwner && isUserOwner(player.uuid)" class="width-fixed-50">Owner</td>
          <td v-else-if="isOwner && isUserAdmin(player.uuid)" class="width-fixed-50">Admin</td>
          <td v-else-if="isOwner" class="width-fixed-50">User</td>
          <td v-if="(isOwnerOrAdmin) && isUserOwner(player.uuid)" class="width-fixed-50"></td>
          <td v-else-if="isOwnerOrAdmin" class="width-fixed-50"><a v-on:click="kick"><span style="color: gray" :data-uuid="id" class="material-icons">remove_circle</span></a></td>
        </tr>
        <tr v-if="average && discuss === 'result'">
          <td class="width-fixed-50">Average:</td>
          <td class="width-minus-100" style="text-align: left!important;">{{average}}</td>
          <th class="width-fixed-50"></th>
          <th class="width-fixed-50"></th>
          <td class="width-fixed-50"></td>
          <td class="width-fixed-50"></td>
        </tr>
        <tr v-if="recommended && discuss === 'result'">
          <td class="width-fixed-50">Recommended:</td>
          <td class="width-minus-100" style="text-align: left!important;">{{recommended}}</td>
          <td class="width-fixed-50"></td>
          <td class="width-fixed-50"></td>
          <td class="width-fixed-50"></td>
          <td class="width-fixed-50"></td>
        </tr>
      </tbody>
    </mdl-table>
  </mdl-cell>
</template>

<script>
  import MdlCell from "./mdl/MdlCell12";
  import MdlTable from "./mdl/MdlTable12";
  export default {
    name: 'Users',
    components: {MdlCell, MdlTable},
    methods: {
      isOnline(uuid) {
        return this.$store.state.app.isOnline(uuid);
      },
      kick(e) {
        const uuid = e.target.getAttribute('data-uuid');
        this.$store.state.app.emit('kick', uuid);
      },
      isUserOwner(uuid) {
        return this.$store.state.app.isUserOwner(uuid);
      },
      isUserAdmin(uuid) {
        return this.$store.state.app.isUserAdmin(uuid);
      }
    },
    computed: {
      dataExists() {
        return !!this.$store.state.app.data;
      },
			userList() {
				return Object.keys(this.$store.state.app.data.users)
            // eslint-disable-next-line no-prototype-builtins
            .filter(k => this.$store.state.app.data.users[k].hasOwnProperty('name') && this.$store.state.app.data.users[k].name.length)
            .reduce((obj, key) => {
              obj[key] = this.$store.state.app.data.users[key];
              return obj;
            }, {});
      },
      app() {
        return this.$store.state.app;
      },
      discuss() {
        return this.$store.state.app.discuss;
      },
      average() {
        return this.$store.state.app.result.average;
      },
      recommended() {
        return this.$store.state.app.result.recommended;
      },
      su() {
        return this.$store.state.app.isSU();
      },
      isOwnerOrAdmin() {
        return this.$store.state.app.isOwnerOrAdmin();
      },
      isOwner() {
        return this.$store.state.app.isOwner;
      }
    },
  }
</script>
