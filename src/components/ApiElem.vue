<template>
    <div>
    <v-layout row wrap align-center pb-3 pt-1>
      <v-flex xs12 sm12>
        <app-action-button
          :buttonText="'call api endpoint'"
          :clicked="() => apiCall(actionInfo.name)"
          :disabled="false"
          :showResultIndicator="true"
          >
        </app-action-button>
      </v-flex>
      <v-flex
        :style="{color: $vuetify.theme.primary}"
        xs12 sm12 text-xs-left pl-2 caption>
        Requirements: {{ actionInfo.desc }}
      </v-flex>
      <!-- <div v-if="isResultSuccess()" :style="{'margin-left': '0.5rem'}">
        <p class="text-xs-left caption mb-0">Access Requirements: {{ apiResult.success.accessRequirement}}</p>
        <p class="text-xs-left caption">Claims needed: {{ apiResult.success.claimsNeeded}}</p>
      </div> -->
      <v-flex
        text-xs-left
        pl-2
        caption
        >
        <span>Result Info: </span>
        <span v-bind="getColor()">
        {{ isResultError() ? apiResult.error.message : (isResultSuccess() ? 'Success' : '') }}
        </span>
        <span v-if="apiResult.duration != 0">
          | Duration: {{ apiResult.duration }}[ms]
        </span>
      </v-flex>

      <!-- <div v-if="isResultError()" :style="{'margin-left': '0.5rem', color: 'error'}">
        <p class="text-xs-left" :style="{color: $vuetify.theme.error}" >Error: {{ apiResult.error.message}}</p>
      </div> -->
      
     
    </v-layout>
    <v-divider xs12 sm6></v-divider>
    </div>
</template>

<script>
import ActionButton from '@/components/ActionButton';

export default {
  components: {
    'appActionButton': ActionButton
  },
  props: {
    actionInfo: {
      type: Object,
      required: true
    },
    apiAccess: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      apiResult: this.initResult(),
      accessToken: ''
    }
  },
  methods: {
    
    isResultSuccess() {
      return this.apiResult.success.accessRequirement != '';
    },
    isResultError() {
      // console.log('isResultError', this.apiResult.error.message == true);
      return this.apiResult.error.message != '';
    },
    initResult() {
      return {
        success: {
          accessRequirement: '',
          claimsNeeded: ''
        },
        error: {
          message: ''
        },
        duration: 0
      }
    },
    getColor() {
      if(this.isResultSuccess()) {
        return {
          style: {
            color: this.$vuetify.theme.success
          }
        };
      }
      if(this.isResultError()) {
        return {
          style: {
            color: this.$vuetify.theme.error
          }
        };
      }
    },

    apiCall(actionName){
      
      const start = Date.now();

      let resultPromise;
      if(actionName == 'Everybody') {
        resultPromise = this.apiAccess.get(actionName, false);
      }
      else {
        resultPromise = this.apiAccess.get(actionName, true);
      }

      resultPromise
      .then(json => {
        this.apiResult.success = json;
        return true;
      })
      .catch(error => {
        this.apiResult.error = error;
      })
      .finally(() => {
        this.apiResult.duration = Date.now() - start;
      });
      
      return resultPromise;
    }
  }
}
</script>

<style scoped>

</style>
