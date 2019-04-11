<template>
  <q-page padding>
    <div class="row q-mt-md">
      <div class="col-xs-12">
        <q-table
          title="Users"
          :data="users"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :loading="fetchingUsers"
          :filter="filter"
          @request="fetchUsers"
          selection="multiple"
          :selected.sync="selected"
          binary-state-sort>
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-checkbox v-model="props.selected"></q-checkbox>
              </q-td>
              <q-td key="id" :props="props">{{ props.row.id }}</q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" @save="updateName($event, props.row.id)">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
              <q-td key="email" :props="props">{{ props.row.email }}</q-td>
              <q-td key="created_at" :props="props">{{ props.row.created_at }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="col-xs-12 q-mt-md">
        <template v-if="selected.length > 0">
          <q-btn rounded label="Delete" color="red" @click.prevent="deleteSelected" />
        </template>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AdminUsers',
  data: () => ({
    filter: '',
    fetchingUsers: true,
    selected: [],
    pagination: {
      sortBy: 'name',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 10
    },
    columns: [
      { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
      { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
      { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
      { name: 'created_at', align: 'left', label: 'Created At', field: 'created_at', sortable: true }
    ],
    users: [],
    errorEmail: '',
    errorMessageEmail: ''
  }),
  created: function () {
    this.fetchUsers({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  methods: {
    fetchUsers (props) {
      console.log(props)
      this.fetchingUsers = true
      this.$store.dispatch('user/fetchList', props).then((resp) => {
        console.log(resp)
        setTimeout(() => {
          this.pagination.rowsNumber = resp.data.meta.total[0]
          this.pagination.descending = props.pagination.descending
          this.pagination.page = props.pagination.page
          this.pagination.rowsPerPage = props.pagination.rowsPerPage
          this.pagination.sortBy = props.pagination.sortBy
          this.users = resp.data.data
          this.fetchingUsers = false
        }, 1000)
      })
    },
    updateName (val, id) {
      let fd = new FormData()

      fd.append('name', val)
      fd.append('id', id)
      this.$store.dispatch('user/updateName', fd).then(() => {
        this.$q.notify({
          message: 'Updated!',
          color: 'green',
          icon: 'check',
          position: 'top-right'
        })
      })
    },
    deleteSelected () {
      this.$q.loading.show()
      let selected = this.selected

      let selectedIds = []

      selected.forEach(d => {
        selectedIds.push(d.id)
      })

      let fd = new FormData()

      fd.append('ids', JSON.stringify(selectedIds))

      this.$store.dispatch('user/deleteUsers', fd).then(resp => {
        console.log(resp)
        this.selected = []
        this.$q.loading.hide()

        this.$q.notify({
          message: 'Deleted!',
          color: 'green',
          icon: 'check',
          position: 'top-right'
        })

        this.fetchUsers({
          pagination: this.pagination,
          filter: this.filter
        })
      })
    }
  }
}
</script>
