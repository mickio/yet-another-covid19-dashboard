<template>
    <div class="card-image">
        <figure class="image">
            <chart
            :options="options"
            autoresize
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

import landkreise from '@/charts/landkreise.geo.json'
import country_regions from '@/charts/country_regions.geo.json'

ECharts.registerMap('landkreise',landkreise)
ECharts.registerMap('worldmap',country_regions)

export default {
    components: {chart: ECharts},
    props: ['options'],
    methods: {
        dispatchAction(option) {
            this.$refs.chart.dispatchAction(option)
        }
    },
    computed: {
        action() {
            this.dispatchAction(this.$store.action)
            return this.$store.action
        }
    },
 }
</script>
<style scoped>
.echarts {
    height: 33vh;
    width: 100%;
}
</style>