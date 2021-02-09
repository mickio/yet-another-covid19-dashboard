<template>
  <div>
    <div class="tile is-anchestor">
      <div class="tile is-3">
        <div class="tile is-parent">
          <Table class="tile is-child" @click="selectRegion" />
        </div>
      </div>
      <div class="tile is-9 is-vertical">
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
            <InfoBox class="tile is-child"/>
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
import InfoBox from '@/components/InfoBox'
export default {
  components: {
    Table,
    BarLine,
    Map,
    Scatter,
    InfoBox
  },
  props: {
    msg: String
  },
  methods: {
    highlightDot(option) {
      if(option.dataIndex) {
        this.$refs.scatter.dispatchAction({type: "highlight", dataIndex: option.dataIndex})
      } else {
        this.$refs.scatter.dispatchAction({type: "highlight", name: option})
      }
    },
    downplayDot(option) {
      if(option.dataIndex) {
        this.$refs.scatter.dispatchAction({type: "downplay", dataIndex: option.dataIndex})
      } else {
        this.$refs.scatter.dispatchAction({type: "downplay", name: option})
      }
    },
    highlightMap(option) {
      if(option.dataIndex) {
        this.$refs.map.dispatchAction({type: "highlight", dataIndex: option.dataIndex})
      } else {
        this.$refs.map.dispatchAction({type: "highlight", name: option})
      }
    },
    downplayMap(option) {
      if(option.dataIndex) {
        this.$refs.map.dispatchAction({type: "downplay", dataIndex: option.dataIndex})
      } else {
        this.$refs.map.dispatchAction({type: "downplay", name: option})
      }
    },
    selectRegion(option){
      let name = option.county?option.county:option.data.county?option.data.county:option.data[3].county
      if(this.currentIndex) {
        this.downplayDot(this.currentIndex)
        this.downplayMap(this.currentIndex)
      }
      this.currentIndex = name
      this.highlightDot(name)
      this.highlightMap(name)
      this.$store.commit('updateRegion',{
        type: 'county',
        name: name
      })
    }
  },
  data() {
    return {
      currentIndex: null
    }
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
