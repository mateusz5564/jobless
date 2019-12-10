<template>
  <div class="user-profile mx-auto">
    <v-card class="pa-10" max-width="800px">
      <v-card flat>
        <v-card-text>
          <v-form @submit.prevent="changePassword">
            <v-text-field
              color="teal"
              outlined
              type="password"
              v-model="currentPassword"
              label="Aktualne hasło"
            ></v-text-field>
            <v-text-field
              color="teal"
              outlined
              type="password"
              v-model="newPassword"
              label="Nowe hasło"
            ></v-text-field>
            <p class="text-left font-weight-medium mb-8">
              <a class="teal--text" @click.stop="dialog = true">Zapomniałem hasła</a>
            </p>
            <v-btn type="submit" color="teal" dark>Zapisz</v-btn>
            <br />
            <br />
          </v-form>
        </v-card-text>
      </v-card>
    </v-card>

    <v-dialog v-if="currentUser" v-model="dialog" max-width="500px">
      <ResetPassword :uemail="currentUser.email" @resetPasswordSent="setSnackbar" />
    </v-dialog>

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
import ResetPassword from "@/components/ResetPassword";
import { bus } from "../../main";

export default {
  components: {
    ResetPassword
  },
  data() {
    return {
      isOwner: false,
      currentUser: null,
      snackbar: false,
      color: "",
      icon: "",
      text: "",
      timeout: 5000,
      currentPassword: null,
      newPassword: null,
      email: null,
      dialog: false
    };
  },
  created() {
    let user = firebase.auth().currentUser;
    this.currentUser = user;
    this.email = user.email;
  },
  methods: {
    changePassword() {
      let user = firebase.auth().currentUser;
      let newPassword = this.newPassword;
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.currentPassword
      );

      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          firebase
            .auth()
            .currentUser.updatePassword(newPassword)
            .then(() => {
              console.log("zmieniono hasło");
              this.setSnackbar2("success", "Hasło zostało zmienione!");
              this.currentPassword = "";
              this.newPassword = "";
            })
            .catch(err => {
              console.log(err);
              this.setSnackbar2("error", "Nie udało się zmienić hasła!");
              this.currentPassword = "";
            });
        })
        .catch(err => {
          console.log(err);
          this.setSnackbar2("error", "Nie udało się zmienić hasła!");
          this.currentPassword = "";
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