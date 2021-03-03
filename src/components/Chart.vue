<template>
    <chart        
        :options="options"
        @click="option => this.$emit('click',option)"
        @mouseover="option => this.$emit('mouseover',option)"
        @mouseout="option => this.$emit('mouseout',option)"
        ref="chart" />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/visualMap'

export default {
    components: {chart: ECharts},
    props: ['options', 'action'], 
    methods: {
        dispatchAction(option) {
            this.$refs.chart.dispatchAction(option)
        },
    },
    computed: {
        setting() {return this.$store.state.setting}
    },
    watch: {
        action(newAction) {
            this.dispatchAction(newAction)
        },
        setting() {
            this.$nextTick( () => this.$refs.chart.resize() ) 
            setTimeout(() => {
                this.$refs.chart.resize()
            },1500)
        }
    },
    mounted() {
        setTimeout(() => {
            this.$refs.chart.resize()
        },5500)
        setTimeout(() => {
            this.$refs.chart.resize()
        },6000)
    }
 }
</script>
<style scoped>
/* figure, .card-image {
    margin: 0;
    height: 100%;
} */
.echarts {
    height: 100%;
    width: 100%;
}
</style>