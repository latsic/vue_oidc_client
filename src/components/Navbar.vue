<template>
  
 <div>   

  <v-navigation-drawer
    v-model="drawer"
    app
    disable-resize-watcher
    >
    <v-list dense>
      <template
        v-for="item in navItems"
        >
        <v-list-tile
          :key="item.title"
          :to="item.componentName ? {name: item.componentName} : null"
          @click="itemClicked(item)"
          :color="item.errorColor ? item.errorColor : undefined"
          >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider
          :key="item.title + '_2'"
          >
        </v-divider>
      </template>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar app flat dark dense>

    <v-toolbar-side-icon
      v-if="$vuetify.breakpoint.xsOnly"
      @click.stop="drawer = !drawer"
      >
    </v-toolbar-side-icon>
    
    <v-toolbar-items
      v-if="$vuetify.breakpoint.smAndUp"
      >
      <v-btn flat
        v-for="item of itemsLeft"
        :key="item.title"
        :to="item.componentName ? {name: item.componentName} : null"
        @click="itemClicked(item)"
        >
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>

    <template
      v-if="$vuetify.breakpoint.smAndUp"
      >
      <v-spacer></v-spacer>
      <v-toolbar-title
        v-if="$vuetify.breakpoint.mdAndUp"
        :class="{'secondary--text': !nonNavRouteTitle}"
        >
        {{ nonNavRouteTitle ? nonNavRouteTitle : appTitle }}
      </v-toolbar-title>
      <v-toolbar-title
        v-else
        :class="{'secondary--text': !nonNavRouteTitle}"
        >
        {{ nonNavRouteTitle ? nonNavRouteTitle : '' }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </template>

    <template
      v-if="$vuetify.breakpoint.xsOnly"
      >
      <v-toolbar-title class="title">
        {{ routeTitle }}
      </v-toolbar-title>

      <template
        v-if="$route.name != 'credentials' && isSignedIn"
        >
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat
            :to="{name: 'credentials'}"
            >
            {{ userName }}
          </v-btn>
        </v-toolbar-items>
      </template>


    </template>

    <v-toolbar-items
      v-if="$vuetify.breakpoint.smAndUp"
      >
      <v-btn flat
        v-for="item of itemsRight"
        :key="item.title"
        :to="item.componentName ? {name: item.componentName} : null"
        @click="itemClicked(item)"
        :color="item.errorColor ? item.errorColor : undefined"
        >
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
    
</div>
    
</template>

<script>
export default {
  props: {
    userName: {
      type: String,
      default: ''
    },
    isSignedIn: {
      type: Boolean,
      required: true
    },
    signIn: {
      type: Function,
      default: () => {}
    },
    signOut: {
      type: Function,
      default: () => {}
    },
    signInError: {
      type: Error,
      default: null
    }
  },
  data() {
    return {
      drawer: false,
      appTitle: 'Vue OIDC Client',
    }
  },
  methods: {
    itemClicked(item) {
      if(item.func) {
        item.func();
      }
    }
  },
  computed: {
    itemsLeft() {
      if(this.isSignedIn) {
        return [
          { title: 'Info', componentName: 'info', func: null, icon: 'device_hub'},
          { title: 'IdApi1', componentName: 'idapi1', func: null, icon: 'vpn_key'},
          { title: 'Settings', componentName: 'settings', func: null, icon: 'settings'}
        ];
      }
      else {
        return [
          { title: 'Info', componentName: 'info', func: null, icon: 'device_hub'},
        ];
      }
    },
    itemsRight() {
      if(this.isSignedIn) {
        return [
          { title: this.userName, componentName: 'credentials', func: null, icon: 'account_circle'},
          { title: 'Logout', componentName: null, func: this.signOut, icon: 'clear'},
        ];
      }
      else {
        return [
          { title: 'Register', componentName: 'register', func: null, icon: 'fingerprint'},
          { title: 'Login', componentName: null, func: this.signIn, icon: 'person_outline',
            errorColor: this.signInError && this.$vuetify.theme.error}
        ];
      }
    },
    nonNavItems() {
      return [
        { title: '', componentName: 'loginregisterinfo', func: null, icon: null},
        { title: 'New User created', componentName: 'registersuccessfull', func: null, icon: null}
      ]
    },
    navItems() {
      return [...this.itemsLeft, ...this.itemsRight];
    },
    allItems() {
      return [...this.itemsLeft, ...this.itemsRight, ...this.nonNavItems];
    },
    routeTitle(){
      if(this.$route.name == 'info') {
        return this.appTitle;
      }
      for(const item of this.allItems) {
        if(item.componentName == this.$route.name) {
          return item.title;
        }
      }
      return '';
    },
    nonNavRouteTitle() {
      for(const item of this.nonNavItems) {
        if(item.componentName == this.$route.name && item.title) {
          return item.title;
        }
      }
      return null;
    }
  }
}
</script>

<style scoped>

</style>
