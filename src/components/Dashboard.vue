<template>
  <div>
    <div class="tile is-anchestor">
      <div class="tile is-2">
        <div class="tile is-parent">
          <Table class="tile is-child"/>
        </div>
      </div>
      <div class="tile is-10 is-vertical">
        <div class="tile">
            <div class="tile is-parent">
              <BarLine class="tile is-child"/>
            </div>
        </div>
        <div class="tile">
          <div class="tile is-parent">
            <Map class="tile is-child"/>
          </div>
          <div class="tile is-parent">
            <Scatter class="tile is-child"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Table from '@/components/table'
import BarLine from '@/components/BarLine'
import Map from '@/components/Map'
import Scatter from '@/components/Scatter'
export default {
  name: 'HelloWorld',
  components: {
    Table,
    BarLine,
    Map,
    Scatter
  },
  props: {
    msg: String
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
