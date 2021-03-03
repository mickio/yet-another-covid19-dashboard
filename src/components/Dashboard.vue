<template>
  <main>
    <section class="is-fullheight-grid">
      <Table @mouseover="highlightAll" @mouseout="downplayAll" />
    </section>
    <section class="is-upper-row">
      <InfoBox/>
      <BarLine/>
    </section>
    <section>
      <Map ref="map" @mouseover="highlightDot" @mouseout="downplayDot"/>
    </section>
    <section>
      <Scatter ref="scatter" @mouseover="highlightMap" @mouseout="downplayMap"/>
    </section>
  </main>
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
    highlightAll(option){
      this.highlightMap(option)
      this.highlightDot(option)
    },
    downplayAll(option){
      this.downplayMap(option)
      this.downplayDot(option)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
Map, Scatter, BarLine, InfoBox {
  height: 100%;
  width: 100%
}
main {
  background-color: var(--background-color);
  display: grid;
  grid-template-columns: min-content 1fr 1fr;
  grid-template-rows: 300px calc(100vh - 300px - 0.5rem); 
  /* grid-template-rows: min-content auto;  */
  grid-gap: var(--gap);
  height:100vh;
  box-sizing: border-box;
}
section {
  background-color: var(--background-color);
  clear: both;
  /* border: 1px dashed blue; */
}
.is-fullheight-grid{
  height: 100%;
  grid-row: 1/3;
}
.is-upper-row {
  grid-column:2/4;
  display: flex;
  column-gap: var(--gap);
  flex-direction:row-reverse;
}
@media only screen and (max-width: 800px) {
  main {
    display: flex;
    flex-direction:column;
  }
  .is-upper-row {
    display: flex;
    flex-direction:column-reverse;
  }
}
</style>
