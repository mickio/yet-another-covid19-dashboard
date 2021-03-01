<template>
    <div class="card is-full-height">
        <div class="title">
            Infektionsgeschehen im {{state.name}}
        </div>
        <chart ref="chart" :options='options'/>
        <div class="card-footer">
            <nav>
                <ul>
                    <li ref="daily-values" class="is-active"><a @click="setTab('daily-values')" >Tägliche Meldungen</a></li>
                    <li ref="cumulative-values"><a @click="setTab('cumulative-values')">kumulativ</a></li>
                </ul>
            </nav>
        </div>
    </div>
</template>
<script>
import Chart from '@/components/Chart'
import options from '../charts/bar-line-options.js'
import endpoints from '../scr/endpoints.js'
import {fetchRKITimeSeries, fetchJHUTimeSeries} from '../scr/helpers.js'
export default {
    components: {
        Chart
    },
    data() { return {
        options,
        endpoints,
        isCumulative: false,
        currentTab: null,
        timeSeries: null,
        seriesType: 'diffs'
    }},
    computed: {
        state() {
            return this.$store.state.setting
        },
    },
    methods: {
        async setTab(type) {
            let types = ['daily-values','cumulative-values'].filter(t=>t!==type) 
            this.$refs[type].classList.add('is-active')
            types.forEach(t=>this.$refs[t].classList.remove('is-active'))
            if(type == 'daily-values'){
                this.timeSeries = this.state.type==='county' ? this.setTimeSeriesDataCounty : this.setTimeSeriesDataCountry
                // this.options.yAxis[0].type = "value"
                this.options.series[0].type = "bar"
                this.options.series[3].type = "bar"
            } else {
                console.log("switch")
                this.timeSeries = this.state.type==='county' ? this.setTimeSeriesDataCountyCumulative : this.setTimeSeriesDataCountryCumulative
                // this.options.yAxis[0].type = "log"
                // this.options.series[0].type = "line"
                // this.options.series[3].type = "line"
            }
            await this.timeSeries(this.state.name)
        },
        async setTimeSeriesDataCounty(county) {
            let endpoint_confirmed = this.endpoints.RKI_time_series_endpoint(county, 'AnzahlFall', 'NeuerFall')
            let endpoint_deaths = this.endpoints.RKI_time_series_endpoint(county, 'AnzahlTodesfall', 'NeuerTodesfall')
            const [data_confirmed, data_deaths] = await Promise.all([ 
                this.$root.$loader(endpoint_confirmed).getComputed( fetchRKITimeSeries ),
                this.$root.$loader(endpoint_deaths).getComputed( fetchRKITimeSeries )
            ])
            this.options.series[0].data = data_confirmed.timeSeries[0]
            this.options.series[1].data = data_confirmed.timeSeries[1]
            this.options.series[2].data = data_confirmed.movingAverageSeries
            this.options.series[3].data = data_deaths.timeSeries[0]
            this.options.series[4].data = data_deaths.timeSeries[1]
            this.options.series[5].data = data_confirmed.expRegressionSeries
        },
        async setTimeSeriesDataCountry(country) {
            let endpoint_country = this.endpoints.JHU_history_URL(country)
            const data = await this.$root.$loader(endpoint_country).getComputed(fetchJHUTimeSeries)
            this.options.series[0].data = data.timeSeriesConfirmed
            this.options.series[1].data = []
            this.options.series[2].data = data.timeSeriesConfirmedMovingAverage
            this.options.series[3].data = data.timeSeriesDeaths
            this.options.series[4].data = []
            this.options.series[5].data = data.timeSeriesR
        },
        async setTimeSeriesDataCountyCumulative(county) {
            let endpoint_confirmed = this.endpoints.RKI_time_series_endpoint(county, 'AnzahlFall', 'NeuerFall')
            let endpoint_deaths = this.endpoints.RKI_time_series_endpoint(county, 'AnzahlTodesfall', 'NeuerTodesfall')
            const [data_confirmed, data_deaths] = await Promise.all([ 
                this.$root.$loader(endpoint_confirmed).getComputed( fetchRKITimeSeries ),
                this.$root.$loader(endpoint_deaths).getComputed( fetchRKITimeSeries )
            ])
            this.options.series[0].data = data_confirmed.cumulativeSeries
            this.options.series[1].data = []
            this.options.series[2].data = data_deaths.cumulativeSeries
            this.options.series[3].data = []
            this.options.series[4].data = []
            this.options.series[5].data = []
        },
        async setTimeSeriesDataCountryCumulative(country) {
            let endpoint_country = this.endpoints.JHU_history_URL(country)
            const data = await this.$root.$loader(endpoint_country).getComputed(fetchJHUTimeSeries)
            this.options.series[0].data = data.timeSeriesConfirmedCumulative
            this.options.series[1].data = []
            this.options.series[2].data = data.timeSeriesActiveCumulative
            this.options.series[3].data = data.timeSeriesDeathsCumulative
            this.options.series[4].data = []
            this.options.series[5].data = []
        },
    },
    watch: {
        async state(newState) {
            console.log(newState)
            if (newState.type == 'county') { 
                this.timeSeries = this.setTimeSeriesDataCounty
            }else if (newState.type == 'country') { 
                this.timeSeries = this.setTimeSeriesDataCountry
            }
            await this.timeSeries(newState.name)
        },
    },
    async created() {
        this.timeSeries = this.setTimeSeriesDataCounty
        await this.timeSeries('Bundesgebiet')
    },
    mounted() {
        console.log(this.$refs.chart.$children[0].$el) //@TODO
    }
}
</script>
<style>
.title {
    font-weight: bold;
    padding: 8px 5px;
}
</style>