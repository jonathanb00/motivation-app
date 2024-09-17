<template>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="custom-font" >Time for some motivation?</v-card-title>
              <v-card-text v-if="quote">
                <div>
                    <p class="custom-font">{{ quote }}</p>
                    <p class="custom-font"><strong>- {{ author }}</strong></p>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-row>
                    <v-col class="d-flex" cols="auto">
                        <v-btn class="custom-btn" @click="fetchQuote">New Quote</v-btn>
                        <v-btn class="custom-btn ml-2" @click="() => saveQuote(quote, author)">Save To Favourites</v-btn>
                    </v-col>
                </v-row>
                <v-row class="mt-2">
                    <v-col>
                        <v-btn class="custom-btn" @click="displayFavourites">display favourites</v-btn>
                    </v-col>
                </v-row>
                <div v-if="quotes.length">
                    <li class="custom-font" v-for="(q, index) in quotes" :key="index">
                        "{{ q.quote }}" - <strong class="custom-font">{{ q.author }}</strong>
                    </li>
                </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'; 

  const quote = ref('');
  const author = ref('');
  const quotes = ref([]);
  
  const fetchQuote = async () => {
    try{
        const response = await fetch('./api/get-quote');
        const quoteData = await response.json();

        quote.value = quoteData[0].q;
        author.value = quoteData[0].a;

    }catch(error){
        console.log("Couldnt fetch quote, ", error);
    }
  }

  const saveQuote = (quote, author) => {
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    quotes.push({ quote, author });
    localStorage.setItem('quotes', JSON.stringify(quotes));
    displayFavourites();
};

  const displayFavourites = () =>{
    const savedQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    quotes.value = savedQuotes;
  }

  let intervalId = null;
  onMounted(() => {
    fetchQuote();
    intervalId = setInterval(fetchQuote, 60000);
  });

  onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
  });
  
  </script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet');
.custom-btn {
  background-color: #5ad796;
  color: #000000;
  border-radius: 20px;
  text-transform: none;
  font-size: small;
  font-family: "Montserrat", sans-serif;
}
.custom-font {
    font-family: "Montserrat", sans-serif !important;
}

</style>
  