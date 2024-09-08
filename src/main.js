import { createApp } from 'vue'
import App from './App.vue'

// import DefaultTheme from 'vitepress/theme'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({ 
    components, 
    directives,
    icons: {
    defaultSet: "mdi",
    },
})

document.addEventListener("DOMContentLoaded", function() {
    const app = createApp(App)
    app.use(vuetify)
    app.mount('#app')    
});
