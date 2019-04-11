<template>
  <q-page padding>
    <div class="row q-mb-lg">
      <div class="col-xs-12 col-md-4 q-pa-md">
        <q-btn label="Select a file" class="full-width" @click.prevent="$refs.imgFile.click()" />
        <input type="file" accept="image/*" @change="onSelectedFile" ref="imgFile" style="display: none" />
        <div class="q-mt-md q-mb-md"></div>
        <vue-croppie
          ref="croppieRef"
          :enableOrientation="true"
          @result="resultCroppie"
          @update="updateCroppie">
        </vue-croppie>
      </div>
      <div class="col-xs-12 col-md-8 q-pa-md">
        <q-card style="width: 100%">
          <q-card-section>
            <form @submit.prevent.once="validateBasicDetails(basic)">
              <div class="text-h5">Basic Details</div>
              <div class="q-mt-sm q-mb-md"></div>
              <q-input label="Name" v-model="basic.name" />
              <div class="q-mt-sm q-mb-md"></div>
              <q-input autogrow label="Description" v-model="basic.description" />
              <div class="q-mb-md"></div>
              <q-btn type="submit" rounded color="green" label="Update Details"  />
            </form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-xs-12 q-pa-md">
        <q-card style="width: 100%">
          <div class="row">
            <div class="col-xs-12">
              <q-card-section>
                <div class="text-h5">Primary Details</div>
              </q-card-section>
            </div>
            <div class="col-xs-12 col-md-6">
              <q-card-section>
                <form @submit.prevent.once="validateEmail(account)">
                  <q-input
                    label="Email"
                    name="email"
                    v-model="account.email"
                    v-validate="{ required: true, email_unique: true }"
                    data-vv-delay="1000"
                    :error="errors.has('email')"
                    :error-message="errors.first('email')"
                    bottom-slots
                    :loading="checking_email" />
                  <div class="q-mb-md"></div>
                  <q-btn type="submit" rounded color="green" label="Update Email"  />
                </form>
              </q-card-section>
            </div>
            <div class="col-xs-12 col-md-6">
              <q-card-section>
                <form @submit.prevent.once="validatePassword(password)">
                  <q-input
                    type="password"
                    label="Current Password"
                    name="current_password"
                    v-model="password.current"
                    v-validate="{ required: true, min: 5 }"
                    data-vv-as="Current Password"
                    :error="errors.has('current_password')"
                    :error-message="errors.first('current_password')"
                    bottom-slots />
                  <div class="q-mt-sm q-mb-md"></div>
                  <q-input
                    type="password"
                    label="Password"
                    data-vv-name="new_password"
                    ref="new_password"
                    v-model="password.new"
                    v-validate="{ required: true, min: 5 }"
                    data-vv-as="New Password"
                    :error="errors.has('new_password')"
                    :error-message="errors.first('new_password')"
                    bottom-slots />
                  <div class="q-mb-md"></div>
                  <q-input
                    type="password"
                    label="Password Confirmation"
                    name="password_confirmation"
                    v-model="password.confirmation"
                    v-validate="'required|confirmed:new_password'"
                    data-vv-as="Password"
                    :error="errors.has('password_confirmation')"
                    :error-message="errors.first('password_confirmation')"
                    bottom-slots />
                  <div class="q-mb-md"></div>
                  <q-btn type="submit" rounded color="green" label="Update Password"  />
                </form>
              </q-card-section>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { Validator } from 'vee-validate'

export default {
  name: 'AdminAccount',
  data: () => ({
    checking_email: false,
    account: {
      email: ''
    },
    password: {
      current: '',
      new: '',
      confirmation: ''
    },
    basic: {
      name: '',
      description: '',
      photo: ''
    },
    croppedImg: null
  }),
  created: function () {
    const isEmailUnique = value => {
      this.checking_email = true
      return this.$axios
        .post('api/email/validate', { email: value, user_id: this.userDetails.id })
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
  mounted: function () {
    this.getUserDetails().then(() => {
      this.initializedData()
    })
  },
  computed: {
    ...mapState({
      userDetails (state) {
        return state.user.details
      }
    })
  },
  methods: {
    initializedData () {
      this.account.email = this.userDetails.email
      this.basic.name = this.userDetails.name
      this.basic.description = this.userDetails.description
      this.basic.photo = this.userDetails.photo

      this.$refs.croppieRef.bind({
        url: this.formatImgUrl(this.userDetails.photo),
        zoom: 0
      })
    },
    resultCroppie (output) {
      this.croppedImg = output
    },
    updateCroppie (val) {
      console.log(val)
    },
    goBack () {
      this.$router.go(-1)
    },
    onSelectedFile (event) {
      if (event) {
        let files = event.target.files[0]
        let imgUrl = URL.createObjectURL(files)
        this.$refs.croppieRef.bind({
          url: imgUrl,
          zoom: 0
        })
      }
    },
    getUserDetails () {
      return this.$store.dispatch('user/fetchDetails')
    },
    formatImgUrl (url) {
      return 'http://localhost:8000' + url
    },
    validateEmail (scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) {
          this.$q.loading.show()
          this.updateEmail().then(() => {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Success',
              position: 'top-right',
              icon: 'check',
              color: 'green'
            })
          })
        }
      })
    },
    updateEmail () {
      let fd = new FormData()

      fd.append('email', this.account.email)
      fd.append('id', this.userDetails.id)

      return this.$store.dispatch('user/updateEmail', fd)
    },
    validatePassword (scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) {
          this.$q.loading.show()
          this.updatePassword().then((resp) => {
            console.log(resp)
            this.$q.loading.hide()

            if (resp.data.status === 'ok') {
              this.$q.notify({
                message: 'Success',
                position: 'top-right',
                icon: 'check',
                color: 'green'
              })
            } else if (resp.data.status === 'fail') {
              this.$q.notify({
                message: 'Fail',
                position: 'top-right',
                icon: 'error',
                color: 'red'
              })
            }

            if (resp.data.error) {
              this.$q.notify({
                message: 'Current Password is wrong',
                position: 'top-right',
                icon: 'error',
                color: 'red'
              })
            }
          })
        }
      })
    },
    updatePassword () {
      let fd = new FormData()

      fd.append('new_password', this.password.new)
      fd.append('current_password', this.password.current)
      fd.append('id', this.userDetails.id)

      return this.$store.dispatch('user/updatePassword', fd)
    },
    validateBasicDetails (scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) {
          this.$q.loading.show()

          let options = {
            type: 'blob',
            format: 'png',
            circle: false
          }

          this.$refs.croppieRef.result(options, (output) => {
            this.croppedImg = output
            this.$refs.croppieRef.refresh()
            setTimeout(() => {
              this.updateBasicDetails().then(() => {
                this.$q.loading.hide()
                this.$q.notify({
                  message: 'Success',
                  position: 'top-right',
                  icon: 'check',
                  color: 'green'
                })
                this.getUserDetails().then(() => {
                  this.initializedData()
                })
              })
            }, 500)
          })
        }
      })
    },
    updateBasicDetails () {
      let fd = new FormData()

      fd.append('id', this.userDetails.id)
      fd.append('name', this.basic.name)
      fd.append('description', this.basic.description)

      if (this.croppedImg) {
        fd.append('photo', this.croppedImg)
      }

      return this.$store.dispatch('user/updateBasicDetails', fd)
    }
  }
}
</script>
