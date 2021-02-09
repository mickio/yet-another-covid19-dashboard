<template>
    <table class="table">
        <tbody>
            <tr>
                <td>Neu gemeldet</td>
                <td class="has-text-right"> {{Intl.NumberFormat().format(current.diff)}} </td>
                <td class="has-text-right has-text-light">{{Intl.NumberFormat().format(Math.round(current.diff*100000/current.population))}}</td>
            </tr>
            <tr>
                <td>Neu gemeldeteTodesfälle</td>
                <td class="has-text-right"> {{Intl.NumberFormat().format(current.diff_deaths)}} </td>
                <td class="has-text-right has-text-light">{{Intl.NumberFormat().format(Math.round(current.diff_deaths*100000/current.population))}}</td>
            </tr>
            <tr>
                <td>Insgesamt</td
                ><td class="has-text-right"> {{Intl.NumberFormat().format(current.total)}} </td>
                <td class="has-text-right has-text-light">{{Intl.NumberFormat().format(Math.round(current.total*100000/current.population))}}</td>
            </tr>
            <tr>
                <td>Davon genesen</td>
                <td class="has-text-right"> {{Intl.NumberFormat().format(current.genesen)}} </td>
                <td class="has-text-right has-text-light">{{Intl.NumberFormat().format(Math.round(current.genesen*100000/current.population))}}</td>
            </tr>
            <tr>
                <td>Davon gestorben</td>
                <td class="has-text-right"> {{Intl.NumberFormat().format(current.gestorben)}} </td>
                <td class="has-text-right has-text-light">{{Intl.NumberFormat().format(Math.round(current.gestorben*100000/current.population))}}</td>
            </tr>
            <tr>
                <td>Noch aktiv</td>
                <td class="has-text-right"> {{Intl.NumberFormat().format(current.total-current.genesen-current.gestorben)}} </td>
                <td class="has-text-right has-text-light">{{Intl.NumberFormat().format(Math.round((current.total-current.genesen-current.gestorben)*100000/current.population))}}</td>
            </tr>
        </tbody>
    </table>
</template>
<script>
import urls from '../scr/urls.js'
export default {
    data() {
        return {
            urls,
            current: {}
        }
    },
    computed: {
        county() {
            return this.$store.state.name
        },
    },
    methods: {
        async fetchData(option) {
            let diff, diff_deaths, total, genesen, gestorben, population
            if (option=='Bundesgebiet') {
                [diff, diff_deaths, total, genesen, gestorben] = await Promise.all([
                    this.$root.$loader(this.urls.RKI_last_report_URL).get().then(properties => properties[0].diff ),
                    this.$root.$loader(this.urls.RKI_last_report_deaths_URL).get().then(properties => properties[0].diff ),
                    this.$root.$loader(this.urls.RKI_total_URL).get().then(properties => properties[0].GesamtFaelle),
                    this.$root.$loader(this.urls.RKI_genesen_URL).get().then(properties => properties[0].GesamtFaelle),
                    this.$root.$loader(this.urls.RKI_gestorben_URL).get().then(properties => properties[0].GesamtFaelle),
                ])
                population = 83019213
            } else {
                [diff, diff_deaths, total, genesen, gestorben, population] = await Promise.all([
                    this.$root.$loader(this.urls.RKI_last_report_county_URL(option)).get().then(properties => properties[0].diff ),
                    this.$root.$loader(this.urls.RKI_last_report_deaths_county_URL(option)).get().then(properties => properties[0].diff ),
                    this.$root.$loader(this.urls.RKI_total_county_URL(option)).get().then(properties => properties[0].GesamtFaelle),
                    this.$root.$loader(this.urls.RKI_genesen_county_URL(option)).get().then(properties => properties[0].GesamtFaelle),
                    this.$root.$loader(this.urls.RKI_gestorben_county_URL(option)).get().then(properties => properties[0].GesamtFaelle),
                    this.$root.$loader(this.urls.RKI_snapshot_URL).get().then(properties => properties.find(el=>el.county==option).EWZ)
                ]) 
            }
            this.current = {
                diff: diff,
                diff_deaths: diff_deaths,
                total: total,
                genesen: genesen,
                gestorben: gestorben,
                population: population 
            }
        }
    },
    async created() {
        await this.fetchData('Bundesgebiet')
    },
    watch: {
        async county(option) {
            await this.fetchData(option)
        }
    }
}
</script>
<style scoped>
.table {
    /* scroll-behavior: auto; */
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.8rem;
}
.has-text-right {
    text-align: right;
}
.has-text-light {
    color: hsl(0,2%,70%)
}
</style>