<template>
  <q-page padding>
    <div class="row q-mt-lg">
      <div class="col-xs-12 col-md-4 offset-md-4">
        <div class="q-pa-md text-center">
          <Logo :size="logoSize" :square="logoSquare" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-4 offset-md-4">
        <div class="q-pa-lg">
          <q-input
            label="Email"
            bottom-slots
            name="email"
            v-model="auth.email"
            v-validate="{ required: true, email: true }"
            :error="errors.has('email')"
            :error-message="errors.first('email')" />
          <div class="q-pt-sm q-mb-sm"></div>
          <q-input
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            bottom-slots
            name="password"
            v-model="auth.password"
            v-validate="{ required: true, min: 5 }"
            :error="errors.has('password')"
            :error-message="errors.first('password')">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="q-pt-sm q-mb-sm"></div>
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <q-btn rounded label="Register Here" @click.prevent="goToLink('sign-up')" />
            </div>
            <div class="col-xs-12 col-md-6 text-right">
              <q-btn color="primary" class="push-right" rounded label="Sign In" @click.prevent="validateCredentials" :loading="authProcessing" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import Logo from '../components/Logo'

export default {
  name: 'Login',
  components: {
    Logo
  },
  data: () => ({
    logoSize: '150px',
    logoSquare: true,
    auth: {
      email: '',
      password: ''
    },
    isPwd: true,
    authProcessing: false
  }),
  computed: {
    ...mapState({
      userDetails (state) {
        return state.user.details
      }
    })
  },
  created: function () {},
  methods: {
    validateCredentials () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.authProcessing = true
          this.login().then(resp => {
            this.getUserDetails().then(() => {
              setTimeout(() => {
                this.authProcessing = false
                if (this.userDetails.is_admin === 1) {
                  this.goToLink('admin-dashboard')
                } else {
                  this.goToLink('user-cats')
                }
              }, 500)
            })
          }).catch(err => {
            if (err.response) {
              console.log(err.response.data)
              console.log(err.response.status)
              console.log(err.response.headers)
              if (err.response.status === 401) {
                this.$q.notify({
                  message: 'Invalid Credentials',
                  position: 'top'
                })
              }
            } else if (err.request) {
              console.log(err.request)
            } else {
              console.log('err', err.message)
            }
            console.log(err.config)
            this.authProcessing = false
          })
        }
      })
    },
    login () {
      return this.$store.dispatch('auth/login', this.auth)
    },
    goToLink (link) {
      this.$router.push({ name: link })
    },
    getUserDetails () {
      return this.$store.dispatch('user/fetchDetails')
    }
  }
}
</script>
