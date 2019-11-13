<template>
  <div class="navbar">
    <v-toolbar color="#004D44" dark height="80px">
      <v-toolbar-title>
        <v-img src="@/assets/JoblessLogo.png" height="75px" width="312px"></v-img>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn text>Rejestracja</v-btn>
        <v-btn text>Zaloguj się</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "Navbar"
};
</script>
