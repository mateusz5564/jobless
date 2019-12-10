<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-navigation-drawer>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="title">Mój profil</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list nav>
              <v-list-item link :to="{name: 'cv', params: {cv: this.cv}}">
                <v-list-item-icon>
                  <v-icon color="green">mdi-account-badge-horizontal</v-icon>
                </v-list-item-icon>
                <v-list-item-content>Moje CV</v-list-item-content>
              </v-list-item>
              <v-list-item link :to="{name: 'applications'}">
                <v-list-item-icon>
                  <v-icon color="blue">mdi-file</v-icon>
                </v-list-item-icon>
                <v-list-item-content>Złożone aplikacje</v-list-item-content>
              </v-list-item>
              <v-list-item link :to="{name: 'user_profile', params: {user_id: this.user.uid}}">
                <v-list-item-icon>
                  <v-icon color="blue">mdi-account-card-details</v-icon>
                </v-list-item-icon>
                <v-list-item-content>Profil</v-list-item-content>
              </v-list-item>

              <v-list-item link :to="{name: 'user_email'}">
                <v-list-item-icon>
                  <v-icon color="blue">mdi-email-edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>Email</v-list-item-content>
              </v-list-item>

              <v-list-item link :to="{name: 'user_password'}">
                <v-list-item-icon>
                  <v-icon color="blue">mdi-lock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>Hasło</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-col cols="6">
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      user: {},
      cv: {}
    };
  },

  created() {
    let currentUser = firebase.auth().currentUser;
    let database = firebase.firestore();

    if (currentUser) {
      this.user = currentUser;

      database
        .collection("users")
        .doc(this.user.uid)
        .get()
        .then(doc => {
          this.cv = doc.data().cv || null;
          this.$router.push({ name: "cv", params: { cv: this.cv } });
        })
        .catch(error => console.log(error));
    } else {
      this.user = null;
    }
  }
};
</script>