<template>
  <div class="user-profile mx-auto">
    <v-card class="pa-10" max-width="800px">
      <v-card flat>
        <v-card-text>
          <v-form @submit.prevent="changeEmail">
            <v-text-field color="teal" v-model="email" outlined label="Adres Email"></v-text-field>
            <v-text-field
              color="teal"
              v-model="currentPasswordEmailTab"
              outlined
              type="password"
              label="Podaj aktualne hasło"
            ></v-text-field>
            <v-btn type="submit" color="teal" dark>Zapisz</v-btn>
            <br />
            <br />
          </v-form>
        </v-card-text>
      </v-card>
    </v-card>


    <v-snackbar v-model="snackbar" :color="color" top :timeout="timeout">
      <div>
        <v-icon class="mr-2">{{icon}}</v-icon>
        {{ text }}
      </div>
      <v-btn text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import { bus } from "../../main";

export default {
  data() {
    return {
      isOwner: false,
      currentUser: null,
      snackbar: false,
      color: "",
      icon: "",
      text: "",
      timeout: 5000,
      currentPasswordEmailTab: null,
      email: null,
    };
  },
  created() {
    let user = firebase.auth().currentUser;
    this.email = user.email;
  },
  methods: {
    changeEmail() {
      let user = firebase.auth().currentUser;
      let newEmail = this.newPassword;
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.currentPasswordEmailTab
      );

      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(this.email)
            .then(() => {
              console.log("zmieniono email");
              bus.$emit("updateEmail", this.email);
              this.setSnackbar2("success", "Adres email został zmieniony!");
              this.currentPasswordEmailTab = "";
            })
            .catch(err => {
              console.log(err);
              this.setSnackbar2("error", "Nie udało się zmienić adresu email!");
              this.currentPasswordEmailTab = "";
            });
        })
        .catch(err => {
          console.log(err);
          this.setSnackbar2("error", "Nie udało się zmienić adresu email!");
          this.currentPasswordEmailTab = "";
        });
    },    
    setSnackbar() {
      this.dialog = false;
      this.color = "success";
      this.icon = "mdi-check-circle";
      this.text = "Pomyślnie wysłano wiadomość!";
      this.snackbar = true;
    },
    setSnackbar2(color, text) {
      this.color = color;
      this.text = text;
      if (color == "success") {
        this.icon = "mdi-check-circle";
      } else {
        this.icon = "mdi-alert-circle";
      }
      this.snackbar = true;
    }
  }
};
</script>

<style>
.employer-profile {
  max-width: 800px;
}
.company_info {
  width: 550px;
}
p {
  margin: 0 !important;
}
.logo__img {
  cursor: pointer;
}
.logo__box {
  width: 120px;
}
</style>