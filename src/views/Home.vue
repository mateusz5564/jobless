<template>
  <div class="home">
    <h2>Home</h2>
    <v-btn @click="test">test</v-btn>
    {{test2}}
  </div>
</template>

<script>

export default {
  name: 'home',
  data(){
    return{
      test2: 0
    }
  },
  methods: {
    test(){
      this.test2++
    }
  }
}
</script>

<style>

</style>