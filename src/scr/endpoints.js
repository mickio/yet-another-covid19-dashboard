const ROOT = 'https://corona.zentralcloud.de'
// const ROOT = ''
// const ROOT = 'http://localhost:8000'
// const ROOT = process.env.VUE_APP_API_ENDPOINT_ROOT
const BUND = 'Bundesgebiet'
const RKI_FEATURE_SNAPSHOT = 'RKI_Landkreisdaten'
const RKI_FEATURE_TIME_SERIES = 'RKI_COVID19'
const URLRKI = 'https://services7.arcgis.com'
const RKI_feature_service_path = (feature) => `/mOBPykOjAyBO2ZKk/arcgis/rest/services/${feature}/FeatureServer/0/query`
const RKI_QUERY_time_series = (county, type,qualifier) => county === BUND ?
    `where=${type}>0&outFields=*&outSR=4326&f=geojson&groupByFieldsForStatistics=Meldedatum,${qualifier}&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22${type}%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderByFields=Meldedatum,${qualifier}`:
    `where=${type}>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&groupByFieldsForStatistics=Meldedatum,${qualifier}&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22${type}%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderByFields=Meldedatum,${qualifier}`
const RKI_Query_last_report = (county, type,qualifier) => county === BUND ?
    `f=geojson&where=${qualifier}%20IN(1,%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22${type}%22,%22outStatisticFieldName%22:%22diff%22}]&resultType=standard&cacheHint=true`:
    `f=geojson&where=Landkreis='${county}'%20AND%20${qualifier}%20IN(1,%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22${type}%22,%22outStatisticFieldName%22:%22diff%22}]&resultType=standard&cacheHint=true`
const RKI_Query_total = (county, type) => county === BUND ?
    `f=geojson&where=${type}>0&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22${type}%22,%22outStatisticFieldName%22:%22Gesamtfaelle%22}]&resultType=standard&cacheHint=true`:
    `f=geojson&where=Landkreis='${county}'%20AND%20${type}%20>%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22${type}%22,%22outStatisticFieldName%22:%22Gesamtfaelle%22}]&resultType=standard&cacheHint=true`

export default {
    RKI_time_series_endpoint: (county,type,qualifier) => `${URLRKI}${RKI_feature_service_path(RKI_FEATURE_TIME_SERIES)}?${RKI_QUERY_time_series(county,type,qualifier)}`,
    RKI_last_reported_value_endpoint: (county,type,qualifier) => `${URLRKI}${RKI_feature_service_path(RKI_FEATURE_TIME_SERIES)}?${RKI_Query_last_report(county,type,qualifier)}`,
    RKI_totals_endpoint: (county,type) => `${URLRKI}${RKI_feature_service_path(RKI_FEATURE_TIME_SERIES)}?${RKI_Query_total(county,type)}`,
    RKI_snapshot_endpoint: `${URLRKI}${RKI_feature_service_path(RKI_FEATURE_SNAPSHOT)}?where=1%3D1&outFields=*&returnGeometry=false&outSR=4326&f=geojson&orderByFields=cases7_per_100k desc`,
    RKI_last_week_snapshot_endpoint: `${URLRKI}${RKI_feature_service_path(RKI_FEATURE_TIME_SERIES)}?f=geojson&groupByFieldsForStatistics=IdLandkreis%2CLandkreis&where=Meldedatum%20%3E%20CURRENT_TIMESTAMP%20-%20INTERVAL%20%2714%27%20DAY%20AND%20Meldedatum%20%3C%20CURRENT_TIMESTAMP%20-%20INTERVAL%20%2707%27%20DAY&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=%2A&outStatistics=%5B%7B%22statisticType%22%3A%20%22sum%22%2C%20%22onStatisticField%22%3A%20%22AnzahlFall%22%2C%20%22outStatisticFieldName%22%3A%20%22confirmed7%22%7D%2C%20%7B%22statisticType%22%3A%20%22sum%22%2C%20%22onStatisticField%22%3A%20%22AnzahlTodesfall%22%2C%20%22outStatisticFieldName%22%3A%20%22deaths7%22%7D%5D&resultType=standard&cacheHint=true`,
    JHU_history_URL: (country, state) => `${ROOT}/data?country=${country}${state?'&state='+state:''}`,
    JHU_snapshot_endpoint: `${ROOT}/snapshot`,
    JHU_snapshot_URL: 'https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Nc2JKvYFoAEOFCG5JSI6/FeatureServer/1/query?f=geojson&where=(Confirmed%20%3E%200)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Deaths%20desc%2CCountry_Region%20asc%2CProvince_State%20asc&outSR=102100&resultOffset=0&resultRecordCount=10&cacheHint=true',
    JHU_search_URL: (term) => `https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Nc2JKvYFoAEOFCG5JSI6/FeatureServer/1/query?f=geojson&where=(Confirmed%20%3E%200)%20AND%20(Deaths%3E0)%20AND%20(Combined_Key%20Like%20%27%${term}%%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Deaths%20desc%2CCountry_Region%20asc%2CProvince_State%20asc&outSR=102100&resultOffset=0&resultRecordCount=10&cacheHint=true`,

    JHU_snapshot_headers:{
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Host': 'services9.arcgis.com',
        'Origin': 'https://www.arcgis.com',
        'Referer': 'https://www.arcgis.com/apps/opsdashboard/index.html',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'
    } 
}