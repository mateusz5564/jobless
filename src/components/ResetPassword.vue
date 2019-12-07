<template>
  <div class="reset-password">
    <v-card class="pa-5" max-width="500px">
      <v-card-title class="justify-center">
        <h2 class="teal--text">Zresetuj hasło</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="reset">
          <v-text-field color="teal" label="Email" type="email" required v-model="email"></v-text-field>
          <v-btn class="mt-3" color="teal" type="submit" large dark>Wyślij link</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  props: ["uemail"],
  data() {
    return {
      email: '',
    }
  },
  created(){
    if(this.uemail){
      this.email = this.uemail
    }
  },
  methods: {
    reset(){
      const auth = firebase.auth()
      if(this.email){
        this.feedback = ''
        auth.sendPasswordResetEmail(this.email).then(() => {
          this.email = ''
          this.$emit('resetPasswordSent')
        }).catch(err => {
          console.log(err)
          this.color = "error"
          this.icon = "mdi-alert-circle"
          this.text = "Wysłanie wiadomości nie powiodło się!"
          this.snackbar = true
          switch(err.message){
            case "There is no user record corresponding to this identifier. The user may have been deleted.": 
              this.text = "Konto nie istnieje"
              break;
            case "The email address is badly formatted.":
              this.text = "Podaj poprawny adres email!"
              break;
          }
        })
      } else {
        this.color = "error"
        this.icon = "mdi-alert-circle"
        this.text = "Podaj poprawny adres email!"
        this.snackbar = true
      }
    }
  }
}
</script>

<style>

</style>