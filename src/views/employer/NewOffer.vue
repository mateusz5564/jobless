<template>
  <div class="mt-12">
    <v-card class="mx-auto pa-5" max-width="900px">
      <v-card-title class="justify-center">
        <h2 class="headline mb-5">Nowa oferta</h2>
      </v-card-title>

      <v-form @submit.prevent="addOffer">
        <v-text-field
          color="teal"
          v-model="title"
          :rules="[rules.required]"
          label="Tytuł oferty"
          outlined
        ></v-text-field>

        <v-text-field
          color="teal"
          v-model="location"
          :rules="[rules.required]"
          label="Lokalizacja"
          outlined
        ></v-text-field>

        <v-autocomplete color="teal" outlined label="Kategoria" v-model="selectedCategory" :items="categories" item-text="name" item-value="id"></v-autocomplete>
        <p class="text-center subtitle-1">Wynagrodzenie</p>
        <div class="salary mx-auto d-flex align-center">
          <v-text-field
            height="2"
            class="mr-5"
            filled
            rounded
            color="teal"
            v-model="salary_min"
            label="od"
          ></v-text-field>
          <v-text-field filled rounded color="teal" v-model="salary_max" label="do"></v-text-field>
        </div>
        <v-textarea
          color="teal"
          outlined
          v-model="description"
          auto-grow
          label="Opis"
          rows="8"
          :rules="[rules.required]"
        ></v-textarea>

        <p class="text-center subtitle-1">Wymagane umiejętności</p>
        <v-combobox
          color="teal"
          v-model="requirements"
          single-line
          outlined
          chips
          clearable
          label="Umiejętności"
          multiple
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              color="teal"
              dark
              @click="select"
              @click:close="remove(item)"
            >{{ item }}</v-chip>
          </template>
        </v-combobox>
        <v-btn class="mx-auto mt-10 mb-5 d-block" type="submit" color="teal" large dark>Dodaj oferte</v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  data() {
    return {
      title: null,
      location: null,
      selectedCategory: null,      
      salary_min: null,
      salary_max: null,
      description: null,
      requirements: ["Język angielski", "Prawo jazdy kat. B."],
      categories: [],
      rules: {
        required: value => !!value || "pole wymagane"
      }
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    remove(item) {
      this.requirements.splice(this.requirements.indexOf(item), 1);
      this.requirements = [...this.requirements];
    },
    addOffer() {
      console.log("dodawanie");
      db.collection("job_offers")
        .add({
          category_id: this.selectedCategory,
          employer_id: firebase.auth().currentUser.uid,
          title: this.title,
          location: this.location,
          salary_min: this.salary_min,
          salary_max: this.salary_max,
          description: this.description,
          requirements: this.requirements,
          created_at: new Date(firebase.firestore.Timestamp.now().seconds*1000)
        })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCategories() {
      console.log("pobieram kategorie");
      db.collection("categories")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.categories.push({ id: doc.id, name: doc.data().name });
          });
        })
        .catch(err => {
          console.log(err);
        });

      console.log(this.categories);
    }
  }
};
</script>

<style>
.salary {
  width: 300px;
}
</style>