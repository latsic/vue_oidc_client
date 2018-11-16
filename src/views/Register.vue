<template>
  <app-view-layout
    :title="'Register a new Account'"
    >
    
    <v-form
      v-model="formValid"
      ref="form"
      >
      <v-layout justify-center row wrap>
        
        <v-flex xs12 offset-sm0 sm6 px-2>
          <v-text-field
            label="Username"
            outline
            validate-on-blur
            v-model="registerData.userName"
            >
          </v-text-field>
        </v-flex>
      
        <v-flex xs12 offset-sm0 sm6 px-2>
          <v-text-field
            label="Email"
            outline
            :rules="[rules.required, rules.email]"
            validate-on-blur
            @input="(value) => inputChanged(value)"
            v-model="registerData.eMail"
            >
          </v-text-field>
        </v-flex>
      
        <v-flex xs12 offset-sm0 sm6 px-2>
          <v-text-field
            label="Password"
            single-line
            outline
            type="password"
            v-model="registerData.password"
            :rules="[rules.required]"
            @input="(value) => inputChanged(value)"
            validate-on-blur
            >
          </v-text-field>
        </v-flex>
    
        <v-flex xs12 offset-sm0 sm6 px-2>
          <v-text-field
            label="Repeat Password"
            single-line
            outline
            type="password"
            v-model="passwordRepeated"
            :rules="[rules.required, passwordMatch]"
            @input="(value) => inputChanged(value)"
            validate-on-blur
            >
          </v-text-field>
        </v-flex>
      
        <v-flex xs12 offset-sm0 sm6 px-2>
          <v-text-field
              label="First Name"
              outline
              v-model="registerData.firstName"
              >
            </v-text-field>
        </v-flex>
      
        <v-flex xs12 offset-sm0 sm6 px-2>
          <v-text-field
              label="Last Name"
              outline
              v-model="registerData.lastName"
              >
            </v-text-field>
        </v-flex>

        <v-flex xs12 offset-sm0 sm6 px-2>
          <v-select
              label="choose a role"
              outline
              :items="['User', 'Admin']"
              v-model="registerData.role"
              >
            </v-select>
        </v-flex>

        <v-flex xs12 offset-sm0 sm6 px-2>
          <v-select
              label="choose a user number"
              outline
              :items="['0', '10', '20', '30', '40', '50']"
              v-model="registerData.userNumber"
              >
            </v-select>
        </v-flex>

        </v-layout>
        <v-layout justify-left row wrap>

        <v-flex offset-xs0 xs12 sm6 px-2>
          <v-menu
            ref="menu"
            :close-on-content-click="false"
            v-model="menu"
            :nudge-right="40"
            :return-value.sync="registerData.dateOfBirth"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            >
            <v-text-field
              slot="activator"
              label="Date of Birth"
              outline
              v-model="registerData.dateOfBirth"
              append-icon="event"
              readonly
              >
            </v-text-field>
            <v-date-picker v-model="registerData.dateOfBirth" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menu.save(registerData.dateOfBirth)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>

      </v-layout>

      <v-layout justify-center row wrap>
        <v-flex offset-sm0 xs10>
          <v-layout justify-space-between row wrap>
          
          <v-layout align-center>
            <v-btn
              @click="register"
              :disabled="!formValid"
              >
              Register
            </v-btn>
            <app-spinner
              v-if="$store.getters['account/registering']"
              >
            </app-spinner>
          </v-layout>

          <v-btn
            @click="clear"
            :disabled="!canClear()"
            >
            Clear
          </v-btn>
          
          </v-layout>
        </v-flex>
      </v-layout>
      <div v-if="error">
        <app-view-spacer></app-view-spacer>
        <v-layout justify-center row wrap>
          <p
            :style="{margin: 'auto 0px', color: 'red'}"
            >
            {{ error.message ? error.message : "Unknown Error" }}
          </p>
        </v-layout>
      </div>

    </v-form>
    <app-view-spacer></app-view-spacer>
  </app-view-layout>
</template>

<script>

import Spinner from '@/components/common/Spinner';
import ViewLayout from '@/components/layout/ViewLayout';
import ViewSpacer from '@/components/layout/ViewSpacer';
import { RegisterData } from '@/models/RegisterData';

export default {
  components: {
    'appSpinner': Spinner,
    'appViewLayout': ViewLayout,
    'appViewSpacer': ViewSpacer
  },
  data() {
    return {
      formValid: false,
      registerData: new RegisterData(),//this.registerDataStore,
      passwordRepeated: '',
      menu: false,
      showSpinner: false,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  computed: {
    registerDataStore() {
     return this.$store.getters['account/registerData'].clone();
    },
    passwordMatch(){
      return this.passwordRepeated == this.registerData.password || 'Password does not match';
    },
    error(){
      return this.$store.getters['account/registerError'];
    }
  },
  watch: {
    registerDataStore(registerData) {
     this.registerData = registerData.clone();
    }
  },
  methods: {
    async register(){
      this.$store.dispatch('account/register', this.registerData.clone());
    },
    clear(){
      this.$store.dispatch('account/clearRegisterError');
      this.$store.dispatch('account/clearRegisterData');
      this.$refs.form.reset();
    },
    canClear(){
      return this.registerData.email ||
        this.registerData.userName ||
        this.registerData.password ||
        this.registerData.passwordRepeated ||
        this.registerData.firstName ||
        this.registerData.lastName ||
        this.registerData.selectedRole ||
        this.registerData.dateOfBirth;
    },
    inputChanged(){
      this.formValid = this.$refs.form.validate();
    },
  },
  mounted() {
    this.registerData = this.registerDataStore;
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('account/setRegisterData', this.registerData.clone());
    next();
  }

}
</script>

<style scoped>
 
</style>
