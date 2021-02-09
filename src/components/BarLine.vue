<template>
    <div class="card">
        <div class="card-content">
            <chart :options='options'/>
        </div>
    </div>
</template>
<script>
import Chart from '@/components/Chart'
import options from '../charts/bar-line-options.js'
import urls from '../scr/urls.js'
export default {
    components: {
        Chart
   },
   data() { return {
        options,
        urls,
   }},
   computed: {
        county() {
            return this.$store.state.name
        },
        thisdata: ()=>{
            console.log(this.$store.state.type) 
            console.log(this.action) 
        }
   },
   methods: {
       async fetchData(region) {
            const features = region!=='Bundesgebiet'?
                await this.$root.$loader(this.urls.RKI_county_history_URL(region)).get():
                await this.$root.$loader(this.urls.RKI_history_URL).get()
            // this.options.yAxis.type = county!=='Bundesgebiet'?'value':'log'
            this.options.series[0].data = []
            features.filter(option => option.NeuerFall==0).forEach(element => {
                this.options.series[0].data.push([element.Meldedatum,element.GesamtFaelleTag])
            })
            this.options.series[1].data = []
            features.filter(option => option.NeuerFall==1 || option.NeuerFall==-1).forEach(element => {
                this.options.series[1].data.push([element.Meldedatum,element.GesamtFaelleTag])
            })
       }
   },
   watch: {
       county(newCounty) {
           this.fetchData(newCounty)
       }
   },
   async created() {
       await this.fetchData('Bundesgebiet')
        // this.options.series.boundingCoords = [[13.3199829332097, 52.3761399064255],[13.4274566946754, 52.5049411782812]]
    } 
}
</script>