import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// testing purposes
import { init, mappings } from './composables/store'

// testing purposes
init().then(() => console.log(mappings.value))

createApp(App).mount('#app')
