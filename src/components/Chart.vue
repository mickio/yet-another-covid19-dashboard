<template>
    <div class="card-image">
        <figure >
            <chart
            :options="options"
            autoresize
            @click="option => this.$emit('click',option)"
            @mouseover="option => this.$emit('mouseover',option)"
            @mouseout="option => this.$emit('mouseout',option)"
            ref="chart" />
        </figure>
    </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/scatter'
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
    watch: {
        action(newAction) {
            this.dispatchAction(newAction)
        }
    },
 }
</script>
<style scoped>
figure {
    margin: 0;
}
.echarts {
    height: 45vh;
    width: 100%;
}
</style>