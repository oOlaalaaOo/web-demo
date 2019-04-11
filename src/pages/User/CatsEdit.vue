<template>
  <q-page>
    <form enctype="multipart/form-data">
      <div class="row q-mt-lg">
        <div class="col-xs-12 col-md-4 q-pa-md">
          <q-btn label="Select a file" class="full-width" @click.prevent="$refs.imgFile.click()" />
          <input type="file" accept="image/*" @change="onSelectedFile" ref="imgFile" style="display: none" />
          <div class="q-mb-md"></div>
          <vue-croppie
            ref="croppieRef"
            :enableOrientation="true"
            @result="resultCroppie"
            @update="updateCroppie">
          </vue-croppie>
        </div>
        <div class="col-xs-12 col-md-8 q-pa-md">
          <div class="text-h4 text-weight-light q-mb-sm">Pe<span class="text-weight-bold">t</span>sonal Details</div>
          <q-input
            label="Name *"
            name="name"
            v-model="newCatForm.name"
            v-validate="{ required: true }"
            :error="errors.has('name')"
            :error-message="errors.first('name')"
            bottom-slots />
          <div class="q-mb-md"></div>
          <q-input
            autogrow
            label="Description (Optional)"
            v-model="newCatForm.description" />
          <div class="q-mb-md"></div>
          <q-select
            label="Colors *"
            name="colors"
            v-model="newCatForm.colors"
            v-validate="{ required: true }"
            :error="errors.has('colors')"
            :error-message="errors.first('colors')"
            bottom-slots
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add-unique" />
          <div class="q-mb-md"></div>
          <q-select
            label="Attitudes *"
            name="attitudes"
            v-model="newCatForm.attitudes"
            v-validate="{ required: true }"
            :error="errors.has('attitudes')"
            :error-message="errors.first('attitudes')"
            bottom-slots
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add-unique" />
          <div class="q-mb-md"></div>
          <q-toggle label="Publish Kitty?" v-model="newCatForm.published" />
          <div class="q-mb-md"></div>
          <q-btn rounded color="green" label="Update Details" @click.prevent="validateFields" />
          <q-btn flat label="Back" @click.prevent="goBack" />
        </div>
      </div>
    </form>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserCatsEdit',
  data: () => ({
    newCatForm: {
      name: '',
      description: '',
      photo: null,
      published: false,
      attitudes: [],
      colors: []
    },
    croppedImg: null
  }),
  created: function () {
    this.fetchCatDetails().then(() => {
      setTimeout(() => {
        this.getUserDetails().then(() => {
          if (this.userDetails.id !== this.catDetails.user.id) {
            this.$q.notify({
              message: 'Oops! thats not your kitty ' + this.userDetails.name,
              color: 'red',
              position: 'top-right',
              icon: 'error'
            })
            this.goBack()
          } else {
            this.initializedData()
          }
        })
      }, 500)
    })
  },
  computed: {
    ...mapState({
      userDetails (state) {
        return state.user.details
      },
      catDetails (state) {
        return state.cat.details
      }
    })
  },
  methods: {
    initializedData () {
      this.newCatForm.name = ''
      this.newCatForm.description = ''
      this.newCatForm.published = false
      this.newCatForm.colors = []
      this.newCatForm.attitudes = []

      this.newCatForm.name = this.catDetails.name
      this.newCatForm.description = this.catDetails.description
      this.newCatForm.published = this.catDetails.published

      let colors = this.catDetails.colors
      colors.forEach((color) => {
        this.newCatForm.colors.push(color.name)
      })

      let attitudes = this.catDetails.attitudes
      attitudes.forEach((attitude) => {
        this.newCatForm.attitudes.push(attitude.name)
      })

      this.$refs.croppieRef.bind({
        url: this.catDetails.photo,
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
    validateFields () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$q.loading.show()

          let options = {
            type: 'blob',
            format: 'png',
            circle: false
          }

          this.$refs.croppieRef.result(options, (output) => {
            this.croppedImg = output

            setTimeout(() => {
              this.saveCatDetails().then(() => {
                this.$refs.croppieRef.refresh()
                setTimeout(() => {
                  this.$q.loading.hide()
                  this.$q.notify({
                    message: 'Success',
                    position: 'top-right',
                    icon: 'check',
                    color: 'green'
                  })
                  this.fetchCatDetails().then(() => {
                    this.initializedData()
                  })
                }, 1000)
              })
            }, 500)
          })
        }
      })
    },
    saveCatDetails () {
      let fd = new FormData()

      fd.append('id', this.$route.params.id)
      fd.append('name', this.newCatForm.name)
      fd.append('published', this.newCatForm.published)
      fd.append('description', this.newCatForm.description)
      fd.append('colors', JSON.stringify(this.newCatForm.colors))
      fd.append('attitudes', JSON.stringify(this.newCatForm.attitudes))

      if (this.croppedImg) {
        fd.append('photo', this.croppedImg)
      }

      return this.$store.dispatch('cat/update', fd)
    },
    fetchCatDetails () {
      return this.$store.dispatch('cat/fetchDetails', { id: this.$route.params.id })
    },
    getUserDetails () {
      return this.$store.dispatch('user/fetchDetails')
    },
    formatImgUrl (url) {
      return 'http://localhost:8000' + url
    }
  }
}
</script>
