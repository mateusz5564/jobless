<template>
  <div class="home">
    <div class="search_wrapper d-flex justify-center align-center">
      <v-card class="search_box d-flex justify-center align-center" height="100px" width="1000px">
        <v-form @submit.prevent="searchOffers">
          <div class="search_content search_box d-flex justify-center align-center">
            <v-text-field
              class="search_job_field mr-8"
              color="teal"
              label="jakiej pracy szukasz?"
              v-model="searchValue"
            ></v-text-field>
            <v-text-field
              class="search_location_field mr-8"
              color="teal"
              label="miejscowość"
              v-model="searchLocation"
            ></v-text-field>
            <v-btn color="teal" tile dark width="136px" height="40px" type="submit">
              <v-icon left>mdi-briefcase-search-outline</v-icon>Szukaj
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
    <div class="job_offers mx-auto mt-12 mb-12">
      <h2 v-if="this.offers.length > 0" class="mb-3 title">Oferty pracy</h2>
      <div v-if="noOffers">
        <p> Nie znaleziono ofert odpowiadających wyszukiwaniu </p> 
        <v-btn class="mt-2" text color="teal" outlined @click="handleNoOffersButton">pokaż wszystkie oferty</v-btn>
      </div>
      <v-progress-linear v-if="loading" class="mt-2" indeterminate color="teal"></v-progress-linear>
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
      noOffers: false,
    };
  },
  created() {
    this.getOffers();
  },
  methods: {
    handleNoOffersButton(){
      this.getOffers()
      this.searchValue = "";
      this.searchLocation = "";
    },
    getOffers() {
      this.loading = true;
      db.collection("job_offers")
        .orderBy("created_at", "desc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let offerData = doc.data();
            offerData.id = doc.id;
            db.collection("employers")
              .doc(doc.data().employer_id)
              .get()
              .then(doc => {
                offerData.company_name = doc.data().company_name;
                offerData.company_logo = doc.data().company_logo;
                this.loading = false;
                this.noOffers = false;
                this.offers.push(offerData);
              })
              .catch(err => {
                this.loading = false;
                console.log(err);
              });
          });
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
      console.log(this.offers);
    },

    async searchOffers() {
      this.noOffers = false;
      this.offers = [];
      this.loading = true;

      if (this.searchValue === "" && this.searchLocation === "") {
        console.log(
          "Nie podano parametru wyszukiwania. Pobieram wszystkie oferty"
        );
        this.getOffers();
        return;
      }

      let response = {};

      try {
        response = await db
          .collection("job_offers")
          .orderBy("created_at", "desc")
          .get();

        response.forEach(doc => {
          let docData = doc.data();

          if (this.searchValue !== "" && this.searchLocation !== "") {
            if (
              docData.title
                .toLowerCase()
                .includes(this.searchValue.toLowerCase()) &&
              docData.location.toLowerCase() ===
                this.searchLocation.toLowerCase()
            ) {
              db.collection("employers")
                .doc(doc.data().employer_id)
                .get()
                .then(doc => {
                  docData.company_name = doc.data().company_name;
                  docData.company_logo = doc.data().company_logo;
                  this.loading = false;
                  this.noOffers = false;
                  this.offers.push(docData);
                })
                .catch(err => {
                  this.loading = false;
                })
            } else {
              this.loading = false;
              this.noOffers = true;
              console.log("nie znaleziono")
            }
          } else if (this.searchValue !== "" && this.searchLocation === "") {
            if (docData.title.toLowerCase().includes(this.searchValue.toLowerCase())) {
              db.collection("employers")
                .doc(doc.data().employer_id)
                .get()
                .then(doc => {
                  docData.company_name = doc.data().company_name;
                  docData.company_logo = doc.data().company_logo;
                  this.loading = false;
                  this.noOffers = false;
                  this.offers.push(docData);
                })
                .catch(err => {
                  console.log(err)
                  this.loading = false;
                })
            } else {
              this.loading = false;
              this.noOffers = true;
              console.log("nie znaleziono")
            }
          } else {
            if (
              docData.location.toLowerCase() ===
              this.searchLocation.toLowerCase()
            ) {
              db.collection("employers")
                .doc(doc.data().employer_id)
                .get()
                .then(doc => {
                  docData.company_name = doc.data().company_name;
                  docData.company_logo = doc.data().company_logo;
                  this.loading = false;
                  this.noOffers = false;
                  this.offers.push(docData);
                })
                .catch(err => {
                  this.loading = false;
                })
            } else {
              this.loading = false;
              this.noOffers = true;
              console.log("nie znaleziono")
            }
          }
        });
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
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
.search_content {
  width: 900px;
}
.job_offers {
  width: 1100px;
}
</style>

