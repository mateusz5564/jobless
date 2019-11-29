<template>
  <div class="home">
    <div class="search_wrapper d-flex justify-center align-center">
      <v-card class="search_box" height="100px" width="1100px"></v-card>
    </div>
    <div class="job_offers mx-auto mt-12">
      <h2 class="mb-3 title">Najnowsze oferty pracy</h2>
      <JobOfferThumbnail />
      <JobOfferThumbnail />
      <JobOfferThumbnail />
      <JobOfferThumbnail />
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import axios from "axios";
import JobOfferThumbnail from "@/components/JobOfferThumbnail";

export default {
  components: {
    JobOfferThumbnail
  },
  data() {
    return {
      conferences: [],
      items: [],
      loading: true,
      selected: null
    };
  }
};
</script>

<style>
/* .category_box {
    width: 376px;
  } */
.search_wrapper {
  background: url("~@/assets/tlo2.jpg");
  background-position: center;
  height: 460px;
  box-shadow: 0px 2px 5px #004d44;
}
.search_box {
  border-radius: 50px;
  opacity: 0.95;
}
.job_offers {
  width: 1100px;
}
</style>

