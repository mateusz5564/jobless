<template>
  <div class="register d-flex align-center justify-center flex-column">
    <v-card class="mx-auto" min-width="460px" min-height="470px">
      <v-tabs v-model="tab" background-color="transparent" height="60px" grow color="teal">
        <v-tab>zarejestruj sie</v-tab>
        <v-tab>dla pracodawcy</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- PRACOWNIK -->
        <v-tab-item>
          <v-card class="ma-4 mt-12" flat>
            <v-form @submit.prevent="signUpEmployee">
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
                <v-btn type="submit" dark color="teal">Zarejestruj się</v-btn>
              </div>
            </v-form>
          </v-card>
        </v-tab-item>

        <!-- PRACODAWCA -->
        <v-tab-item>
          <v-card class="ma-4 mt-12" flat>
            <v-form @submit.prevent="signUpEmployee">
              <v-text-field v-model="employerName" label="Nazwa firmy" outlined color="teal"></v-text-field>
              <v-text-field
                type="email"
                v-model="employerEmail"
                label="Email"
                outlined
                color="teal"
              ></v-text-field>
              <v-text-field
                type="password"
                v-model="employerPassword"
                label="Hasło"
                outlined
                color="teal"
              ></v-text-field>
              <div class="d-flex align-center justify-center">
                <v-btn type="submit" dark color="teal">Zarejestruj się</v-btn>
              </div>
            </v-form>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
// import db from '@/firebase/init'
import firebase from 'firebase/app'

export default {
  data() {
    return {
      tab: null,
      email: null,
      password: null,
      employerName: null,
      employerEmail: null,
      employerPassword: null,
      rules: {
        notEmpty: [val => (val || "").length > 0 || "pole wymagane"]
      }
    };
  },
  methods: {
    onClose() {
      this.dialog = false;
      this.$router.go(-1);
    },
    signUpEmployee() {
      if(this.email && this.password){
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
  }
};
</script>

<style>
.register {
  background: url("~@/assets/tlo2.jpg");
  height: calc(100vh - 80px);
}
</style>