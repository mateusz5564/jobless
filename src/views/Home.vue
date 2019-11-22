<template>
  <v-container class="grey lighten-5">
    <h2>Home</h2>
  </v-container>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import axios from 'axios'

export default {
  components: {
    
  },
  data(){
    return {
      conferences: [],
      items: [],
      loading: true,
      selected: null
    }
  },
  
  }


</script>

<style>
  .category_box {
    width: 376px;
  }
</style>

