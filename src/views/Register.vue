<template>
    <v-layout align-center justify-center>
    <v-flex xs12 sm10 md8 lg6>
    <div
      class="panel"
      >
    <br>
    <v-form
      v-model="formValid"
      ref="form"
      
      >
    <v-layout justify-center row wrap>
      
      <v-flex xs10 offset-sm0 sm5 px-2>
        <v-text-field
          label="Username"
          outline
          validate-on-blur
          v-model="registerData.userName"
          >
        </v-text-field>
      </v-flex>
    
      <v-flex xs10 offset-sm0 sm5 px-2>
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
    
      <v-flex xs10 offset-sm0 sm5 px-2>
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
   
      <v-flex xs10 offset-sm0 sm5 px-2>
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
    
      <v-flex xs10 offset-sm0 sm5 px-2>
        <v-text-field
            label="First Name"
            outline
            v-model="registerData.firstName"
            >
          </v-text-field>
      </v-flex>
    
      <v-flex xs10 offset-sm0 sm5 px-2>
        <v-text-field
            label="Last Name"
            outline
            v-model="registerData.lastName"
            >
          </v-text-field>
      </v-flex>

      <v-flex xs10 offset-sm0 sm5 px-2>
        <v-select
            label="choose a role"
            outline
            :items="['User', 'Admin']"
            v-model="registerData.role"
            >
          </v-select>
      </v-flex>

      <v-flex xs10 offset-sm0 sm5 px-2>
        <v-select
            label="choose a user number"
            outline
            :items="[0, 10, 20, 30, 40, 50]"
            v-model="registerData.userNumber"
            >
          </v-select>
      </v-flex>

      </v-layout>
      <v-layout justify-left row wrap>

      <v-flex offset-xs1 xs10 sm5 px-2 style="{border: '1px solid red'}">
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          :nudge-right="40"
          :return-value.sync="dateOfBirth"
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
            v-model="dateOfBirth"
            append-icon="event"
            readonly
            >
          </v-text-field>
          <v-date-picker v-model="dateOfBirth" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(dateOfBirth)">OK</v-btn>
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
            v-if="showSpinner"
            >
          </app-spinner>
          
          <p :style="{margin: 'auto 0px', color: 'red'}" v-if="error">{{ error.message ? error.message : "Unknown Error" }}</p>
          
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

    </v-form>
    </div>
    </v-flex>
    </v-layout>
</template>

<script>

import Spinner from '@/components/Spinner';
import { RegisterData } from '@/model/RegisterData';
import { register } from '@/backend/idserver/register';


export default {
  components: {
    'appSpinner': Spinner
  },
  data() {
    return {
      formValid: false,
      registerData: new RegisterData(),
      dateOfBirth: '',
      passwordRepeated: '',
      //selectedRole: '',
      //selectedUserNumber: 0,
      menu: false,
      showSpinner: false,
      error: null,
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
  methods: {
    passwordMatch(){
      return this.passwordRepeated == this.registerData.password || 'Password does not match';
    },
    register(){
      this.showSpinner = true;
      this.error = null;

      this.registerData.dateOfBirth = this.dateOfBirth;

      register(this.registerData, process.env.VUE_APP_IDSERVER_URL_ACCOUNT_REGISTER)
      .then((registeredData) => {
        this.showSpinner = false;
        this.$router.push({
          name: 'registersuccessfull',
          params: { registerData: registeredData}
        });
      })
      .catch(error => {
        this.error = error;
      })
      .finally(() => {
        this.showSpinner = false;
      });
    },
    clear(){
      this.error = null;
      this.$refs.form.reset()
    },
    canClear(){
      return this.registerData.email ||
        this.registerData.userName ||
        this.registerData.password ||
        this.registerData.passwordRepeated ||
        this.registerData.firstName ||
        this.registerData.lastName ||
        this.registerData.selectedRole
    },
    inputChanged(){
      this.formValid = this.$refs.form.validate();
    }
  }
}
</script>

<style scoped>
  .panel {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
  }
</style>
