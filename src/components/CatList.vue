<template>
  <div class="row">
    <template v-if="cats.length">
      <div class="col-xs-12 col-sm-4 col-md-4 q-pa-sm" v-for="(cat, index) in cats" :key="index">
        <q-card class="rounded-borders shadow-5">
          <img :src="cat.photo" class="cursor-pointer" @click="viewMore(cat)" />
          <q-card-section>
            <div class="q-pl-sm q-pr-sm">
              <div class="text-h6 text-center">{{ cat.name }}</div>
              <div class="text-body2 text-justify">{{ cat.description }}</div>
              <div class="text-caption text-italic text-right q-mt-md">Owner: {{ cat.user.name }}</div>
              <div class="q-mt-md text-right" v-if="userId == cat.user.id">
                <q-btn round size="xs" color="green" icon="edit" @click="goToEditPage(cat.id)" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
    <template v-else>
      <div class="col-xs-12">
        <div class="text-h4 text-weight-light text-center q-pt-lg">No Cats Available...</div>
      </div>
    </template>

    <template v-if="catDetails">
      <q-dialog v-model="viewMoreDialog">
        <q-card style="width: 450px">
          <q-img :src="formatImgUrl(catDetails.photo)" />

          <q-card-section>
            <div class="row items-center">
              <div class="col text-h6 ellipsis">{{ catDetails.name }}</div>
            </div>
            <q-chip dense size="10px" color="primary" text-color="white" clickable icon="check" v-for="(color, index) in catDetails.colors" :key="index">{{ color.name }}</q-chip>
            <q-chip dense size="10px" color="red" text-color="white" clickable icon="check" v-for="(attitude, index) in catDetails.attitudes" :key="index">{{ attitude.name }}</q-chip>
          </q-card-section>

          <q-card-section>
            <div class="text-caption">{{ catDetails.description }}</div>
            <div class="text-caption text-right text-italic">Owner: {{ catDetails.user.name }}</div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CatList',
  props: {
    cats: {
      type: Array,
      default: function () {
        return []
      }
    },
    userId: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    viewMoreDialog: false,
    catDetails: null
  }),
  methods: {
    formatImgUrl (url) {
      return 'http://localhost:8000' + url
    },
    viewMore (details) {
      this.catDetails = details
      setTimeout(() => {
        this.viewMoreDialog = true
      }, 300)
    },
    goToEditPage (id) {
      this.$router.push({ name: 'cats-edit', params: { id: id } })
    }
  }
}
</script>
