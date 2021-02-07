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
            <Map ref="map" class="tile is-child" @mouseover="highlightDot" @mouseout="downplayDot" @click="selectRegion" />
          </div>
          <div class="tile is-parent">
            <Scatter ref="scatter" class="tile is-child" @mouseover="highlightMap" @mouseout="downplayMap" @click="selectRegion" />
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
  components: {
    Table,
    BarLine,
    Map,
    Scatter
  },
  props: {
    msg: String
  },
  methods: {
    highlightDot(option) {
      let index = option.dataIndex
      this.$refs.scatter.dispatchAction({type: "highlight", dataIndex: index})
    },
    downplayDot(option) {
      let index = option.dataIndex
      this.$refs.scatter.dispatchAction({type: "downplay", dataIndex: index})
    },
    highlightMap(option) {
      let index = option.dataIndex
      this.$refs.map.dispatchAction({type: "highlight", dataIndex: index})
    },
    downplayMap(option) {
      let index = option.dataIndex
      this.$refs.map.dispatchAction({type: "downplay", dataIndex: index})
    },
    selectRegion(option){
      console.log(`Ausgewählt: ${option.data.county?option.data.county:option.data[3].county}`)
      this.$store.commit('updateRegion',{
        type: 'county',
        name: option.data.county?option.data.county:option.data[3].county
      })
    }
  },
  data() {
    return {
      action: null
    }
  },
  created(){console.log('Halloo Welt!')}
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
