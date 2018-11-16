<template>
    <div>
    <v-layout row wrap align-center pb-3 pt-1>
      <v-flex xs12 sm12>
        <app-action-button
          :buttonText="'call api endpoint'"
          :clicked="() => apiCall(actionInfo.name)"
          :disabled="false"
          :showResultIndicator="true"
          :marginLeft="'0'"
          >
        </app-action-button>
      </v-flex>
      <v-flex
        :style="{color: $vuetify.theme.primary}"
        xs12 sm12 text-xs-left caption>
        Requirements: {{ actionInfo.desc }}
      </v-flex>
      <v-flex
        text-xs-left
        caption
        >
        <span>Result Info: </span>
        <span
          :style="{opacity: apiCallOngoing ? 0.2 : 1.0}"
          >
          <span v-bind="getColor()">
          {{ isResultError() ? apiResult.error.message : (isResultSuccess() ? 'Success' : '') }}
          </span>
          <span v-if="apiResult.duration != 0">
            | Duration: {{ apiResult.duration }}[ms]
          </span>
        </span>
      </v-flex>
     
    </v-layout>
    <v-divider></v-divider>
    </div>
</template>

<script>
import ActionButton from '@/components/common/ActionButton';

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
      accessToken: '',
      apiCallOngoing: false
    }
  },
  methods: {
    
    isResultSuccess() {
      return this.apiResult.success.accessRequirement != '';
    },
    isResultError() {
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
      this.apiCallOngoing = true;
      if(actionName == 'Everybody') {
        resultPromise = this.apiAccess.get(actionName, false);
      }
      else {
        resultPromise = this.apiAccess.get(actionName, true);
      }

      resultPromise
      .then(json => {
        this.initResult();
        this.apiResult.success = json;
        return true;
      })
      .catch(error => {
        this.initResult();
        this.apiResult.error = error;
      })
      .finally(() => {
        this.apiResult.duration = Date.now() - start;
        this.apiCallOngoing = false;
      });
      
      return resultPromise;
    }
  }
}
</script>

<style scoped>

</style>
