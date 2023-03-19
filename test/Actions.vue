<template>
  <div class="text-align-center">
    <button @click="actionClick()">Click</button>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    methods: {
      ...mapActions(['actionClick']),
    },
  };
</script>
