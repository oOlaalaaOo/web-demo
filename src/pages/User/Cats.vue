<template>
  <q-page padding>
    <div class="row q-mt-md">
      <template v-if="fetchingCats">
        <div class="col-xs-12">
          <div class="text-center q-mt-lg">
            <q-spinner
              color="green"
              size="3em" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-xs-12 col-sm-2 col-md-3 q-pa-sm">
          <q-btn label="New Cat" color="green" rounded @click.prevent="goToNewCatForm()" />
        </div>
        <div class="col-xs-12 col-sm-1 offset-sm-2 col-md-1 offset-md-2 q-pa-sm">
          <q-select dense v-model="pagination.perPage" :options="pagination.perPageOptions" />
        </div>
        <div class="col-xs-12 col-sm-2 col-md-2 q-pa-sm">
          <q-select dense v-model="pagination.sortType" :options="pagination.sortOptions" label="Sort By Name" />
        </div>
        <div class="col-xs-12 col-sm-5 col-md-4 q-pa-sm">
          <template v-if="catList.length">
            <q-input dense placeholder="Search" v-model="searchCatName" @keypress.enter="fetchCats()">
              <template v-slot:append>
                <q-btn round dense flat icon="search" @click.prevent="fetchCats()" />
              </template>
            </q-input>
          </template>
        </div>
        <div class="col-xs-12 q-mt-md">
          <CatList :cats="catList" :userId="userDetails.id" />
          <template v-if="pagination.maxPage > 1">
            <div class="q-pa-lg flex flex-center">
              <q-pagination
                v-model="pagination.currentPage"
                :max="pagination.maxPage"
                color="pink"
                :ellipses="true"
                :directionLinks="true"
              >
              </q-pagination>
            </div>
          </template>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import CatList from '../../components/CatList'

export default {
  name: 'UserCats',
  components: {
    CatList
  },
  watch: {
    'pagination.currentPage': function (val) {
      this.fetchCats()
    },
    'pagination.sortType': function (val) {
      this.fetchCats()
    },
    'pagination.perPage': function (val) {
      this.fetchCats()
    }
  },
  computed: {
    ...mapState({
      catList (state) {
        return state.cat.list
      },
      catMeta (state) {
        return state.cat.meta
      },
      userDetails (state) {
        return state.user.details
      }
    })
  },
  data: () => ({
    searchCatName: null,
    fetchingCats: true,
    pagination: {
      currentPage: 1,
      maxPage: 0,
      total: 0,
      sortType: 'Descending',
      sortOptions: [
        'Descending',
        'Ascending'
      ],
      perPage: 6,
      perPageOptions: [3, 6, 8, 10, 15, 20, 25, 30]
    }
  }),
  created: function () {
    this.fetchCats()
  },
  methods: {
    fetchCats () {
      this.fetchingCats = true
      this.$store.dispatch('cat/fetchList', {
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage,
        searchCatName: this.searchCatName,
        sortType: this.pagination.sortType
      }).then((resp) => {
        setTimeout(() => {
          this.pagination.maxPage = this.catMeta.last_page[0]
          this.fetchingCats = false
        }, 1000)
      })
    },
    goToNewCatForm () {
      this.$router.push({ name: 'user-cats-add' })
    }
  }
}
</script>
