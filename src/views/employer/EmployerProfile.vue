<template>
  <div class="employer-profile mx-auto">
    <v-progress-linear
      class="mb-4"
      :active="loading"
      :indeterminate="loading"
      color="teal accent-4"
    ></v-progress-linear>

    <v-card class="mb-5 pa-10" max-width="800px">
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
              <h2 class="mr-5 headline">{{ profile.company_name }}</h2>
              <v-btn
                v-if="isOwner"
                small
                dark
                color="teal"
                outlined
                @click="showSettings = !showSettings"
              >Ustawienia</v-btn>
            </div>
            <div>
              <v-icon v-if="profile.company_location" small>mdi-map-marker</v-icon>
              <span class="caption ml-1">{{ profile.company_location }}</span>
            </div>
            <p class="company_description mt-4">{{ profile.company_description }}</p>
          </div>
        </div>
      </div>
    </v-card>

    <v-expand-transition>
      <v-card v-if="isOwner && showSettings" max-width="800px">
        <v-tabs color="teal" vertical>
          <v-tab class="tab">
            <v-icon left>mdi-account</v-icon>Edycja profilu
          </v-tab>
          <v-tab class="tab">
            <v-icon left>mdi-lock</v-icon>Zmień hasło
          </v-tab>
          <v-tab class="tab">
            <v-icon left>mdi-access-point</v-icon>Zmień Email
          </v-tab>

          <!-- EDIT PROFILE -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-form @submit.prevent="updateProfile">
                  <v-text-field
                    color="teal"
                    outlined
                    v-model="profile.company_name"
                    label="Nazwa firmy"
                  ></v-text-field>
                  <v-text-field
                    color="teal"
                    outlined
                    v-model="profile.company_location"
                    label="Lokalizacja"
                  ></v-text-field>
                  <v-textarea
                    color="teal"
                    outlined
                    v-model="profile.company_description"
                    label="Opis"
                  ></v-textarea>
                  <v-btn type="submit" color="teal" dark>Zapisz</v-btn>
                  <br />
                  <br />
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- CHANGE PASSWORD -->
          <v-tab-item>
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
          </v-tab-item>
          <v-tab-item class="raz">
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
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-expand-transition>

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
import { bus } from '../../main'

export default {
  components: {
    ResetPassword
  },
  data() {
    return {
      profile: null,
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
      loading: true
    };
  },
  created() {
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("employers")
          .doc(this.$route.params.employer_id)
          .get()
          .then(doc => {
            this.profile = doc.data();
            if (this.profile.company_logo) {
              this.avatarSrc = this.profile.company_logo;
            }
            if (doc.data().employer_id === user.uid) {
              this.isOwner = true;
              this.currentUser = user;
              this.email = user.email;
            }
            this.loading = false;
          });
      } else {
        db.collection("employers")
          .doc(this.$route.params.employer_id)
          .get()
          .then(doc => {
            this.profile = doc.data();
            if (this.profile.company_logo) {
              this.avatarSrc = this.profile.company_logo;
            }
            this.loading = false;
          });
      }
    });
    this.loading = false;
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

        if (this.profile.company_logo) {
          firebase
            .storage()
            .refFromURL(this.profile.company_logo)
            .delete()
            .then(() => {
              console.log("usunieto obecne logo");
              firebase
                .storage()
                .ref("employers_logo/" + user.uid + extension)
                .put(this.selectedImage)
                .then(response => {
                  console.log(response)
                  response.ref.getDownloadURL().then(downloadURL => {
                    db.collection("employers")
                      .doc(user.uid)
                      .update({ company_logo: downloadURL })
                      .then(response => {
                        console.log("pomyslnie ustawiono logo");
                        this.avatarSrc = downloadURL;
                        this.profile.company_logo = downloadURL;
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
            .ref("employers_logo/" + user.uid + extension)
            .put(this.selectedImage)
            .then(response => {
              response.ref.getDownloadURL().then(downloadURL => {
                db.collection("employers")
                  .doc(user.uid)
                  .update({ company_logo: downloadURL })
                  .then(response => {
                    console.log("pomyslnie ustawiono logo");
                    this.avatarSrc = downloadURL;
                    this.profile.company_logo = downloadURL;
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
      if (this.profile.company_name) {
        prof.company_name = this.profile.company_name;
      }
      if (this.profile.company_location) {
        prof.company_location = this.profile.company_location;
      }
      if (this.profile.company_description) {
        prof.company_description = this.profile.company_description;
      }

      db.collection("employers")
        .doc(this.currentUser.uid)
        .update(prof)
        .then(response => {
          this.color = "success";
          this.icon = "mdi-check-circle";
          this.text = "Pomyślnie edytowano profil!";
          this.snackbar = true;
        });
    },
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
              this.setSnackbar2("success", "Adres email został zmieniony!");
              this.currentPassword = "";
            })
            .catch(err => {
              console.log(err);
              this.setSnackbar2("error", "Nie udało się zmienić adresu email!");
              this.currentPassword = "";
            });
        })
        .catch(err => {
          console.log(err);
          this.setSnackbar2("error", "Nie udało się zmienić adresu email!");
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
.tab {
  justify-content: flex-start !important;
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