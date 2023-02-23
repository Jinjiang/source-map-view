<script setup lang="ts">
import { setHash } from '../composables/store';

const showPrompt = () => {
  const hash = prompt('Please enter the hash of the Gist:')
  if (hash) {
    setHash(hash)
  }
}
</script>

<template>
  <h3>How to use?</h3>
  <p>
    Just click a character on the generated file or source file to see the mapping on the other side.
  </p>
  <h3>Try your own source map?</h3>
  <p>
    Save all the source files, generated file, and source map file as a GitHub Gist.
    Then <a href="#" @click.prevent="showPrompt">provide</a> the hash of the Gist to the playground.
  </p>
  <h3>Example</h3>
  <p>
    You can try input <code>e8cc87f03acb0b9e80b48ebeca1a0520</code> to see the result of <a href="https://gist.github.com/Jinjiang/e8cc87f03acb0b9e80b48ebeca1a0520" target="_blank">this</a> Gist example.
  </p>
  <h3>About</h3>
  <p>
    This playground is built by <a href="http://jinjiang.me/" target="_blank">Jinjiang</a>.
    Check out the source code on <a href="https://github.com/Jinjiang/source-map-view/" target="_blank">GitHub</a>.
  </p>
</template>
