<template>
    <div class="card" style="width: max-content">
        <p>Aktuelle Werte vom {{current.date}} </p>
        <p style="text-transform: uppercase;text-align:right; font-size: 6pt ">Gesamt | <span style="text-transform: uppercase;text-align:right; font-size: 6pt" class="has-text-light">je 100.000</span></p>
        <table class="table">
            <tbody>
                <tr>
                    <td>Neu gemeldet</td>
                    <td class="has-text-right"> {{Intl.NumberFormat().format(current.diff)}} </td>
                    <td class="has-text-right has-text-light">{{Intl.NumberFormat().format(Math.round(current.diff*100000/current.population))}}</td>
                </tr>
                <tr>
                    <td>Neu gemeldete Todesfälle</td>
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
                    <td class="has-text-right"> {{Intl.NumberFormat().format(current.active)}} </td>
                    <td class="has-text-right has-text-light">{{Intl.NumberFormat().format(Math.round((current.total-current.genesen-current.gestorben)*100000/current.population))}}</td>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                    <td style="text-transform: uppercase">{{current.r > 1 ? 'Verdopplungszeit (Tage)' : current.r == 1 ? 'Tendenz gleichbleibend' : 'Halbierungszeit (Tage)'}}</td>
                    <td></td>
                    <td class="has-text-right"> {{current.r == 1 ?'' : Math.abs(current.t)}} </td>
                </tr>
                <tr>
                    <td style="font-style: italic">mittl. Veränderung</td>
                    <td></td>
                    <td class="has-text-right"> {{current.d}}% </td>
                </tr>
                <tr>
                    <td style="font-style: italic">Reproduktionszahl R</td>
                    <td></td>
                    <td class="has-text-right"> {{current.r}} </td>
                </tr>
                <tr>
                    <td style="font-style: italic">7-Tage-Inzidenz</td>
                    <td></td>
                    <td class="has-text-right"> {{current.incidence}} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import endpoints from '../scr/endpoints.js'
import {fetchRKITimeSeries} from '../scr/helpers.js'
export default {
    data() {
        return {
            endpoints,
            current: {},
        }
    },
    computed: {
        state() {
            return this.$store.state.setting
        },
    },
    methods: {
        async fetchDataCounty(option) {
            let endpoint_confirmed = this.endpoints.RKI_time_series_endpoint(option, 'AnzahlFall', 'NeuerFall')
            let diff, diff_deaths, total, genesen, gestorben, population, timeSeries, incidence
            [diff, diff_deaths, total, genesen, gestorben, population, incidence] = await Promise.all([
                this.$root.$loader(this.endpoints.RKI_last_reported_value_endpoint(option,'AnzahlFall','NeuerFall')).get().then(properties => properties[0].diff ),
                this.$root.$loader(this.endpoints.RKI_last_reported_value_endpoint(option,'AnzahlTodesFall','NeuerTodesfall')).get().then(properties => properties[0].diff ),
                this.$root.$loader(this.endpoints.RKI_totals_endpoint(option,'AnzahlFall')).get().then(properties => properties[0].Gesamtfaelle),
                this.$root.$loader(this.endpoints.RKI_totals_endpoint(option,'AnzahlGenesen')).get().then(properties => properties[0].Gesamtfaelle),
                this.$root.$loader(this.endpoints.RKI_totals_endpoint(option,'AnzahlTodesfall')).get().then(properties => properties[0].Gesamtfaelle),
                option=='Bundesgebiet' ? 83019213 : this.$root.$loader(this.endpoints.RKI_snapshot_endpoint).get().then(properties => properties.find(el=>el.county==option).EWZ),
                option=='Bundesgebiet' ? 
                        this.$root.$loader(this.endpoints.RKI_snapshot_endpoint).get().then(properties => properties.reduce((s,t)=>s + t.cases7_lk,0)*100000/83019213) : 
                        this.$root.$loader(this.endpoints.RKI_snapshot_endpoint).get().then(properties => properties.find(el=>el.county==option).cases7_per_100k)
            ]) 
            timeSeries = await this.$root.$loader(endpoint_confirmed).getComputed( fetchRKITimeSeries )
            let r = timeSeries.expRegressionSeries[timeSeries.expRegressionSeries.length-1]
            this.current = {
                date: new Date().toLocaleDateString(),
                diff: diff,
                diff_deaths: diff_deaths,
                total: total,
                genesen: genesen,
                gestorben: gestorben,
                active: total - genesen -gestorben,
                population: population,
                r: Math.round(100*r[1])/100,
                t: Math.round(4/Math.log2(r[1])),
                d: Math.round((r[1]**(7/4)-1)*100),
                incidence:  Math.round(incidence)
            }
        },
        async fetchDataCountry(option) {
            let endpoint_country = this.endpoints.JHU_history_URL(option)
            const data = await this.$root.$loader(endpoint_country).get()
            const ds = data[data.length-1]
            this.current = {
                date: new Date().toLocaleDateString(),
                diff: ds.d_confirmed,
                diff_deaths: ds.d_deaths,
                total: ds.confirmed,
                genesen: ds.recovered,
                gestorben: ds.deaths,
                active: ds.active,
                population: Math.round(ds.confirmed/ds.incidence * 100000),
                r: Math.round(100*ds.r)/100,
                t: Math.round(1/ds.rate_active),
                d: Math.round((ds.r**(7/4)-1)*100),
                incidence: Math.round(ds.d_confirmed_7 * ds.incidence / ds.confirmed) 
            }
        },
        fetchData(state) {
            let fetchData = state.type == 'county' ? this.fetchDataCounty : this.fetchDataCountry
            fetchData(state.name)
        }
    },
    created() {
        this.fetchData(this.state)
    },
    watch: {
        state(state) {
            this.fetchData(state)
        }
    }
}
</script>
<style scoped>
.table {
    /* scroll-behavior: auto; */
    font-size: var(--normal-text);
    width: max-content;
    text-transform: ;
}
.has-text-right {
    text-align: right;
}
.has-text-light {
    color: var(--light-color)
}
@media only screen and (max-width: 800px) {
    .table {
        width: 100%;
        font-size: var(--header-text);
    }
    table, th, td {
        border-spacing: 2em 0.5em;
    }
    .card {
        width: 80vw;
        height: max-content;
        margin: 20px auto;
    }
}
</style>
