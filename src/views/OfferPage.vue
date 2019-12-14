<template>
  <div>
    <div class="mt-12 d-flex justify-center">
      <v-card class="elevation-5" width="900px">
        <v-card
          class="d-flex justify-space-between pl-2 pt-2"
          color="teal lighten-2"
          dark
          height="100px"
        >
          <div class="d-flex flex-column">
            <p class="headline font-weight-bold mb-1">{{ offer.title }}</p>
            <div class="d-flex">
              <v-icon small>mdi-map-marker</v-icon>
              <span class="body-1 ml-1">{{ offer.location }}</span>
            </div>
            <div class="d-flex mt-1">
              <v-icon small>mdi-calendar</v-icon>
              <span
                class="body-2 ml-1"
              >{{ offerCreationDate }}</span>
            </div>
          </div>

          <div class="headline font-weight-regular">
            <span class="d-block salary font-weight- pr-2">
              {{ offer.salary_min }}
              <span v-if="offer.salary_max">-</span>
              {{ offer.salary_max }}
              <span
                v-if="offer.salary_min || offer.salary_max"
              >PLN</span>
            </span>
          </div>
        </v-card>

        <div class="pa-4 mt-4">
          <h3 class="display-1 font-weight-light">Wymagania</h3>
          <v-divider light class="mt-2 mb-4" color="teal"></v-divider>
          <div class="mb-1" v-for="(requirement, index) in offer.requirements" :key="index">
            <v-icon color="teal">mdi-bookmark-check</v-icon>
            {{requirement}}
          </div>
        </div>
        <div class="pa-4 mt-4">
          <h3 class="display-1 font-weight-light">Opis</h3>
          <v-divider light class="mt-2 mb-4" color="teal"></v-divider>
          {{ offer.description }}
        </div>
      </v-card>
      <div class="right_box ml-3">
        <v-card class="d-flex flex-column align-center">
          <div class="mt-3 mb-3">
            <router-link :to="{name: 'employer_profile', params: {employer_id: offer.employer_id}}">
              <v-img height="120" width="120" contain :src="offer.company_logo"></v-img>
            </router-link>
          </div>
          <p class="mb-5 grey--text">
            Firma:
            <router-link
              style="text-decoration: none;"
              :to="{name: 'employer_profile', params: {employer_id: offer.employer_id}}"
            >
              <span class="blue--text">{{ offer.company_name }}</span>
            </router-link>
          </p>
        </v-card>
        <v-btn
          v-if="!this.employer && this.user"
          class="display-1 font-weight-bold"
          color="teal accent-3"
          dark
          width="300px"
          height="70px"
          @click="apply"
        >APLIKUJ</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  data() {
    return {
      employer: null,
      user: null,
      offer: {}
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user.getIdTokenResult().then(token => {
          this.user = user;
          token.claims.employer
            ? (this.employer = true)
            : (this.employer = null);
        });
      }
    });
    this.getOffers();
  },
  computed: {
    offerCreationDate(){
      const date = new Date(this.offer.created_at.seconds * 1000)
      return date.toISOString().substring(0,10)
    }
  },
  methods: {
    getOffers() {
      db.collection("job_offers")
        .doc(this.$route.params.offer_id)
        .get()
        .then(doc => {
          const offerData = doc.data();
          offerData.id = doc.id;
          db.collection("employers")
            .doc(doc.data().employer_id)
            .get()
            .then(doc => {
              offerData.company_name = doc.data().company_name;
              offerData.company_logo = doc.data().company_logo;
              this.offer = offerData;
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //v1
    apply() {
      console.log("aplikowanie");
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(doc => {
          const cv = doc.data().cv;
          if (cv) {
            console.log("user uzulepnił cv");
            db.collection("applications")
              .where("offer_id", "==", this.$route.params.offer_id)
              .where("user_id", "==", firebase.auth().currentUser.uid)
              .get()
              .then(doc => {
                if (doc.empty) {
                  db.collection("applications")
                    .add({
                      offer_id: this.$route.params.offer_id,
                      employer_id: this.offer.employer_id,
                      user_id: firebase.auth().currentUser.uid,
                      created_at: new Date(
                        firebase.firestore.Timestamp.now().seconds * 1000
                      )
                    })
                    .then(res => {
                      console.log("zaaplikowano");
                    })
                    .catch(err => {
                      console.log(err);
                    });
                } else {
                  console.log("już aplikowano!!!");
                }
              });
          } else {
            console.log("nie uzupełniono cv");
          }
        });
    }
  }
};
</script>

<style>
.salary {
  line-break: auto;
  min-width: 150px;
  max-width: 200px;
  text-align: end;
}
.right_box{
  width: 300px;
}
</style>