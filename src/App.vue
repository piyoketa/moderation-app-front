<template>
  <div id="app">
    <ModerationForm />
  </div>
</template>

<script>
import ModerationForm from './components/ModerationForm.vue';

export default {
  components: {
    ModerationForm,
  },
};
</script>

<style>
@font-face {
  font-family: 'isemin'; /* フォントの名前（任意） */
  src: url('assets/Isemin.otf') format('opentype'); /* フォントのパスと形式を指定 */
  font-weight: normal; /* 通常の太さのフォント */
  font-style: normal; /* 通常のスタイル（イタリックでない） */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
