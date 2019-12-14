<template>
  <v-card>
    <v-card-title v-if="state === 'creating'">Kreator CV</v-card-title>
    <v-card-title v-else-if="state === 'editing'">
      <v-container>
        <v-row>
          <v-col cols="4">
            Edytor CV
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1">
            <v-btn color="primary" small :to="{name: 'cv', params: {cv: this.cv}}">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>      
    </v-card-title>
    <v-form>
      <v-container>
        <!-- Doświadczenie pracownika - formularz -->
        <v-row>
          <v-col cols="3">Twoje doświadczenie</v-col>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-btn text color="blue accent-4" @click="addNewExperience()">Dodaj</v-btn>
          </v-col>
        </v-row>
        <span v-for="(experience, index) in experiences" :key="experience.description">
          <v-divider></v-divider>
          <v-row>
            <v-col cols="10">Wpis nr {{ index + 1 }}</v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn color="error" small @click="deleteExperience(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field required type="text" label="Nazwa firmy" v-model="experience.company"></v-text-field>
            </v-col>
          </v-row>
          <!-- Data od -->
          <v-row>
            <v-col cols="6">
              <v-menu
                ref="menu"
                v-model="experience.menu"
                :close-on-content-click="false"
                :return-value.sync="experience.start_date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="experience.start_date" v-on="on" readonly label="Od"></v-text-field>
                </template>
                <v-date-picker v-model="experience.start_date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text @click="experience.menu = false">Anuluj</v-btn>
                  <v-btn text @click="$refs.menu[index].save(experience.start_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="6">
              <!-- Data do -->
              <v-menu
                ref="menu2"
                v-model="experience.menu2"
                :close-on-content-click="false"
                :return-value.sync="experience.end_date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="experience.end_date" v-on="on" readonly label="Do"></v-text-field>
                </template>
                <v-date-picker v-model="experience.end_date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text @click="experience.menu = false">Anuluj</v-btn>
                  <v-btn text @click="$refs.menu2[index].save(experience.end_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                required
                type="text"
                label="Opis wykonywanej pracy"
                v-model="experience.description"
              ></v-text-field>
            </v-col>
          </v-row>
        </span>

        <v-divider></v-divider>

        <!-- Umiejetnosci pracownika - formularz -->
        <v-row>
          <v-col cols="3">Twoje umiejętności</v-col>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-btn text color="blue accent-4" @click="addNewSkill()">Dodaj</v-btn>
          </v-col>
        </v-row>
        <span v-for="(skill, index) in skills" :key="index">
          <v-divider></v-divider>
          <v-row>
            <v-col cols="10">Wpis nr {{ index + 1 }}</v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn color="error" small @click="deleteSkill(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field required type="text" label="Umiejetnosc" v-model="skills[index]"></v-text-field>
            </v-col>
          </v-row>
        </span>

        <v-row v-if="!isCVEmpty()">
          <v-col>
            <v-btn color="success" @click="saveCV()">Zapisz CV</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>

import firebase from 'firebase'

export default {
  props: ['state', 'cv'],
  
  data() {
    return {
      experiences: [],
      skills: []
    };
  },

  created () {
    if (this.state === 'editing') {
      this.experiences = this.cv.experiences
      this.skills = this.cv.skills
    }
  },

  methods: {
    saveCV() {
      // usuniecie pol menu, menu2, modal z kazdego obiektu experience
      for (let experience of this.experiences) {
        for (let property of ["menu", "menu2", "modal"]) {
          if (experience.hasOwnProperty(property)) {
            delete experience[property];
          }
        }
      }

      let currentUser = firebase.auth().currentUser;
      let db = firebase.firestore()

      let cvToSet = {
        experiences: this.experiences,
        skills: this.skills
      }

      db.collection('users').doc(currentUser.uid).set({
        cv: cvToSet
      }).then(() => {
        alert('Pomyslnie utworzono cv')
        this.$router.push({name: 'cv', params: {cv: cvToSet}})
      })
        .catch(error => {
          alert('Nie udalo sie utworzyc cv')
          console.log(error)
        })
      
    },

    addNewSkill() {
      this.skills.push("");
    },

    addNewExperience() {
      this.experiences.push({
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        company: "",
        description: "",
        menu: false,
        modal: false,
        menu2: false
      });
    },

    deleteSkill(index) {
      this.skills.splice(index, 1);
    },

    deleteExperience(index) {
      this.experiences.splice(index, 1);
    },

    isCVEmpty() {
      return this.skills.length === 0 || this.experiences.length === 0;
    }
  }
};
</script>