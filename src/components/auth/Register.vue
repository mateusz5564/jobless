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
              <div v-if="feedback" class="mb-8 text-center">
                <p class="red--text">{{ feedback }}</p>
              </div>
              <div class="d-flex align-center justify-center">
                <v-btn type="submit" dark color="teal">Zarejestruj się</v-btn>
              </div>
            </v-form>
          </v-card>
        </v-tab-item>

        <!-- PRACODAWCA -->
        <v-tab-item>
          <v-card class="ma-4 mt-12" flat>
            <v-form @submit.prevent="signUpEmployer">
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
              <div v-if="feedbackEmployer" class="mb-8 text-center">
                <p class="red--text">{{ feedbackEmployer }}</p>
              </div>
              <div class="d-flex align-center justify-center">
                <v-btn type="submit" dark color="teal">Zarejestruj się</v-btn>
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
import { bus } from '../../main'

export default {
  data() {
    return {
      tab: null,
      email: null,
      password: null,
      employerName: null,
      employerEmail: null,
      employerPassword: null,
      feedback: "",
      feedbackEmployer: "",
      loading: false,
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
      const addEmployee = firebase.functions().httpsCallable("addEmployee");

      if (this.email && this.password) {
        this.loading = true;
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(response => {
            addEmployee({ email: response.user.email }).then(msg => {
              console.log(msg);
              db.collection("users")
                .doc(response.user.uid)
                .set({
                  user_id: response.user.uid,
                  email: response.user.email,
                  cv: {
                    experiences: [],
                    skills: []
                  }
                })
                .then(() => {
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(this.email, this.password)
                    .then(user => {
                      this.loading = false;
                      this.$router.push({ name: "home" });
                      bus.$emit("updateUserData");
                    })
                    .catch(err => {
                      console.log(err);
                      this.loading = false;
                      this.feedback = err.message;
                    });
                  console.log("zarejestrowano pracownika");
                });
            });
          })
          .catch(err => {
            this.loading = false;
            this.feedback = err.message
            console.log(err);
          });
      } else {
        this.feedback = "Wypełnij wszystkie pola!"
      }
    },
    signUpEmployer() {
      const addEmployer = firebase.functions().httpsCallable("addEmployer");

      if (this.employerName && this.employerEmail && this.employerPassword) {
        this.loading = true;
        firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.employerEmail,
            this.employerPassword
          )
          .then(response => {
            addEmployer({ email: response.user.email }).then(() => {
              db.collection("employers")
                .doc(response.user.uid)
                .set({
                  email: response.user.email,
                  employer_id: response.user.uid,
                  company_name: this.employerName
                })
                .then(() => {
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(this.employerEmail, this.employerPassword)
                    .then(user => {
                      this.loading = false;
                      this.$router.push({ name: "home" });
                      bus.$emit("updateUserData");
                    })
                    .catch(err => {
                      console.log(err);
                      this.loading = false;
                      this.feedbackEmployer = err.message;
                    });
                  console.log("zarejestrowano pracodawce");
                });
            });
          })
          .catch(err => {
            this.loading = false;
            this.feedbackEmployer = err.message;
            console.log(err);
          });
      } else {
        this.feedbackEmployer = "Wypełnij wszystkie pola!"
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


