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
        <p class="text-center subtitle-1">Wynagrodzenie</p>
        <div class="salary mx-auto d-flex align-center">
          <v-text-field class="mr-5" filled rounded color="teal" v-model="salary_min" label="od"></v-text-field>
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
export default {
  data() {
    return {
      title: null,
      salary_min: null,
      salary_max: null,
      description: null,
      requirements: ["Język angielski", "Prawo jazdy kat. B."],
      rules: {
        required: value => !!value || "pole wymagane"
      }
    };
  },
  methods: {
    remove(item) {
      this.requirements.splice(this.requirements.indexOf(item), 1);
      this.requirements = [...this.requirements];
    },
    addOffer() {
      console.log("dodawanie");
    }
  }
};
</script>

<style>
.salary {
  width: 400px;
}
</style>