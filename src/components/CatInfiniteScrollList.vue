<template>
  <div class="row">
    <template v-if="fetchingCats">
      <div class="col-xs-12">
        <div class="text-center q-pt-lg">
          <q-spinner
            color="green"
            size="3em" />
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="catList.length">
        <q-infinite-scroll @load="getCats" :offset="250">
          <div class="col-xs-12 q-pa-sm" v-for="(cat, index) in catList" :key="index">
            <q-card class="rounded-borders cursor-pointer shadow-5">
              <img :src="cat.photo" width="100%" />
              <q-card-section>
                <div class="q-pl-sm q-pr-sm">
                  <div class="text-h6 text-center">{{ cat.name }}</div>
                  <div class="text-subtitle2">{{ cat.user.name }}</div>
                  <div class="text-body2 text-justify">{{ cat.description }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-infinite-scroll>
      </template>
      <template v-else>
        <div class="text-h4 text-weight-light text-center q-pt-lg">No Cats Available...</div>
      </template>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CatInfiniteScrollList',
  data: () => ({
    fetchingCats: true
  }),
  created: function () {
    this.getCats()
  },
  computed: {
    ...mapState({
      catList (state) {
        return state.cat.list
      }
    })
  },
  methods: {
    async getCats (index, done) {
      await this.$store.dispatch('cat/fetch', {
        page: index,
        pushList: true
      }).then((resp) => {
        setTimeout(() => {
          this.fetchingCats = false
          if (done) done()
        }, 1000)
      })
    }
  }
}
</script>
