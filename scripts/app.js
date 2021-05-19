new Vue({
    el: '#root',


    data: {
        //mi metto in variabile api_key
        DMDApiKey: '1ad03d62a7a1197b28f83a58805fad9e',

        // v-model per verifica valori inseriti dall'user che saranno parte della mia chiamata API
        queryToSearch: "",
        // arrays vuoti dove inserire i risultati della ricerca - inseriti entrabi per film e serie TV poichè le chiamate differiscono
        filmsList: [],
        tvSeriesList: [],
        //printedFlag = "flag-icon-" + getflag(),
        img_baseUrl: "https://image.tmdb.org/t/p/",


    },

    methods: {
        doSearch() {
            this.axiosForSearch("movie");
            this.axiosForSearch("tv");
            console.log(this.filmsList);
            console.log(this.tvSeriesList);
        },
        axiosForSearch(type) {
            // mi salvo i parametri di ricerca in const a parte - inizio con soli film
            const APIParams = {
                params: {
                    api_key: this.DMDApiKey,
                    query: this.queryToSearch,
                    language: "it-IT",
                }
            };
            // //viene fatta la chiamata API con valore input utente
            axios.get("https://api.themoviedb.org/3/search/" + type, APIParams)
                //condizione per movie e condizione per tv show in risposta
                .then((resp) => {
                    if (type == "movie") {
                        // inserisco risposta in array filmsList
                        this.filmsList = resp.data.results;
                    } else if (type == "tv") {
                        // inserisco risposta in array tvSeriesList

                        // ci sono però dati che differiscono per avere un solo elemento in stampa html- mappo tvSeriesList - in modo da avere anche lì .original_title .title e non .name
                        this.tvSeriesList = resp.data.results.map((TVshow) => {
                            TVshow.name = TVshow.title;
                            TVshow.original_name = TVshow.original_title;
                            return TVshow
                        })
                    }
                });
        },
        getPoster(show) {
            const posterSize = "w500"
            const posterPath = show.poster_path
            const completePosterPath = this.img_baseUrl + posterSize + posterPath;
            return completePosterPath
        },


        //stampo bandiera con v-bind su classe : flag-icon - + risultato getFlag(). 

        getFlag(show) {

            //mi inserisco mappatura x stampa flags
            const langToCountry = {

                'en': ['gb', 'us', 'ca'],
                'es': ['es', 'ar', 'co'],
                'it': ['it'],
                'fr': ['fr'],
                'tr': ['tr'],
                'zh': ['cn'],
                'ja': ['jp'],
            };
            //la mia bandiera di ripiego é US
            const fallbackFlag = 'us';
            //devo verificare con risposta API .original_language
            const queryOriginalLang = show.original_language;
            //devo verificare che la queryOriginalLang coincida con una chiave di langToCountry               
            // Object.keys(obj) – ritorno un array di key su cui posso usare metodo incoldes()
            const chooseFlag = Object.keys(langToCountry).includes(queryOriginalLang) ? langToCountry[queryOriginalLang][0] : fallbackFlag;

            return "flag-icon-" + chooseFlag

        },
    }
})