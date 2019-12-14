<template>
  <div class="login d-flex align-center justify-center flex-column">
    <v-card class="mx-auto" min-width="460px">
      <v-tabs v-model="tab" background-color="transparent" height="60px" grow color="teal">
        <v-tab>Logowanie</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card class="ma-4 mt-8" flat>
            <v-form @submit.prevent="login">
              <v-text-field
                :rules="rules.notEmpty"
                required
                type="email"
                v-model="email"
                label="Email"
                outlined
                color="teal"
              ></v-text-field>
              <v-text-field
                :rules="rules.notEmpty"
                required
                type="password"
                v-model="password"
                label="Hasło"
                outlined
                color="teal"
              ></v-text-field>
              <div v-if="feedback" class="mb-8 text-center">
                <p class="red--text">{{ feedback }}</p>
              </div>
              <div class="d-flex align-center justify-center">
                <v-btn type="submit" dark color="teal">Zaloguj się</v-btn>
              </div>
            </v-form>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-overlay :value="loading">
      <v-progress-circular v-if="this.loading" :width="6" :size="100" color="teal" indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import functions from "firebase/functions";

export default {
  data() {
    return {
      tab: null,
      email: null,
      password: null,
      feedback: null,
      loading: false,
      rules: {
        notEmpty: [val => (val || "").length > 0 || "pole wymagane"]
      }
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        this.loading = true;
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            this.$router.push({ name: "home" });
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
            this.feedback = err.message;
            this.loading = false;
          });
        this.feedback = null;
      } else {
        this.feedback = "Wypełnij wszystkie pola";
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.login {
  background: url("~@/assets/tlo2.jpg");
  height: calc(100vh - 80px);
}
</style>