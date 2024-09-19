<template>
  <v-app>
    <div class="background-animation"></div>
    <v-app-bar color="#5ad796" app>
      <v-toolbar-title
        ><v-img src="/tembi-logo.png" alt="Logo" max-width="150" contain></v-img
      ></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text class="black-btn mr-5" @click="openDialog">Favourites </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row class="fill-height" align="center" justify="center">
          <v-col cols="auto" class="text-enter">
            <v-card flat class="quote-card">
              <v-card-title class="custom-font"
                ><strong>Time for some motivation?</strong></v-card-title
              >
              <v-card-text>
                <div class="quote-content">
                  <v-fade-transition class="custom-fade-transition">
                    <div
                      v-if="showContent"
                      :key="currentKey"
                      class="fade-content"
                    >
                      <p class="quote-text">{{ quote }}</p>
                    </div>
                  </v-fade-transition>
                  <v-fade-transition class="custom-fade-transition">
                    <div
                      v-if="showContent"
                      :key="currentKey"
                      class="fade-content"
                    >
                      <p class="author-text">
                        <strong>- {{ author }}</strong>
                      </p>
                    </div>
                  </v-fade-transition>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col class="d-flex" cols="auto">
                    <v-btn class="white-btn" @click="fetchQuote"
                      >New Quote</v-btn
                    >
                    <v-btn
                      class="custom-btn ml-2"
                      @click="() => saveQuote(quote, author)"
                      >Save To Favourites</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-dialog class="custom-dialog" v-model="dialog" max-width="600">
      <v-card color="#5ad796">
        <v-card-title class="custom-font">Favourite Quotes</v-card-title>
        <v-card-text>
          <div v-if="quotes.length">
            <ul>
              <li class="custom-font" v-for="(q, index) in quotes" :key="index">
                "{{ q.quote }}"
                <div>
                  <strong class="custom-font">- {{ q.author }}</strong>
                </div>
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="white-btn" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
  
  <script setup>
import { ref, onMounted, onUnmounted } from "vue";

//References for quotes and state management
const quote = ref("");
const author = ref("");
const quotes = ref([]);
const showContent = ref(true);
const currentKey = ref(0);
const dialog = ref(false);

//Fetches a new quote from the API, documentation available here: https://zenquotes.io/
const fetchQuote = async () => {
  try {
    const response = await fetch("./api/get-quote");
    const quoteData = await response.json();

    quote.value = quoteData[0].q;
    author.value = quoteData[0].a;

    //Used for animation of quotes
    showContent.value = false;
    setTimeout(() => {
      currentKey.value += 1;
      showContent.value = true;
    }, 1000);
  } catch (error) {
    console.log("Couldnt fetch quote, ", error);
  }
};

//Saves the current quote to localstorage, duplicates are not allowed
const saveQuote = (quote, author) => {
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const isDuplicate = quotes.some(
    (q) => q.quote === quote && q.author === author
  );

  if (!isDuplicate) {
    quotes.push({ quote, author });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    alert("Quote was added to your favourites!");
  } else {
    alert("This quote is already saved in your favourites.");
  }
};

//Fetches your saved quotes from the localstorage
const displayFavourites = () => {
  const savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  quotes.value = savedQuotes;
};

const openDialog = () => {
  displayFavourites();
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

let intervalId = null;

//Controls the fetching of new quotes every minute
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

.white-btn {
  background-color: white;
  color: #000000;
  border-radius: 20px;
  text-transform: none;
  border: 1px solid black;
  font-size: small;
  font-family: "Montserrat", sans-serif;
}

.black-btn {
  background-color: #000000;
  color: white;
  border-radius: 20px;
  text-transform: none;
  font-size: small;
  font-family: "Montserrat", sans-serif;
}
.custom-font {
  font-family: "Montserrat", sans-serif !important;
  font-size: large;
}

.custom-dialog {
  background-color: #000000;
}

.scrollable-quotes {
  max-height: 300px;
  overflow-y: auto;
}

ul {
  padding-left: 0;
  list-style-type: none;
}

li {
  margin-bottom: 16px;
}

.quote-card {
  max-width: 800px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0);
  align-items: center;
}

.quote-content {
  text-align: center;
  margin-top: 50px;
}

.quote-text {
  font-size: 2rem;
  font-family: "Montserrat", sans-serif !important;
  text-align: center;
}

.author-text {
  font-size: 1.5rem;
  font-family: "Montserrat", sans-serif !important;
}

.custom-fade-transition-enter-active,
.custom-fade-transition-leave-active {
  transition: opacity 1s ease-in-out transform 1s ease;
}
.custom-fade-transition-enter-active {
  transition-delay: 1s;
}

.custom-fade-transition-enter,
.custom-fade-transition-leave-to {
  opacity: 0;
}

.custom-fade-transition-enter-to,
.custom-fade-transition-leave {
  opacity: 1;
}

.fade-content {
  transition: opacity 2s ease-in-out;
}

.fade-content-enter-active,
.fade-content-leave-active {
  transition: opacity 2s ease-in-out;
}

.fade-content-enter,
.fade-content-leave-to {
  opacity: 0;
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
}

.background-animation::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background-color: rgba(90, 215, 150, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: expand 10s forwards;
}

.background-animation::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 900px;
  height: 900px;
  background-color: transparent;
  border: 5px solid green;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-edges 5s infinite ease-in-out;
  opacity: 0;
}

@keyframes expand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  20% {
    transform: translate(-50%, -50%) scale(3);
  }
  50% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0.5;
  }
  75% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0.5;
  }
}

@keyframes pulse-edges {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
  