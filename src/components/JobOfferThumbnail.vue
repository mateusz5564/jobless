<template>
  <div class="job_offer_thumbnail">
    <v-card class="d-flex flex-column justify-space-between white mb-2" flat height="130px">
      <div class="job_offer__up d-flex">
        <div class="job_offer__logo d-flex flex-column justify-space-between pt-3">
          <v-img height="50" contain src="@/assets/logo.png"></v-img>
        </div>
        <div class="job_offer__decription pt-3 ml-2">
          <div class="d-flex justify-space-between">
            <span class="d-block subtitle-1 teal--text font-weight-bold">Tytuł oferty pracy</span>
            <span class="d-block salary teal--text font-weight-light pr-2">3000 - 5000 PLN</span>
          </div>
          <div>
            <v-icon small>mdi-office-building</v-icon>
            <span class="caption ml-1">nazwa firmy</span>
          </div>
          <div>
            <v-icon small>mdi-map-marker</v-icon>
            <span class="caption ml-1">lokalizacja</span>
          </div>
        </div>
      </div>

      <div class="job_offer__down d-flex justify-space-between align-baseline mb-2 pl-2 pr-2">
        <span class="d-block caption">29 listopad 2019</span>
        <div class="d-flex">
          <span class="mr-1 follow font-weight-light">obserwuj</span>
          <v-icon color="teal">mdi-star-outline</v-icon>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {};
</script>

<style>
.job_offer__up {
  max-height: 88px;
}
.job_offer__decription {
  width: 100%;
}
.job_offer__logo {
  max-width: 120px;
}
.salary {
  line-break: auto;
  min-width: 150px;
  text-align: end;
}
.right {
  min-width: 150px;
}
.follow {
  min-width: 150px;
  text-align: end;
}
</style>