<template>
  <div class="register d-flex align-center justify-center flex-column">
    <v-card class="mx-auto" min-width="460px" min-height="470px">
      <v-tabs v-model="tab" background-color="transparent" grow color="teal">
        <v-tab>zarejestruj sie</v-tab>
        <v-tab>dla pracodawcy</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- PRACOWNIK -->
        <v-tab-item>
          <v-card class="ma-4 mt-12" flat>
            <v-text-field label="Email" outlined color="teal"></v-text-field>
            <v-text-field label="Hasło" outlined color="teal"></v-text-field>
            <v-card-actions class="d-flex align-center justify-center mb-12">
              <v-btn dark color="teal" @click="register">Zarejestruj się</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>

        <!-- PRACODAWCA -->
        <v-tab-item>
          <v-card class="ma-4 mt-12" flat>
            <v-text-field label="Nazwa firmy" outlined color="teal"></v-text-field>
            <v-text-field label="Email" outlined color="teal"></v-text-field>
            <v-text-field label="Hasło" outlined color="teal"></v-text-field>
            <v-card-actions class="d-flex align-center justify-center mb-12">
              <v-btn dark color="teal" @click="register">Zarejestruj się</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: null
    };
  },
  methods: {
    onClose() {
      this.dialog = false;
      this.$router.go(-1);
    },
    register() {}
  }
};
</script>

<style>
.register {
  background: url("~@/assets/tlo2.jpg");
  height: calc(100vh - 80px);
}
</style>