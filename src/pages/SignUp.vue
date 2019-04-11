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
          <form @submit.prevent="validateUser()">
            <q-input
              label="Name"
              bottom-slots
              name="name"
              v-model="user.name"
              v-validate="{ required: true }"
              :error="errors.has('name')"
              :error-message="errors.first('name')" />
            <div class="q-mb-sm"></div>
            <q-input
              label="Email"
              bottom-slots
              name="email"
              v-model="user.email"
              v-validate="{ required: true, email: true, email_unique: true }"
              data-vv-delay="1000"
              :error="errors.has('email')"
              :error-message="errors.first('email')" />
            <div class="q-mb-sm"></div>
            <q-input
              :type="isPassword ? 'password' : 'text'"
              label="Password"
              bottom-slots
              name="password"
              ref="password"
              v-model="user.password"
              v-validate="{ required: true, min: 5 }"
              data-vv-as="Password"
              :error="errors.has('password')"
              :error-message="errors.first('password')">
              <template v-slot:append>
                <q-icon
                  :name="isPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPassword = !isPassword"
                />
              </template>
            </q-input>
            <div class="q-mb-sm"></div>
            <q-input
              :type="isPassword2 ? 'password' : 'text'"
              label="Password Confirmation"
              bottom-slots
              name="password_confirmation"
              v-model="user.password_confirmation"
              v-validate="'confirmed:password'"
              data-vv-as="Password"
              :error="errors.has('password_confirmation')"
              :error-message="errors.first('password_confirmation')">
              <template v-slot:append>
                <q-icon
                  :name="isPassword2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPassword2 = !isPassword2"
                />
              </template>
            </q-input>
            <div class="q-mb-sm"></div>
            <q-btn type="submit" color="purple" rounded class="full-width" label="Sign Up" />
          </form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Logo from '../components/Logo'
import { Validator } from 'vee-validate'

export default {
  name: 'SignUp',
  components: {
    Logo
  },
  data: () => ({
    logoSize: '150px',
    logoSquare: true,
    user: {
      email: '',
      password: '',
      password_confirmation: '',
      name: ''
    },
    isPassword: true,
    isPassword2: true
  }),
  created: function () {
    const isEmailUnique = value => {
      this.checking_email = true
      return this.$axios
        .post('api/email/validate', { email: value })
        .then(resp => {
          this.checking_email = false
          return {
            valid: resp.data.valid,
            data: {
              message: resp.data.message
            }
          }
        })
    }

    Validator.extend('email_unique', {
      validate: isEmailUnique,
      getMessage: (field, params, data) => {
        return data.message
      }
    })
  },
  methods: {
    validateUser () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$q.loading.show()
          this.signUp().then(() => {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Registered Successfully!',
              position: 'top-right',
              color: 'green',
              icon: 'check'
            })

            setTimeout(() => {
              this.$router.push({ name: 'login' })
            }, 1000)
          })
        }
      })
    },
    signUp () {
      let fd = new FormData()

      fd.append('email', this.user.email)
      fd.append('name', this.user.name)
      fd.append('password', this.user.password)

      return this.$store.dispatch('auth/signUp', fd)
    }
  }
}
</script>
