<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="textcontainer">
        <h2>Seniorfestival</h2>

        <audio preload="meta">
          <source src="/music/seniorfestivalrap.mp3" type="audio/mp3" />
        </audio>

        <img
          v-if="!state.isRapPlaying"
          src="/image/playbutton.png"
          class="playbutton"
          @click="toggleAudio"
        />

        <div v-else class="stopbutton" @click="toggleAudio">Stop</div>

        <p>
          Du spurgte om vi ik’ sku’ ta’ på KE<br />
          Jeg var ik’ så sikker, men du sag’, at jeg sku med<br />
          Du havde vært’ der før - så jeg var helt okay<br />
          Snakked skum, musik, pomfritter, boder, dans og DJ<br />
        </p>
        <p>
          Så vi pakked’ op til skyen ind i vognen<br />
          Sad lidt klemt med telt og pløkker og dåserognen<br />
          En grøn høstet mark og solskin fra oven<br />
          Teltene i rækker, skinner gult som var det morgen<br />
        </p>
        <p>
          Det helt vildt – en energi<br />
          Det lidt en hvepserede jeg er gået helt ind i.<br />
          Her er de unge uden filter bare fri.<br />
          Mørket sænker sig og hegnet synes helt hellig.<br />
        </p>
        <p>
          En tung bund – den rammer hårdt<br />
          Første fest i gang på festivallen – oh lord!<br />
          Det lige nu det sker - jeg afsted<br />
          Glemmer alt om alt andet, jeg skal ha’ det hele med!<br />
        </p>
        <p class="refrain">
          Jeg kan mærke – det bli'r godt<br />
          Når lyset rammer, blir du ekstra flot!<br />
          Jeg kan sagtens – bare vær’<br />
          I Seniorfestivalens atmosfære<br />
        </p>
        <p class="refrain">
          Vi er sammen – vi er her<br />
          En stor forsamling, men med plads til fler’<br />
          Her er alle lige værd<br />
          I Seniorfestivalens atmosfære<br />
        </p>
        <p>
          En scene nok på størrelse med et rumskib<br />
          Lyset sender bud og skaber rum jeg kan vær’ i<br />
          En kasse pomfrit, helt vandvidt!<br />
          Teltene de åbner jeg må danse helt bramfrit.<br />
        </p>
        <p>
          Et øje lukket, dagens første lys når ind<br />
          BMO på pladsen med et brass – jeg hører Fløjte Finn<br />
          En hal med helt utænkelige mange sjove ting<br />
          Skummet vokser hurtig - jeg kan slet ik’ se en pind!<br />
        </p>
        <p>
          Det helt vildt – en energi<br />
          Jeg ser mig selv på selfie, tænker rizz, jeg er heldig!<br />
          Mit kredshood – vi skal ha’ mere tut<br />
          Griner til en grinern støj fra scenen, helt vingeskudt!<br />
        </p>
        <p>
          En tung bund – den rammer hårdt<br />
          Ingen dans forever, presset stiger, jeg skal læg en lårt<br />
          Det lig’ nu – jeg tilbage<br />
          Folder mine hænder, takker herren for en vild dag!<br />
        </p>
        <p class="refrain">
          Jeg kan mærke – det bli'r godt<br />
          Når lyset rammer, blir du ekstra flot!<br />
          Jeg kan sagtens – bare vær’<br />
          I Seniorfestivalens atmosfære<br />
        </p>
        <p class="refrain">
          Vi er sammen – vi er her<br />
          En stor forsamling, men med plads til fler’<br />
          Her er alle lige værd<br />
          I Seniorfestivalens atmosfære<br />
        </p>
        <p>
          Søndag morgen, duggen hænger tungt på græsset<br />
          Natten den var lang, for karaoke-mic’en kradsed<br />
          Nu spiller alt igen og app’en sender notits<br />
          Endnu en event i vente, sætter lig’ en go frits<br />
        </p>
        <p>
          Uden tvivl den bedste weekend op til månen<br />
          Seniortoget kører, reservér en plads på gåben<br />
          Det helt vildt – en energi<br />
          Et hav af forbundsskjorter fylder hvert et brugt batteri<br />
        </p>
        <p>
          En stor afsked, tåre-reaktion<br />
          Tilføjer venner løs på Snap og telefon<br />
          Det helt vildt – en energi<br />
          Seniorfestival for denne gang er forbi<br />
        </p>
        <p class="refrain">
          Jeg kan mærke – det bli'r godt<br />
          Når lyset rammer, blir du ekstra flot!<br />
          Jeg kan sagtens – bare vær’<br />
          I Seniorfestivalens atmosfære<br />
        </p>
        <p class="refrain">
          Vi er sammen – vi er her<br />
          En stor forsamling, men med plads til fler’<br />
          Her er alle lige værd<br />
          I Seniorfestivalens atmosfære<br />
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import { IonPage,IonContent } from '@ionic/vue';
import { reactive } from 'vue';

const state = reactive({
    isRapPlaying: false
});

function toggleAudio() {
  var myPlayer = document.getElementsByTagName("audio")[0];
  if (state.isRapPlaying) {
    stopAudio();
  } else {
    //startSpinnig();
    myPlayer.load();
    myPlayer.play();
    state.isRapPlaying = true;
    myPlayer.addEventListener("ended", stopAudio)
  }
}

function stopAudio() {
  state.isRapPlaying = false;
  var myPlayer = document.getElementsByTagName("audio")[0];
  myPlayer.removeEventListener("ended", stopAudio);
  myPlayer.load();
}
</script>

<style lang="css" scoped>
.textcontainer {
  margin-top: calc(var(--safe-area-inset-top, 0) + 30px);
  margin-bottom: 110px;
  margin-left: 10px;
  margin-right: 10px;
}

.textcontainer a {
  color: var(--sf-primary-color);
}

.textcontainer h2 {
  margin-top: 40px;
}

.refrain {
  color: var(--sf-primary-color);
}

.playbutton {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 51;
  width: 50px;
  animation: shake 0.8s;
  animation-iteration-count: infinite;
}

.stopbutton {
  position: absolute;
  top: 40px;
  right: 40px;
  z-index: 51;
  width: 40px;
  height: 40px;
  background-color: red;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: spinning 2s linear infinite;
}

@keyframes spinning {
  100% {
    -webkit-transform: rotate(720deg);
    transform: rotate(720deg);
  }
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
