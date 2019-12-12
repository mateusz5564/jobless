<template>
  <nav>
    <v-app-bar color="#004D44" dark height="80px" flat clipped-left app>
      <v-toolbar-title>
        <router-link :to="{name: 'home'}">
          <v-img src="@/assets/JoblessLogo.png" height="75px" width="312px"></v-img>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn v-if="!user" class="mr-4" large text :to="{name: 'rejestracja'}">Rejestracja</v-btn>
      <v-btn v-if="!user" large outlined rounded :to="{name: 'logowanie'}">Zaloguj się</v-btn>

      <v-btn v-if="user && employer" dark icon :to="{ name: 'dodaj_oferte' }">
        <v-icon dark>mdi-briefcase-plus</v-icon>
      </v-btn>
      <!-- current user's menu -->
      <v-menu v-if="user" offset-y min-width="300px">
        <template v-slot:activator="{ on }">
          <v-btn class="mr-4 ml-2" icon v-on="on" fab>
            <v-avatar v-if="avatarSrc" size="24">
              <v-img :src="avatarSrc" contain alt="user's avatar"></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item class="mb-2">
            <v-avatar size="40" class="mr-4">
              <!-- <img :src="avatarSrc" alt /> -->
              <v-img class="logo__img" :src="avatarSrc" height="76" contain></v-img>
            </v-avatar>
            <v-list-item-title>{{ email }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-if="employee" link :to="{name: 'profil'}">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Profil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            v-if="employer"
            :to="{name: 'employer_profile', params: {employer_id: user.uid}}"
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Profil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout" link>
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Wyloguj</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </nav>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import { bus } from "../main";

export default {
  name: "Navbar",
  data() {
    return {
      avatarSrc:
        "https://firebasestorage.googleapis.com/v0/b/jobless-f4e79.appspot.com/o/useravatar.png?alt=media&token=fb3431ab-b73a-4446-9658-13816b381e7a",
      user: null,
      email: "",
      employee: null,
      employer: null
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = null;
          this.employee = null;
          this.employer = null;
          this.avatarSrc =
            "https://firebasestorage.googleapis.com/v0/b/jobless-f4e79.appspot.com/o/useravatar.png?alt=media&token=fb3431ab-b73a-4446-9658-13816b381e7a";
          this.$router.push({ name: "logowanie" });
        });
    }
  },
  created() {
    this.avatarSrc =
      "https://firebasestorage.googleapis.com/v0/b/jobless-f4e79.appspot.com/o/useravatar.png?alt=media&token=fb3431ab-b73a-4446-9658-13816b381e7a";

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.email = user.email
        user.getIdTokenResult().then(token => {
          token.claims.employee
            ? (this.employee = true)
            : (this.employee = null);
          token.claims.employer
            ? (this.employer = true)
            : (this.employer = null);
          if (this.employer) {
            db.collection("employers")
              .doc(user.uid)
              .get()
              .then(doc => {
                let logo = doc.data().company_logo;
                if (logo) {
                  this.avatarSrc = logo;
                }
              });
          } else {
            db.collection("users")
              .doc(user.uid)
              .get()
              .then(doc => {
                let avatar = doc.data().avatar;
                if (avatar) {
                  this.avatarSrc = avatar;
                }
              });
          }
        });
      } else {
        this.user = null;
      }
    });

    bus.$on("updateLogo", data => {
      this.avatarSrc = data;
    });

    bus.$on("updateEmail", data => {
      this.email = data;
    });
  }
};
</script>

