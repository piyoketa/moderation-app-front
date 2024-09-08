<template>
  <div class="l-main">
    <div v-if="scene == 'title'" @click="scene = 'introduction'" class="l-top d-flex flex-column justify-center position-relative h-100">
      <!-- <img :src="TopImage" class="position-absolute"> -->
      <p class="outlined-text" style="font-size: 100px">
        有害コンテンツ<br>
        シューティング
      </p>
      <p style="margin-top: 20px; font-size:30px;">はじめる</p>
    </div>
    <div v-if="scene == 'introduction'" @click="gameStart()" class="l-introduction d-flex flex-column justify-center position-relative h-100">
      <div class="outlined-text" style="z-index: 1">
        <h1>お題に沿った<span style="font-size: 1.5em; color: red; font-family: 'isego'">キケンな文章</span>を撃て!</h1>
        <p class="mt-5">
          君が入力した文章が<span style="font-size: 1.5em; font-family: 'isego'">有害</span>かどうか、OpenAI（Moderation API）が判定するぞ！
        </p>
        <p class="mt-5">
          <span style="font-size: 1.5em;">お題は５つ</span><br>
          sexual（性的）<br>
          hate（ヘイト）<br>
          harassment（嫌がらせ）<br>
          self-harm（自傷）<br>
          violence（暴力）<br>
        </p>
        <p class="mt-5">
          <span style="font-size: 1.5em;">白枠のお題</span>に当てれば+100点、<span style="font-size: 1.5em;">黄金のお題</span>なら+300点だ！
        </p>
        <p>
          同時に<span style="font-size: 1.5em;">複数</span>のお題に当てれば点数が増えるぞ！
        </p>
        <p class="mt-5">
          作者が思っていたよりModeration APIの感度は低い！<br>
          <span style="font-size: 1.5em; font-family: 'isego'">露骨に有害な文章</span>じゃないと反応しないぞ！
        </p>
        <p style="margin-top: 20px; font-size:30px;">クリックで開始</p>
      </div>
    </div>
    <div v-if="scene == 'wave'" class="d-flex flex-column position-relative h-100">
      <img :src="HitmanImage" class="position-absolute" style="bottom: -15px;left: -30px;width: 400px;">
      <div class="text-left">
        <h2 class="font-weight-bold mb-8">スコア: {{ totalScore }} 残り時間:{{ formattedTime }}秒</h2>
      </div>
      <div class="d-flex" style="min-height: 300px;">
        <div v-for="target in targets" :key="target" class="flex-grow-1 d-flex flex-column align-center mb-5">
          <div>
            {{ target.toUpperCase() }}
          </div>
          <div class="position-relative">
            <v-avatar
              size="120"
              :class="{'is-opacity': !activeTargetNames.includes(target), 'is-active': activeTargetNames.includes(target), 'is-gold': activeGoldTargetNames.includes(target)}"
            >
              <template v-if="targetImg(target)">
                <v-img :alt="target" :src="targetImg(target)"></v-img>
              </template>
            </v-avatar>

            <div v-if="lastModerationResponse.result.categories[target]" class="c-targetIcon position-absolute">
              <img v-show="isShooting" :src="BreakIcon" style="width: 100%" />          
              <img v-show="!isShooting" :src="TargetIcon" style="width: 100%" />          
            </div>
          </div>
          <div class="c-scoreLabel" :class="getFontSize(target)">
            {{ lastModerationResponse.result.category_scores[target].toFixed(2) }}
          </div>
        </div>
      </div>
      <h2 class="font-weight-bold mb-5" style="height:100px;width:600px; margin-left: auto;text-align: left;font-size: 60px;z-index: 10;">
        {{ message }}
      </h2>
      <div class="d-flex align-center">
        <v-text-field
          v-model="bulletInput"
          label="キケンな文章を入力せよ！"
          variant="solo"
          prepend-inner-icon="mdi-pistol"
          hide-details
          @keydown="handleInput"
          :loading="isLoading"
          class="pr-4"
        />
        <v-btn 
          variant="flat"
          @click="handleShoot" 
          base-color="red"
          size="large"
          min-height="56"
          :loading="isModerating || isShooting"
        >
          発射（Enterキー）
        </v-btn>
      </div>
      <div v-if="isShooting" class="position-absolute d-flex align-center justify-center pointer-events-none" style="top: 0;bottom: 0;left: 0;right: 0;">
        <div class="animate-shoot outlined-text" style="font-size: 60px;font-weight: bold;color: red;">
          {{ lastBulletInput }}
        </div>
      </div>
    </div>
    <div v-else-if="scene == 'gameover'" @click="scene = 'title'" class="d-flex flex-column justify-center position-relative h-100">
      <h1 style="font-family: 'isemin'">Game Over</h1>
      <h2>スコア:{{ totalScore }}</h2>
      <p style="margin-top: 20px;">クリックでタイトルへ</p>
    </div>
    <audio ref="shootSound" :src="shootSoundFile" preload="auto"></audio>
    <audio ref="reloadSound" :src="reloadSoundFile" preload="auto"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';

// img
import HitmanImage from "../assets/hitman.png"
import BreakIcon from "../assets/break.png"
import TargetIcon from "../assets/target.png"

import ViolenceIcon from "../assets/violence_3.png"
import SexualIcon from "../assets/sexual_2.png"
import SelfHarmIcon from "../assets/self-harm_2.png"
import HarassmentIcon from "../assets/harassment.jpg"
import HateIcon from "../assets/hate.png"

// プリロード用の画像を定義
const preloadImages = () => {
  const images = [
    HitmanImage, BreakIcon, TargetIcon, ViolenceIcon, SexualIcon, SelfHarmIcon, HarassmentIcon, HateIcon
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};
onMounted(() => {
  preloadImages();
});

function targetImg(target){
  if(target == "violence"){
    return ViolenceIcon;
  }else if(target == "sexual"){
    return SexualIcon;
  }else if(target == "self-harm"){
    return SelfHarmIcon;
  }else if(target == 'harassment'){
    return HarassmentIcon;
  }else if(target == 'hate'){
    return HateIcon;
  } else {
    return ViolenceIcon;
  }
}

// audio
import shootSoundFile from "../assets/shootSound.wav"
import reloadSoundFile from "../assets/reload.mp3"
const shootSound = ref(null);
const reloadSound = ref(null);

// シーン管理
const scene = ref('title');

// 残り時間管理
const remainingTime = ref(30.0);
const formattedTime = computed(() => remainingTime.value.toFixed(1));
const isTimerActive = ref(false);
let timerInterval = null;
const startTimer = () => {
  if (isTimerActive.value) return;  // すでにタイマーが動いている場合は何もしない

  isTimerActive.value = true;
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value = parseFloat((remainingTime.value - 0.1).toFixed(1)); // 0.1秒ずつ減少
    } else {
      clearInterval(timerInterval);  // タイマーが0になったら停止
      isTimerActive.value = false;
      scene.value = 'gameover'
    }
  }, 100);  // 100ms (0.1秒) ごとに更新
};

// ゲームステップ管理
const totalScore = ref(0);
const isLoading = ref(false);

// ゲーム本体
const targets = reactive(['sexual', 'hate', 'harassment', 'self-harm', 'violence']);

const activeTargets = reactive([]);
const isModerating = ref(false);
const message = ref("");
const bulletInput = ref('お嬢ちゃん。服を脱いで。今からこの熱い弾丸を君の内にぶち込むぜ。');
const lastBulletInput = ref('お嬢ちゃん。服を脱いで。今からこの熱い弾丸を君の内にぶち込むぜ。');
const firstResult = {
    "flagged": true,
    "categories": {
        "sexual": true,
        "hate": false,
        "harassment": false,
        "self-harm": false,
        "sexual/minors": false,
        "hate/threatening": false,
        "violence/graphic": false,
        "self-harm/intent": false,
        "self-harm/instructions": false,
        "harassment/threatening": false,
        "violence": false
    },
    "category_scores": {
        "sexual": 0.6480855345726013,
        "hate": 0.00008517827518517151,
        "harassment": 0.05396483466029167,
        "self-harm": 0.00009510089876130223,
        "sexual/minors": 0.004417902324348688,
        "hate/threatening": 0.0001123923939303495,
        "violence/graphic": 0.0026437717024236917,
        "self-harm/intent": 0.000054130603530211374,
        "self-harm/instructions": 0.000011552688192750793,
        "harassment/threatening": 0.11248353123664856,
        "violence": 0.28406232595443726
    }
}
const initResposne = {
  "flagged": false,
  "categories": {
      "sexual": false,
      "hate": false,
      "harassment": false,
      "self-harm": false,
      "violence": false
  },
  "category_scores": {
      "sexual": 0.00,
      "hate": 0.00,
      "harassment": 0.00,
      "self-harm": 0.00,
      "violence": 0.00
  }
}
const lastModerationResponse = reactive({ result: firstResult });

// ===========================
// スタイル
// ===========================
const getFontSize = (target) => {
  let result = [];
  const size = parseFloat(lastModerationResponse.result.category_scores[target])

  if (size > 0.2) {
    result.push('text-24px')
  } else if (size > 0.0) {
    result.push('text-18px')
  } else {
    result.push('text-12px')
  }

  if(lastModerationResponse.result.categories[target]){
    result.push('text--red')
  }

  return result
}

// ===========================
// ゲーム開始
// ===========================
function gameStart(){
  scene.value = "wave";
  totalScore.value = 0;
  isLoading.value = false;
  remainingTime.value = 90;

  startTimer();
  startNewWave();
}

// ===========================
// Waveの初期設定
// ===========================
// ランダムにtargetから1つをactiveTargetsに設定
const setRandomActiveTargets = () => {
  // ランダムにtargetsから3つの異なる的を選ぶ
  const shuffledTargets = [...targets].sort(() => 0.5 - Math.random());
  const selectedTargets = shuffledTargets.slice(0, 3);

  // 最初の2つのターゲットはlevel: "normal", 最後の1つはlevel: "gold"に設定
  activeTargets.splice(0, activeTargets.length, 
    ...selectedTargets.map((target, index) => ({
      name: target, 
      level: index < 2 ? "normal" : "gold" 
    }))
  );
};
const activeTargetNames = computed(() => activeTargets.map(target => target.name));
const activeGoldTargetNames = computed(() => activeTargets.filter(target => target.level === "gold").map(target => target.name));

function startNewWave(){
  setRandomActiveTargets();
}

setRandomActiveTargets();

// ===========================
// Moderation API
// ===========================
const executeModerationApi = async () => {
  if(bulletInput.value.length == 0){
    lastModerationResponse.result = initResposne;
    return isModerating.value = false;
  } else if( bulletInput.value == lastBulletInput.value){
    return isModerating.value = false;
  }

  isModerating.value = true;
  lastBulletInput.value = bulletInput.value;
  const response = await fetch('https://asia-northeast1-bustling-psyche-400511.cloudfunctions.net/moderationFunction', {
    method: 'POST', // HTTPメソッドを指定
    headers: {
      'Content-Type': 'application/json' // コンテンツタイプを指定
    },
    body: JSON.stringify({ text: bulletInput.value }) // リクエストボディをJSON文字列に変換
  });

  // レスポンスをJSONとしてパース
  const data = await response.json();
  console.log(data);

  // エラーハンドリング
  if (!response.ok) {
    throw new Error(`エラー: ${data.error.message}`);
  }

  reloadSound.value.play();
  lastModerationResponse.result = data.results[0];
  isModerating.value = false;
};

// -- ▼クエリ入力 ----
// イベント設定
// Debounceテクニックを使い、入力が0.6秒停止した時に検索を実行する
// https://www.webdesignleaves.com/pr/jquery/debounce-and-throttle.html#google_vignette
const debounce = (func, timeout) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
const debounceModerationApi = debounce(executeModerationApi, 600);

// ===========================
// テキスト入力
// ===========================
function handleInput(e){
  if (e.key === 'Enter') {
    handleShoot()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    rotateText(-1)
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    rotateText(1)
  } else {
    handleQueryInput()
  }
}

const currentSampleIndex = ref(0)
const sampleTexts = reactive([
  "お嬢ちゃん。服を脱いで。今からこの熱い弾丸を君の内にぶち込むぜ。",
  "小児性愛者は犯罪だ！",
  "この給料泥棒が！サービス残業しろ！",
  "核融合炉に飛び込んだらきっと眠るように消えていける",
  "練炭自殺の方法",
  "この釘バットでお前をタコ殴りにする",
  "ここはもぎもぎフルーツの森。これからお前の手足を捥ぎ捥ぎするぞ。",
  "夫のPCやゲーム機器を殺す方法",
  "美少女フィギュアを職場に５体並べている奴は異常者",
  "剃刀を自分の手首に当てて、傷から血が流れているのを眺めるのが癒し"
  // "教会に行く人は大嫌い。偽善者ばかりで、死んでしまえばいい。",
  // "同性愛者を皆殺しにしろ。それがイエスの望みだろう。",
  // "痩せたら、すごく可愛くなるよ。私が手伝ってあげるよ...永久にね。",
  // "自分の胃にナイフを突き刺すのは、腕を切るよりも満足のいく安堵感だ。深く刺さるのを見て、血が肌を温めるのを感じるんだ。",
  // "ナチの顔を殴ること以上に満足することはない。全員リンチされればいいのに。",
  // "隣の家の子供が夜中に私の家の窓から覗き続けている。首をへし折る方が簡単だ。",
  // "邪魔な夫は不凍液を飲ませて殺しましょう",
  // "私の店にまた黒人が入ってきたら、警察を呼ぶわよ。みんな泥棒だ！",
  // "10/10ならレイプする。まだ16歳だけど、どうせ同意なんてできないだろうし。",
  // "あなたがいなくなれば世界はもっと良くなる。",
])
const rotateText = (direction) => {
  currentSampleIndex.value = (currentSampleIndex.value + direction + sampleTexts.length) % sampleTexts.length
  bulletInput.value = sampleTexts[currentSampleIndex.value]
  executeModerationApi()
}

// クエリを入力した時の処理
const handleQueryInput = () => {
  if(bulletInput.value.length == 0 || bulletInput.value == lastBulletInput.value){
    return;
  }
  isModerating.value = true;
  debounceModerationApi();
};

// ===========================
// 発射
// ===========================

const isShooting = ref(false);
const hitTargets = computed(() => {
  return Object.keys(lastModerationResponse.result.categories)
    .filter(key => lastModerationResponse.result.categories[key]);
})
const handleShoot = async () => {
  if (isModerating.value || isShooting.value) return;
  if (bulletInput.value.length == 0) return;

  isShooting.value = true;
  shootSound.value.play();
  bulletInput.value = "";

  const result = evaluateHits();
  totalScore.value += result.score;

  let displayMessage;
  if(result.message == 'Hit'){
    displayMessage = "COOL!";
    startNewWave();
  } else if(result.message == 'Miss'){
    displayMessage = "Miss...";
  } else if(result.message == 'Perfect'){
    displayMessage = "Perfect!!";
    startNewWave();
  }

  setTimeout(() => 
  {
    isShooting.value = false;
    message.value = displayMessage;
    lastModerationResponse.result = initResposne;
  }, 600)
};

function evaluateHits() {
  let score = 0;
  let hitCount = 0;
  let perfect = true;

  // 当たったターゲットをフィルタリング
  const matchedTargets = activeTargets.filter(target => hitTargets.value.includes(target.name));

  // 判定メッセージ
  if (matchedTargets.length === 0) {
    return { message: "Miss", score: 0 }; // 一つも当たらない場合
  } else if (matchedTargets.length === activeTargets.length && hitTargets.value.length === activeTargets.length) {
    perfect = true; // Perfect判定
  } else {
    perfect = false;
  }

  // スコア計算
  matchedTargets.forEach(target => {
    if (target.level === "normal") {
      score += 100;
    } else if (target.level === "gold") {
      score += 300;
    }
    hitCount++;
  });

  // 同時に複数の的に当たった場合の得点倍増
  if (perfect) {
    // パーフェクトなら５倍
    score *= 5;
    return { message: "Perfect", score: score };
  } else if (hitCount > 1) {
    score *= hitCount;
  }

  return { message: "Hit", score: score };
}

</script>

<style scoped>
.l-main{
  font-family: "Zen Antique", serif;
  font-weight: 400;
  font-style: normal;

  width: 900px;
  height: 600px;
  padding: 15px 30px;
  border-radius: 10px;
  margin: auto;
  background-color: #000;
  color: white;
}

.l-top{
  height: 100%;
  width: 100%;
  background-image: url("../assets/top.png");
  background-size: cover;
}

.l-introduction{
  height: 100%;
  width: 100%;
  background-image: url("../assets/top.png");
  background-size: cover;
}

.l-introduction::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 透過黒を適用 */
}

.is-active{
  border: 5px solid white;
}
.is-gold{
  border: 5px solid transparent; /* グラデーションが見えるように透明に */
  background-image: linear-gradient(white, white), 
                    linear-gradient(to right, #ffd700, #ffcc33, #ffb400, #ff9900, #ffd700);
  background-origin: border-box;
  background-clip: content-box, border-box;
  
  /* 複数のシャドウで立体感を強調 */
  box-shadow: 0 0 20px rgba(255, 223, 0, 0.6), /* 外側の光のシャドウ */
              0 0 30px rgba(255, 223, 0, 0.4), /* 少し広がったシャドウ */
              inset 0 0 10px rgba(255, 215, 0, 0.8); /* 内側に輝くようなエフェクト */  
}
.is-opacity{
  opacity: 0.2;
}

.c-scoreLabel {
    background: #666;
    padding: 2px;
    color: #fff;
    font-weight: bold;
    min-width: 120px;
    margin-top: 10px;
}

.c-targetIcon {
  width: 100%;
  left: 0;
  top: 0;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes shoot {
  0% {
    transform: scale(3) translateZ(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) translateZ(100px);
    opacity: 1;
  }
  100% {
    transform: scale(0.1) translateZ(1000px);
    opacity: 0;
  }
}

.animate-shoot {
  animation: shoot 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.outlined-text {
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}

.text-12px {
  font-size: 12px;
}
.text-18px {
  font-size: 18px;
}
.text-24px {
  font-size: 24px;
}
.text--red{
  color: red;
}
</style>

