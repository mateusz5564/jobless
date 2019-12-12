<template>
  <div class="employer_offers mx-auto">
    <div class="mt-12">
      <h2 class="mb-3 title">Moje oferty pracy</h2>
      <div>
        <div class="elevation-1 mb-5" v-for="(offer, index) in offers" :key="index">
          <v-card>
            <JobOfferThumbnail :offer="offer" />
            <v-divider></v-divider>
            <v-container fluid>
              <v-row justify="center">
                <v-subheader v-if="offer.users.length > 0">Uzytkownicy, którzy odpowiedzieli na ofertę</v-subheader>
                <v-subheader v-else>Jeszcze nikt nie aplikował</v-subheader>
                <v-expansion-panels popout>
                  <v-expansion-panel v-for="(user, index) in offer.users" :key="index" hide-actions>
                    <v-expansion-panel-header>
                      <v-row align="center" class="spacer" no-gutters>
                        <v-col cols="4" sm="2" md="1">
                          <v-avatar size="36px">
                            <img v-if="user.avatar" alt="Avatar" :src="user.avatar" />
                            <img
                              v-else
                              alt="Avatar"
                              src="https://firebasestorage.googleapis.com/v0/b/jobless-f4e79.appspot.com/o/useravatar.png?alt=media&token=fb3431ab-b73a-4446-9658-13816b381e7a"
                            />
                          </v-avatar>
                        </v-col>

                        <v-col class="hidden-xs-only" sm="5" md="3">
                          <strong v-html="user.email"></strong>
                          <!-- <span v-if="message.total" class="grey--text">&nbsp;({{ message.total }})</span> -->
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <v-divider></v-divider>
                      <v-card>
                        <v-card-title>
                          
                        </v-card-title>

                        <v-list two-line subheader>
                          <v-subheader>Doświadczenie</v-subheader>
                          <span v-for="(experience, index) in user.cv.experiences" :key="index">
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>{{ experience.company }}</v-list-item-title>
                                <v-list-item-subtitle>
                                  <!-- W przypadku timestampa z Firebase 
              {{ new Date(experience.start_date.seconds * 1000).toLocaleString().substring(0, 9) }}
              -
              {{ new Date(experience.end_date.seconds * 1000).toLocaleString().substring(0, 10) }}
                                  -->
                                  {{ experience.start_date }}
                                  -
                                  {{ experience.end_date }}
                                </v-list-item-subtitle>
                                {{ experience.description }}
                              </v-list-item-content>
                            </v-list-item>
                          </span>
                        </v-list>

                        <v-divider></v-divider>

                        <v-list two-line subheader>
                          <v-subheader>Umiejętności</v-subheader>
                          <span v-for="(skill, index) in user.cv.skills" :key="index">
                            <v-list-item>
                              <v-list-item-content>{{ skill }}</v-list-item-content>
                            </v-list-item>
                          </span>
                        </v-list>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>
            </v-container>
          </v-card>
        </div>
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
      avatarSrc:
        "https://firebasestorage.googleapis.com/v0/b/jobless-f4e79.appspot.com/o/useravatar.png?alt=media&token=fb3431ab-b73a-4446-9658-13816b381e7a",
      messages: [
        {
          avatar: "https://avatars0.githubusercontent.com/u/9064066?v=4&s=460",
          name: "John Leider",
          title: "Welcome to Vuetify.js!",
          excerpt: "Thank you for joining our community..."
        }
      ]
    };
  },
  created() {
    this.getOffers();
  },
  methods: {
    getOffers() {
      db.collection("job_offers")
        .where("employer_id", "==", firebase.auth().currentUser.uid)
        .orderBy("created_at", "desc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const offer_id = doc.id;
            let offerData = doc.data();
            offerData.id = doc.id;
            db.collection("employers")
              .doc(doc.data().employer_id)
              .get()
              .then(doc => {
                offerData.company_name = doc.data().company_name;
                offerData.company_logo = doc.data().company_logo;
                offerData.users = [];
                db.collection("applications")
                  .where("offer_id", "==", offer_id)
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      db.collection("users")
                        .doc(doc.data().user_id)
                        .get()
                        .then(doc => {
                          offerData.users.push(doc.data());
                        });
                    });
                  });
                console.log(this.offers);
                this.offers.push(offerData);
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
    }

    // getOffers() {
    //   db.collection("job_offers")
    //     .where("employer_id", "==", firebase.auth().currentUser.uid)
    //     .orderBy("created_at", "desc")
    //     .get()
    //     .then(querySnapshot => {
    //       querySnapshot.forEach(doc => {
    //         const offer_id = doc.id;
    //         db.collection("job_offers")
    //           .doc(offer_id)
    //           .get()
    //           .then(doc => {
    //             let offerData = doc.data();
    //             offerData.id = doc.id;
    //             console.log(doc.data())
    //             db.collection("employers")
    //               .doc(doc.data().employer_id)
    //               .get()
    //               .then(doc => {
    //                 offerData.company_name = doc.data().company_name;
    //                 offerData.company_logo = doc.data().company_logo;
    //                 offerData.applications = [];
    //                 db.collection("applications")
    //                 .where("offer_id", "==", offer_id)
    //                 .get()
    //                 .then(querySnapshot => {
    //                   console.log(querySnapshot)
    //                   querySnapshot.forEach(doc => {
    //                     db.collection("users")
    //                     .doc(doc.data().user_id)
    //                     .get()
    //                     .then(doc => {
    //                       offerData.applications.push(doc.data());
    //                       this.offers.push(offerData);
    //                     })
    //                   })
    //                 })
    //               })
    //               .catch(err => {
    //                 console.log(err);
    //               });
    //           });
    //       });
    //     });
    // }
    // getOffers() {
    //   db.collection("applications")
    //     .where("employer_id", "==", firebase.auth().currentUser.uid)
    //     .orderBy("created_at", "desc")
    //     .get()
    //     .then(querySnapshot => {
    //       querySnapshot.forEach(doc => {
    //         db.collection("job_offers")
    //           .doc(doc.data().offer_id)
    //           .get()
    //           .then(doc => {
    //             let offerData = doc.data();
    //             offerData.id = doc.id;
    //             db.collection("employers")
    //               .doc(doc.data().employer_id)
    //               .get()
    //               .then(doc => {
    //                 offerData.company_name = doc.data().company_name;
    //                 offerData.company_logo = doc.data().company_logo;
    //                 this.offers.push(offerData);
    //               })
    //               .catch(err => {
    //                 console.log(err);
    //               });
    //           });
    //       });
    //     });
    // }
  }
};
</script>

<style>
.employer_offers {
  width: 1000px;
}
</style>

