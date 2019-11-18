<template>
  <div class="register">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="460px">
        <v-card>

<v-tabs
      v-model="tab"
      background-color="transparent"
      grow
      color="teal"
    >
      <v-tab>
        zarejestruj sie
      </v-tab>
      <v-tab>
        dla pracodawcy
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
      >
        <v-card class="ma-4" flat>
          <v-card-text>jako pracownik</v-card-text>
          <v-text-field
            label="Email"
            outlined
            color="teal"
          ></v-text-field>
          <v-text-field
            label="Hasło"
            outlined
            color="teal"
          ></v-text-field>
        </v-card>
      </v-tab-item>

      <v-tab-item
      >
        <v-card class="ma-4" flat>
          <v-card-text>jako pracodawca</v-card-text>
          <v-text-field
            label="Nazwa firmy"
            outlined
            color="teal"
          ></v-text-field>
          <v-text-field
            label="Email"
            outlined
            color="teal"
          ></v-text-field>
          <v-text-field
            label="Hasło"
            outlined
            color="teal"
          ></v-text-field>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="onClose">Zamknij</v-btn>
            <v-btn text @click="register">Zarejestruj</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  data(){
    return {
      dialog: true,
      tab: null
    }
  },
  methods: {
    onClose(){
      this.dialog = false
      this.$router.go(-1)

    },
    register(){

    }
  }
}
</script>

<style>
.register {
  background: url("~@/assets/tlo2.jpg");
  height: calc(100vh - 80px);
}
</style>