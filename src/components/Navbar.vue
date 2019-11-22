<template>
  <nav>
    <v-app-bar color="#004D44" dark height="80px" flat clipped-left app>
      <v-toolbar-title>
        <router-link :to="{name: 'home'}">
          <v-img src="@/assets/JoblessLogo.png" height="75px" width="312px"></v-img>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <p v-if="employee">jako pracownik</p>
      <p v-if="employer">jako pracodawca</p>
      <v-toolbar-items>
        <v-btn v-if="!user" text :to="{name: 'rejestracja'}">Rejestracja</v-btn>
        <v-btn v-if="!user" text :to="{name: 'logowanie'}">Zaloguj się</v-btn>
         <!-- current user's menu -->
      <v-menu v-if="user" offset-y min-width="300px">
        <template v-slot:activator="{ on }">
          <v-btn icon small v-on="on" fab>
            <v-avatar v-if="avatarSrc" size="24">
              <img :src="avatarSrc" alt="user's avatar" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item  class="mb-2">
            <v-avatar size="40" class="mr-4">
              <img :src="avatarSrc" alt />
            </v-avatar>
            <v-list-item-title>{{ user.email }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>


          <v-list-item link>
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
      </v-toolbar-items>
    </v-app-bar>
  </nav>
</template>

<script>
import firebase from "firebase"

export default {
  name: "Navbar",
  data(){
    return{
      avatarSrc: 'https://firebasestorage.googleapis.com/v0/b/jobless-f4e79.appspot.com/o/useravatar.png?alt=media&token=fb3431ab-b73a-4446-9658-13816b381e7a',
      user: null,
      employee: null,
      employer: null
    }
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = null
          this.employee = null
          this.employer = null
          this.$router.push({ name: "logowanie" });
        });
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        user.getIdTokenResult().then((token) => {
           token.claims.employee ? this.employee = true : this.employee = null
           token.claims.employer ? this.employer = true : this.employer = null
        })
      } else {
        this.user = null;
      }
    })
  },
};
</script>
