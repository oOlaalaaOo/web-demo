<template>
  <q-avatar :size="size" :round="round" :square="square">
    <img src="statics/img/kitty-factory-logo.png" alt="kitty-factory-logo">
  </q-avatar>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    size: {
      type: String,
      default: '100px'
    },
    round: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    }
  }
}
</script>
