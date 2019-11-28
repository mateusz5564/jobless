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
              <div class="d-flex align-center justify-center">
                <v-btn type="submit" dark color="teal">Zaloguj się</v-btn>
              </div>
            </v-form>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import functions from 'firebase/functions'

export default {
  data() {
    return {
      tab: null,
      email: null,
      password: null,
      feedback: null,
      rules: {
        notEmpty: [val => (val || "").length > 0 || "pole wymagane"]
      }
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            this.$router.push({ name: "home" });
          })
          .catch(err => {
            this.feedback = err.message;
          });
        this.feedback = null;
      } else {
        this.feedback = "Wypełnij wszystkie pola";
      }
    },
  }
};
</script>

<style>
.login {
  background: url("~@/assets/tlo2.jpg");
  height: calc(100vh - 80px);
}
</style>