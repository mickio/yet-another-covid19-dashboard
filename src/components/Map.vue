<template>
    <div class="card">
        <div class="card-content">
            <chart :options='options'/>
        </div>
    </div>
</template>
<script>
import Chart from '@/components/Chart'
import options from '../charts/geomap-options.js'
export default {
   components: {
       Chart
   },
   data() { return {
       options,
       RKI_snapshot_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&outSR=4326&f=geojson'

   }},
//    async computed() { return {
//        county: this.$store
//    }},
   async created() {
        const features = await this.$root.$loader(this.RKI_snapshot_URL).get()
        if(this.options.series.data.length==0){
            features.forEach(element => {
                this.options.series.data.push({
                    name: element.RS,
                    values: element,
                    value: element.cases7_per_100k
                });
            });
        }
        // this.options.series.boundingCoords = [[13.3199829332097, 52.3761399064255],[13.4274566946754, 52.5049411782812]]
        console.log(this.options.series.data)
    } 
}
</script>