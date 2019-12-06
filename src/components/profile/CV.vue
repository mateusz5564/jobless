<template>
  <v-card v-if="isCVProper()">
    <v-card-title>
      Twoje CV
      <v-spacer></v-spacer>
      <v-btn text color="green accent-5" :to="{name: 'cv-kreator', params: {state: 'editing', cv: this.cv}}">Edytuj</v-btn>
    </v-card-title>

    <v-list two-line subheader>
      <v-subheader>Doświadczenie</v-subheader>
      <span v-for="(experience, index) in this.cv.experiences" :key="index">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ experience.company }}</v-list-item-title>
            <v-list-item-subtitle>
              <!-- W przypadku timestampa z Firebase 
              {{ new Date(experience.start_date.seconds * 1000).toLocaleString().substring(0, 9) }}
              -
              {{ new Date(experience.end_date.seconds * 1000).toLocaleString().substring(0, 10) }}
              -->
              {{ experience.start_date }}
              -
              {{ experience.end_date }}
            </v-list-item-subtitle>
            {{ experience.description }}
          </v-list-item-content>
        </v-list-item>
      </span>
    </v-list>

    <v-divider></v-divider>

    <v-list two-line subheader>
      <v-subheader>Umiejętności</v-subheader>
      <span v-for="(skill, index) in this.cv.skills" :key="index">
        <v-list-item>
          <v-list-item-content>{{ skill }}</v-list-item-content>
        </v-list-item>
      </span>
    </v-list>
  </v-card>
  <v-card v-else class="text-center">
    <v-card-title class="justify-center">
      Nie posiadasz jeszcze CV! <br>
      Aby je utworzyć kliknij przycisk poniżej
    </v-card-title>
    <v-btn large color="success" class="mb-6" :to="{name: 'cv-kreator', params: {state: 'creating'}}">Utwórz CV</v-btn>
  </v-card>
</template>

<script>
import firebase from 'firebase'

export default {
  props: ["cv"],
  
  methods: {
    isCVProper () {      
      if (!this.cv) {
        return false
      }

      if (this.cv.experiences.length === 0 &&
               this.cv.skills.length === 0) {
                return false
      }

      return true
    }
  },

  created() {
    /*
    if (!this.cv) {
      let currentUser = firebase.auth().currentUser;
      let database = firebase.firestore();

      if (currentUser) {
        this.user = currentUser;

        database
          .collection("users")
          .doc(this.user.uid)
          .get()
          .then(doc => {
            this.cv = doc.data().cv || null;
          })
          .catch(error => console.log(error));
      } else {
        this.user = null;
      }
    }
    */
  }
};
</script>