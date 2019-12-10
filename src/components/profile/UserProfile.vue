<template>
  <div class="user-profile mx-auto">
    <v-card class="pa-10" max-width="800px">
      <div class="d-flex flex-row">
        <div class="avatar">
          <div class="logo__box">
            <v-img
              class="logo__img"
              :src="avatarSrc"
              height="76"
              contain
              @click="$refs.imageInput.click()"
            ></v-img>
          </div>
          <a
            v-if="isOwner"
            class="d-block text-center teal--text mt-3"
            @click="$refs.imageInput.click()"
          >zmień logo</a>
          <input
            v-if="isOwner"
            type="file"
            style="display: none"
            ref="imageInput"
            @change="onImageSelected"
          />
        </div>
        <div class="company_info ml-10">
          <div class="d-flex flex-column">
            <div class="d-flex flex-row justify-space-between">
              <h2 class="mr-5 headline">{{ this.email }}</h2>
            </div>
            <p v-if="profile.full_name">{{ profile.full_name }}</p>
            <div v-if="profile.location">
              <v-icon small>mdi-map-marker</v-icon>
              <span class="caption ml-1">{{ profile.location }}</span>
            </div>
            <p v-if="profile.biogram" class="company_description mt-4">{{ profile.biogram }}</p>
          </div>
        </div>
      </div>

      <v-card v-if="isOwner" class="mt-10" flat>
              <v-card-text>
                <v-form @submit.prevent="updateProfile">
                  <v-text-field
                    color="teal"
                    outlined
                    v-model="profile.full_name"
                    label="Imię i nazwisko"
                  ></v-text-field>
                  <v-text-field
                    color="teal"
                    outlined
                    v-model="profile.location"
                    label="Miejscowosc"
                  ></v-text-field>
                  <v-textarea
                    color="teal"
                    outlined
                    v-model="profile.biogram"
                    label="Opis"
                  ></v-textarea>
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
import { bus } from '../../main'

export default {
  data() {
    return {
      profile: {},
      isOwner: false,
      showSettings: true,
      currentUser: null,
      dialog: false,
      snackbar: false,
      color: "",
      icon: "",
      text: "",
      timeout: 5000,
      currentPassword: null,
      currentPasswordEmailTab: null,
      email: null,
      newPassword: null,
      selectedImage: null,
      avatarSrc:
        "https://firebasestorage.googleapis.com/v0/b/konferencje-95600.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=f5fbdbef-b80e-41e5-bf48-e99b0d6f91a6",
    };
  },
  created() {
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("users")
          .doc(this.$route.params.user_id)
          .get()
          .then(doc => {
            this.profile = doc.data();
            this.email = user.email
            if (this.profile.avatar) {
              this.avatarSrc = this.profile.avatar;
            }
            if (doc.data().user_id === user.uid) {
              this.isOwner = true;
              this.currentUser = user;
              this.email = user.email;
            }
          });
      }
    });
  },
  methods: {
    onImageSelected(event) {
      var user = firebase.auth().currentUser;
      this.selectedImage = event.target.files[0];

      if (this.selectedImage) {
        const filename = this.selectedImage.name;
        const extension = filename.substring(
          filename.lastIndexOf("."),
          filename.length
        );

        if (this.profile.avatar) {
          firebase
            .storage()
            .refFromURL(this.profile.avatar)
            .delete()
            .then(() => {
              console.log("usunieto obecne logo");
              firebase
                .storage()
                .ref("avatars/" + user.uid + extension)
                .put(this.selectedImage)
                .then(response => {
                  console.log(response)
                  response.ref.getDownloadURL().then(downloadURL => {
                    db.collection("users")
                      .doc(user.uid)
                      .update({ avatar: downloadURL })
                      .then(response => {
                        console.log("pomyslnie ustawiono logo");
                        this.avatarSrc = downloadURL;
                        this.profile.avatar = downloadURL;
                        bus.$emit("updateLogo", downloadURL);
                        this.setSnackbar2("success", "Logo zostało zmienione!");
                      });
                  });
                });
            })
            .catch(err => {
              console.log(err);
              this.setSnackbar2("error", "Nie udało się zmienić logo!");
            });
        } else {
          firebase
            .storage()
            .ref("avatars/" + user.uid + extension)
            .put(this.selectedImage)
            .then(response => {
              response.ref.getDownloadURL().then(downloadURL => {
                db.collection("users")
                  .doc(user.uid)
                  .update({ avatar: downloadURL })
                  .then(response => {
                    console.log("pomyslnie ustawiono logo");
                    this.avatarSrc = downloadURL;
                    this.profile.avatar = downloadURL;
                    bus.$emit("updateLogo", downloadURL);
                    this.setSnackbar2("success", "Logo zostało zmienione!");
                  });
              });
            });
        }
      }
    },
    updateProfile() {
      const prof = {};
      if (this.profile.full_name) {
        prof.full_name = this.profile.full_name;
      }
      if (this.profile.location) {
        prof.location = this.profile.location;
      }
      if (this.profile.biogram) {
        prof.biogram = this.profile.biogram;
      }

      db.collection("users")
        .doc(this.currentUser.uid)
        .update(prof)
        .then(response => {
          this.color = "success";
          this.icon = "mdi-check-circle";
          this.text = "Pomyślnie edytowano profil!";
          this.snackbar = true;
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