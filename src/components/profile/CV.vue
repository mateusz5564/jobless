<template>
  <v-card v-if="this.cv">
    <v-card-title>
      Twoje CV
      <v-spacer></v-spacer>
      <v-btn text color="green accent-5">Edytuj</v-btn>
    </v-card-title>

    <v-list two-line subheader>
      <v-subheader>Doświadczenie</v-subheader>
      <span v-for="(experience, index) in this.cv.experiences" :key="index">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ experience.company }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ new Date(experience.start_date.seconds * 1000).toLocaleString().substring(0, 9) }}
              -
              {{ new Date(experience.end_date.seconds * 1000).toLocaleString().substring(0, 10) }}
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
  <v-card v-else>Kreator CV</v-card>
</template>

<script>
import firebase from 'firebase'

export default {
  props: ["cv"],

  created() {
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
    } else if (this.cv.experiences.length === 0 &&
               this.cv.skills.length === 0) {
                 this.cv = null
    }
  }
};
</script>