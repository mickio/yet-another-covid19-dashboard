<template>
  <div id="app">
    <dashboard/>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  components: {
    Dashboard
  }
}
</script>

<style>
:root{
  --text-color: black;
  --light-color: hsl(0,2%,70%);
  --background-color: white;
  --hover-color: hsl(242,20%,95%);
  --selected-color: hsl(242,20%,50%);
  --active-color: hsl(242,80%,50%);
  --small-text: 6pt;
  --normal-text:9pt;
  --header-text:10pt;
  --dark-color: hsl(242,20%,10%);
  --gap: 0.5rem
}
* {
  font-family: Rubik,Avenir Next,Helvetica Neue,sans-serif;
  font-size: var(--normal-text);
  text-align: left;
  box-sizing: border-box;
}
html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}
body {
  margin: 0;
}
nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid black;
}
nav li {
  text-decoration: none;
  display: inline-block;
  padding: 5px;
}
nav li a {
  text-decoration: none;
  cursor: pointer;
}
nav li:hover {
  background-color: var(--hover-color);
  border-top: 2px solid var(--text-color);
}
nav li:active {
  background-color: var(--active-color)
}
nav li.is-active {
  color: var(--active-color);
  border-top: 2px solid var(--active-color);
}
.card {
    height: 100%;
    width: 100%;
    position: relative;
    border: 1px solid var(--light-color);
    box-shadow: 1px 1px 5px var(--light-color);
    padding: 5px;
}
.is-full-height {
  display: flex;
  flex-direction:column;
}
@media only screen and (max-width: 800px) {
  .card {
    width: 100vw;
    height: 100vh;
    border: none;
    box-shadow: none;
  }
}

</style>
