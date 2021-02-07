<template>
    <div class="card">
        <div class="card-content">
            <chart :options='options'/>
        </div>
    </div>
</template>
<script>
import Chart from '@/components/Chart'
import options from '../charts/scatter-options.js'
export default {
    components: {
        Chart
   },
   data() { return {
        options,
        RKI_snapshot_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&outSR=4326&f=geojson',
        RKI_last_week_snapshot_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=geojson&groupByFieldsForStatistics=IdLandkreis%2CLandkreis&where=Meldedatum%20%3E%20timestamp%20%272021-01-04%2000%3A00%3A00%27%20AND%20Meldedatum%20%3C%3D%20timestamp%20%272021-01-11%2000%3A00%3A00%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=%2A&outStatistics=%5B%7B%22statisticType%22%3A%20%22sum%22%2C%20%22onStatisticField%22%3A%20%22AnzahlFall%22%2C%20%22outStatisticFieldName%22%3A%20%22confirmed7%22%7D%2C%20%7B%22statisticType%22%3A%20%22sum%22%2C%20%22onStatisticField%22%3A%20%22AnzahlTodesfall%22%2C%20%22outStatisticFieldName%22%3A%20%22deaths7%22%7D%5D&resultType=standard&cacheHint=true',
   }},
//    async computed() { return {
//        county: this.$store
//    }},
   async created() {
        const [current, lastweek] = await Promise.all([
            this.$root.$loader(this.RKI_snapshot_URL).get(),
            this.$root.$loader(this.RKI_last_week_snapshot_URL).get()
        ]);
        if(this.options.series.data.length==0) {
            current.forEach(el =>{
                const lw = lastweek.find(elem => elem.IdLandkreis===el.RS);
                const rate = (el.cases7_lk-lw.confirmed7)/lw.confirmed7*100;
                lw.f7=el.cases7_lk/lw.confirmed7
                el.lastweek = lw
                this.options.series.data.push([Math.round(el.cases7_per_100k),Math.round(rate),lw,el])
            })
        }
        // this.options.series.boundingCoords = [[13.3199829332097, 52.3761399064255],[13.4274566946754, 52.5049411782812]]
        console.log(this.options.series.data)
    } 
}
</script>