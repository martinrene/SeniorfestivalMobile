<template>
  <div class="board">
    <div class="boardSection">
      <h3>Bedste i dag</h3>
      <p v-if="!leaderboard.today.length" class="boardEmpty">
        Ingen endnu
      </p>
      <ol v-else>
        <li v-for="(entry, index) in leaderboard.today" :key="index">
          <span class="boardName">{{ entry.name }}</span>
          <span class="boardScore">{{ entry.score }}</span>
        </li>
      </ol>
    </div>

    <div class="boardSection">
      <h3>Bedste i hele festivalen</h3>
      <p v-if="!leaderboard.festival.length" class="boardEmpty">
        Ingen endnu
      </p>
      <ol v-else>
        <li v-for="(entry, index) in leaderboard.festival" :key="index">
          <span class="boardName">{{ entry.name }}</span>
          <span class="boardScore">{{ entry.score }}</span>
        </li>
      </ol>
    </div>

    <p v-if="leaderboard.me" class="myPosition">
      Du er nr. {{ leaderboard.me.position }} af
      {{ leaderboard.me.total }}
    </p>
  </div>
</template>

<script setup lang="js">
defineProps({
  // The payload from the GameScores endpoint: today, festival and me.
  leaderboard: { type: Object, required: true },
});
</script>

<style lang="css" scoped>
.board {
  margin: 4px 0 20px;
  text-align: left;
}

.boardSection {
  margin-bottom: 14px;
}

.boardSection h3 {
  margin: 0 0 6px;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sf-muted-color);
}

.boardSection ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

.boardSection li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(21, 18, 26, 0.07);
}

.boardSection li:last-child {
  border-bottom: none;
}

.boardName {
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.boardScore {
  font-family: "brico-condensed", sans-serif;
  font-size: 1.4rem;
  flex: 0 0 auto;
}

.boardEmpty {
  margin: 0;
  color: var(--sf-muted-color);
  font-size: 0.9rem;
}

.myPosition {
  margin: 0;
  padding-top: 10px;
  border-top: 1px solid var(--sf-border, #e4dfd8);
  text-align: center;
  font-weight: 800;
  color: var(--sf-primary-color);
}
</style>
