<template>
  <div>
    <p
      class="text-xs-left"
      >
      Manage user claims
    </p>
    <v-layout row justify-start
      >
      <v-flex xs12 sm10 px-1 py-1>
        <v-select
          placeholder="User name"
          :items="usersMapped"
          :loading="loadingUsers"
          @change="userId => userChanged(userId)"
          
          :hide-no-data="true"
          no-data-text=""
          :value="currentUser"
          :disabled="!initialized"
          outline
          single-line
          hide-details
          >
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center justify-start>
      <v-flex xs12 sm5 px-1 py-1>
        <v-combobox
          placeholder="Claim type"
          :items="claimTypesMapped"
          :value="inputClaimTypeValue"
          :loading="loadingUsers || loadingClaims"
          @change="claimType => claimTypeChanged(claimType)"
          @keyup="event => claimTypeChanged(event.target.value)"
          
          
          :disabled="!currentUserId || !initialized"
          outline
          single-line
          hide-details
          :allow-overflow="false"
          :menu-props="{
            'closeOnClick': true,
            'closeOnContentClick': true,
            'openOnClick': false }"
          >
          <div slot="no-data"></div>
        </v-combobox>
      </v-flex>
      <v-flex xs9 sm5 px-1 py-1>
        <v-combobox
          placeholder="Claim value"
          :items="claimValuesMapped"
          :value="currentClaimValueMapped"
          :loading="loadingUsers || loadingClaims"
          @change="claimValueMapped => claimValueChanged(claimValue(claimValueMapped.value))"
          @keyup="event => claimValueChanged(event.target.value)"
          :disabled="!currentUserId || !initialized || !currentClaimType"
         
          outline
          single-line
          hide-details
          :menu-props="{
            'closeOnClick': true,
            'closeOnContentClick': true,
            'openOnClick': false }"
          >
          <div slot="no-data"></div>
        </v-combobox>
      </v-flex>

      <v-flex xs3 sm2>
        <v-layout row justify-end>
         
          <v-flex d-flex>
            <v-btn
              :disabled = "claimChangeOngoing || (!canAdd && !canDelete)"
              icon
              @click="canAdd ? claimAdd() : claimDelete()"
              >
              <v-icon
                v-if="canAdd"
                large :color="$vuetify.theme.primary"
                >
                add_circle
              </v-icon>
              <v-icon
                v-else
                large :color="$vuetify.theme.error"
                >
                delete
              </v-icon>
            </v-btn>

            <v-btn
              :disabled="!canUpdate || claimChangeOngoing"
              icon
              @click="claimUpdate()"
              >
              <v-icon
                large :color="$vuetify.theme.warning"
                >
                check_circle
              </v-icon>
            </v-btn>
          </v-flex>

        </v-layout>
      </v-flex>

    </v-layout>
    <v-layout pl-1 row wrap align-center justify-start caption
      :style="{ color: infoMessage ? infoMessage.color : null,
                minHeight: '20px'}"
      >
      <transition
        name="fade-out"
        >
        <div
          v-if="infoMessage"
          >
          {{ infoMessage.msg }}
        </div>
      </transition>
    </v-layout>
  </div>
</template>

<script>

import { Claim } from '@/models/Claim';

const NOTSET = '__NOT__SET__';

export default {
  props: {
    users: {
      type: Array,
      required: true
    },
    currentUserId: {
      type: String,
      default: null
    },
    claims: {
      type: Array,
      required: true,
    },
    currentClaim: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    },
    loadingUsers: {
      type: Boolean,
      default: false
    },
    loadingClaims: {
      type: Boolean,
      default: false
    },
    usersError: {
      type: Object | Error,
      default: null
    },
    claimsError: {
      type: Object | Error,
      default: null
    },
    changeError: {
      type: Object | Error,
      default: null
    },
    claimChangeOngoing: {
      type: Boolean,
      default: false
    },
    initialized: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      origClaimType: NOTSET,
      origClaimValue: NOTSET,

      claimChangeStarted: false,
      claimChangeMessage: '',
      claimChangeInterval: null
    }
  },
  watch: {
    claimChangeOngoing(isOngoing) {

      const resetInterval = () => {
        if(this.claimChangeInterval) {
          clearInterval(this.claimChangeInterval);
          this.claimChangeInterval = null;
        }
      };
      
      if(isOngoing){
        this.claimChangeStarted = true;

        const maxCount = 50;
        let count = 0;
        resetInterval();
        this.claimChangeMessage += ' ';
        this.claimChangeInterval = setInterval(() => {
          this.claimChangeMessage += '.';
          if(count >= maxCount) resetInterval();
          count++;
        }, 10);
      }
      else if(!isOngoing && this.claimChangeStarted) {
        
        this.origClaimType = NOTSET;
        this.origClaimValue = NOTSET;

        this.claimChangeStarted = false;
        resetInterval();

        if(this.changeError) {
          this.claimChangeMessage += ' ' + this.claimChangeErrorMessage;
        }
        else {
          this.claimChangeMessage += ' done';
        }
       
        setTimeout(() => {
          this.claimChangeMessage = '';
        }, 3000);
      }
    }
  },
  computed: {
    usersMapped() {
      return this.users.map(user => ({ text: user.userName, value: user.userId } ));
    },
    claimTypesMapped() {
      return [...new Set(this.claims.map(claim => claim.type))];
    },
    claimValuesMapped() {
      return this.claims
        .filter(claim => claim.type == this.currentClaimType)
        .map(claim => ( { text: claim.value, value: claim.id } ));
    },
    currentClaimType() {
      return this.currentClaim ? this.currentClaim.type : null;
    },
    currentClaimTypeInput() {
      if(!this.currentClaim) return null;

    },
    currentClaimValue() {
      return this.currentClaim ? this.currentClaim.value : null;
    },
    currentClaimValueMapped() {
      if(!this.currentClaim) return null;
      return { text: this.currentClaim.value, value: this.currentClaim.id };
    },
    currentClaimId() {
      return this.currentClaim ? this.currentClaim.id : null;
    },
    claimsErrorMessage() {
      return this.claimsError && this.claimsError.message ? this.claimsError.message : '';
    },
    usersErrorMessage() {
      return this.usersError && this.usersError.message ? this.usersError.message : '';
    },
    claimChangeErrorMessage() {
      return this.changeError && this.changeError.message ? this.changeError.message : '';
    },

    infoMessage() {
      const color = this.claimChangeOngoing 
        ? this.$vuetify.theme.primary
        : (this.usersError || this.claimsError || this.changeError)
          ? this.$vuetify.theme.error
          : this.$vuetify.theme.success;

      if(this.claimChangeMessage) return { msg: this.claimChangeMessage, color };
      if(this.usersErrorMessage) return { msg: this.usersErrorMessage, color };
      if(this.claimsErrorMessage) return { msg: this.claimsErrorMessage, color };
      return null;
    },

    errorMessage() {
      if(this.claimChangeErrorMessage) return this.claimChangeErrorMessage;
      if(this.claimsErrorMessage) return this.claimsErrorMessage;
      if(this.usersErrorMessage) return this.usersErrorMessage;
      return '';
    },
    currentUser() {
      const user = this.users.find(user => user.userId == this.currentUserId);
      if(!user) return null;
      return { text: user.userName, value: user.userId };
    },
    currentClaimExists() {
      return this.currentClaim
        && this.currentClaim.id
        && this.claims.find(claim =>
                claim.type == this.currentClaim.type
            &&  claim.value == this.currentClaim.value)
    },
    canAdd() {
      return this.currentClaimType != null
        && !this.currentClaimExists;
    },
    canUpdate() {
      return this.currentClaimId != null
        && !this.currentClaimExists;
    },
    canDelete() {
      return this.currentClaimExists;
    },
    inputClaimTypeValue() {
      return this.origClaimType === NOTSET
        ? this.currentClaimType
        : this.origClaimType;
    },
    inputClaimValueValueMapped() {

      return this.origClaimValue === NOTSET
        ? this.currentClaimValueMapped
        : { text: this.origClaimValue,
            value: this.currentClaimValueMapped
              ? this.currentClaimValueMapped.value
              : null
          };
    }
  },
  methods: {
    userChanged(userId) {
      this.origClaimType = NOTSET;
      this.origClaimValue = NOTSET;
      this.$emit('userChanged', userId)
    },
    claimTypeChanged(claimType) {
      
      if(claimType === this.currentClaimType) return;

      if(!claimType || this.claims.some(claim => claim.type == claimType)) {
        this.origClaimType = claimType;
      }

      if(!claimType) {
        this.$emit('claimChanged', null);
        return;
      }

      const claims = this.claims.filter(claim => claimType == claim.type);
      if(claims.length == 0) {
        this.$emit('claimChanged', new Claim(null, claimType, this.currentClaimValue));
      }
      else {
        this.$emit('claimChanged', new Claim(claims[0].id, claims[0].type, claims[0].value));
      }
    },
    claimValueChanged(claimValue) {

      if(this.currentClaimValue === claimValue) return;

      if(!claimValue || this.claims.some(claim => claim.value == claimValue)) {
        this.origClaimValue = claimValue;
      }
      this.$emit('claimChanged', new Claim(this.currentClaimId, this.currentClaimType, claimValue))
    },
    claimValue(claimId) {
      const claim = this.claims.find(claim => claim.id == claimId);
      return claim ? claim.value : null;
    },
    claimAdd() {
      this.claimChangeMessage = 'Adding claim';
      this.$emit('claimAdd');
    },
    claimUpdate() {
      this.claimChangeMessage = 'Updating claim';
      this.$emit('claimUpdate');
    },
    claimDelete() {
      this.claimChangeMessage = 'Deleting claim';
      this.$emit('claimDelete');
    }
  },
  created() {
  }
}
</script>

<style scoped>

.fade-out-leave-active {
  transition: 2s;
}
.fade-out-enter {
  opacity: 1;
}
.fade-out-leave-to {
  opacity: 0;
}


</style>
