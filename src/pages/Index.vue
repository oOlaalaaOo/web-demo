<template>
  <q-page class="flex flex-center">
    <Logo :size="logoSize" :square="logoSquare" />
    <div class="q-pa-md">
      <div class="text-h5"><span class="text-weight-light">Welcome To</span> Kitty Factory</div>
      <p class="text-body2">Love Cats? Me too! go check hundreds of Cats here</p>
      <q-btn color="purple" label="Sign In" rounded to="/login" />
    </div>
  </q-page>
</template>

<script>
import Logo from '../components/Logo'

export default {
  name: 'PageIndex',
  components: {
    Logo
  },
  data: () => ({
    logoSize: '250px',
    logoRound: true,
    logoSquare: true
  })
}
</script>
