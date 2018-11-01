<template>
  <v-layout row align-center justify-center :style="{border: '1px solid red'}">
  <v-flex xs12 px-5>
    
  <div
    v-for="item of itemsToDisplay"
    :key="item.name"
    >
    <v-layout row justify-start wrap  mt-2>
      <v-flex xs12 sm6 md4 offset-md2 text-xs-left caption> 
        {{ item.name }}:
      </v-flex>
      <v-flex xs12 sm6 md4 text-xs-left :style="{color: $vuetify.theme.secondary}"> 
        {{ item.value }}
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 sm12 md8 offset-md2>
        <v-divider ></v-divider>
      </v-flex>
    </v-layout>
  </div>

  </v-flex>
  </v-layout>
</template>

<script>


export default {
  props: {
    registerData: {
      type: Object,
      required: true
    }
  },
  computed: {
    itemsToDisplay() {
      return [
        this.getObj('Id', this.registerData.id),
        this.getObj('Username', this.registerData.userName),
        this.getObj('Email', this.registerData.eMail),
        this.getObj('First Name', this.registerData.firstName),
        this.getObj('Last Name', this.registerData.lastName),
        this.getObj('Date of Birth', this.registerData.dateOfBirth),
        this.getObj('Role', this.registerData.role),
        this.getObj('User Number', this.registerData.userNumber.toString()),
      ].filter(item => item != null);
    }
  },
  methods: {
    getObj(name, value) {
      return value ? {name, value} : null;
    }
  },
  beforeRouteEnter(to, from, next) {
    if(Object.keys(to.params).length == 0) {
      next('/')
    }
    next();
  }
}
</script>

<style scoped>

</style>
