<template>
  <div class="home">
    <div class="search_wrapper d-flex justify-center align-center">
      <v-card class="search_box d-flex justify-center align-center" height="100px" width="1100px">
        <div class="search_content search_box d-flex justify-center align-center">
          <v-text-field class="search_job_field mr-8" color="teal" label="jakiej pracy szukasz?" v-model="searchValue"></v-text-field>
          <v-text-field class="search_location_field mr-8" color="teal" label="miejscowość" v-model="searchLocation"></v-text-field>
          <v-btn color="teal" tile dark width="136px" height="40px" @click="searchOffers">
            <v-icon left >mdi-briefcase-search-outline</v-icon>Szukaj
          </v-btn>
        </div>
      </v-card>
    </div>
    <div class="job_offers mx-auto mt-12">
      <h2 class="mb-3 title">Najnowsze oferty pracy</h2>
      <div v-for="(offer, index) in offers" :key="index">
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
      searchValue: "",
      searchLocation: "",
    };
  },
  created(){
    this.getOffers()
  },
  methods: {
    getOffers(){
      db.collection("job_offers")
      .orderBy("created_at", "desc")
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(doc => {
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
          });
        })
        .catch(err => {
          console.log(err);
        });
      console.log(this.offers);
    },

    async searchOffers () {
      this.offers = []

      if (this.searchValue === "" && this.searchLocation === "") {
        console.log("Nie podano parametru wyszukiwania. Pobieram wszystkie oferty");
        this.getOffers()
        return
      }

      let response = {}
      
      try {
        response = await db.collection('job_offers').orderBy("created_at", "desc").get()

        response.forEach(doc => {
          let docData = doc.data()

          if (this.searchValue !== "" && this.searchLocation !== "") {
            if (docData.title.includes(this.searchValue) && docData.location === this.searchLocation) {
              db.collection("employers").doc(doc.data().employer_id)
                .get()
                .then(doc => {
                  docData.company_name = doc.data().company_name;
                  docData.company_logo = doc.data().company_logo;
                  this.offers.push(docData);
                })              
            }
          }
          else if (this.searchValue !== "" && this.searchLocation === "") {
              if (docData.title.includes(this.searchValue)) {
                db.collection("employers").doc(doc.data().employer_id)
                  .get()
                  .then(doc => {
                    docData.company_name = doc.data().company_name;
                    docData.company_logo = doc.data().company_logo;
                    this.offers.push(docData);
                  })              
            }
          }
          else {
            if (docData.location === this.searchLocation) {
                db.collection("employers").doc(doc.data().employer_id)
                  .get()
                  .then(doc => {
                    docData.company_name = doc.data().company_name;
                    docData.company_logo = doc.data().company_logo;
                    this.offers.push(docData);
                  })              
            }
          }
        })
      }
      catch(error) {
        console.log(error)
      }

      console.log(this.offers)      
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

