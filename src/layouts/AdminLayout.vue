<template>
  <q-layout view="lHh Lpr lff">
    <q-header reveal>
      <q-toolbar elevated class="bg-pink text-white shadow-8">
        <q-btn flat round dense icon="menu" @click.prevent="drawer = !drawer" />
        <Logo size="30px" :square="true" />
        <q-toolbar-title>
          Kitty Factory
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      :width="250"
      :breakpoint="400"
      show-if-above
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple :active="activeLink === 'admin-dashboard'" @click="goToLink('admin-dashboard')">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>

            <q-item-section>
              Dashboard
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :active="activeLink === 'admin-users'" @click="goToLink('admin-users')">
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>

            <q-item-section>
              Users
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :active="activeLink === 'admin-account'" @click="goToLink('admin-account')">
            <q-item-section avatar>
              <q-icon name="account_box" />
            </q-item-section>

            <q-item-section>
              Account
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :active="activeLink === 'account'" @click="logout">
            <q-item-section avatar>
              <q-icon name="power_settings_new" />
            </q-item-section>

            <q-item-section>
              Logout
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
      <template v-if="hasUserDetails">
        <q-img class="absolute-top" src="statics/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <template v-if="userDetails.photo">
                <img :src="formatImgUrl(userDetails.photo)" />
              </template>
              <template v-else>
                <img src="statics/user.png" />
              </template>
            </q-avatar>
            <div class="text-weight-bold">{{ userDetails.name }}</div>
            <div>{{ userDetails.email }}</div>
          </div>
        </q-img>
      </template>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Logo from '../components/Logo.vue'

export default {
  name: 'AdminLayout',
  components: {
    Logo
  },
  data: () => ({
    drawer: false,
    activeLink: 'admin-users'
  }),
  created: function () {
    if (!this.hasUserDetails) {
      if (this.hasUser) {
        this.getUserDetails()
      }
    }
  },
  computed: {
    ...mapState({
      userDetails (state) {
        return state.user.details
      }
    }),
    ...mapGetters({
      hasUser: 'auth/isLoggedIn',
      hasUserDetails: 'user/hasDetails'
    })
  },
  methods: {
    getUserDetails () {
      return this.$store.dispatch('user/fetchDetails')
    },
    goToLink (link) {
      this.activeLink = link
      this.$router.push({ name: link })
    },
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push({ name: 'login' })
    },
    formatImgUrl (url) {
      return 'http://localhost:8000' + url
    }
  }
}
</script>
