<template>
  <div class="home">
    <div class="job_offers mx-auto">
      <div class="elevation-1" v-for="(offer, index) in offers" :key="index">
        <JobOfferThumbnail :offer="offer" />
      </div>
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
      offers: [],
      items: [],
      loading: true,
      selected: null,
    };
  },
  created(){
    this.getOffers();
  },
  methods: {
    getOffers(){

      db.collection("applications")
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .orderBy("created_at", "desc")
      .get()
      .then(querySnapshot =>{
        querySnapshot.forEach(doc => {
          db.collection('job_offers')
          .doc(doc.data().offer_id)
          .get()
          .then(doc => {
            let offerData = doc.data();
            offerData.id = doc.id;
            db.collection("employers").doc(doc.data().employer_id)
            .get()
            .then(doc => {
              offerData.company_name = doc.data().company_name;
              offerData.company_logo = doc.data().company_logo;
              this.offers.push(offerData);
            })
            .catch(err => {
              console.log(err);
            })
          })
        })
      })
    }
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
.search_content{
  width: 900px;
}
.job_offers {
  width: 1100px;
}
</style>

