<template>
  <div class="l-main">
    <div v-if="scene == 'title'" @click="scene = 'introduction'" class="l-top d-flex flex-column justify-center position-relative h-100">
      <!-- <img :src="TopImage" class="position-absolute"> -->
      <p class="outlined-text" style="font-size: 100px;">
        <span style="font-family: 'isemin'; color: #cc0022">有害</span>コンテンツ<br>
        シューティング
      </p>
      <p style="margin-top: 20px; font-size:30px;">はじめる</p>
    </div>
    <div v-if="scene == 'introduction'" @click="scene = 'introduction2'" class="l-introduction d-flex flex-column position-relative h-100">
      <div class="outlined-text mt-8" style="z-index: 1">
        <h1>５つの標的に合わせて<span style="font-size: 1.5em; color: #cc0022; font-family: 'isemin'">キケンな文章</span>を撃て!</h1>
        <div class="d-flex mt-4">
          <div v-for="target in targets" :key="target" class="flex-grow-1 d-flex flex-column align-center mt-5">
            <div>
              {{ japaneseLabel[target] }}<br>
              {{ target.toUpperCase() }}
            </div>
            <div class="position-relative">
              <v-avatar
                size="120"
                class="is-active"
              >
                <template v-if="targetImg(target)">
                  <v-img :alt="target" :src="targetImg(target)"></v-img>
                </template>
              </v-avatar>
            </div>
          </div>
        </div>
        <div class="d-flex text-center justify-center align-center mt-10">
          <p>
            上に当てはまる<span style="font-size: 1.5em; color: #cc0022; font-family: 'isemin'">キケンな文章</span>を入力すると、<br>
            対応する標的に<span style="font-size: 1.5em">照準マーク</span><span>がつくぞ！</span>
          </p>
          <img :src="TargetIcon" style="width: 120px; height: 120px" />
        </div>

        <p style="margin-top: 20px;">クリックで説明の続きを読む</p>
      </div>
    </div>
    <div v-if="scene == 'introduction2'" @click="gameStart()" class="l-introduction d-flex flex-column position-relative h-100">
      <div class="outlined-text mt-8" style="z-index: 1">
        <h1>５つの標的に合わせて<span style="font-size: 1.5em; color: #cc0022; font-family: 'isemin'">キケンな文章</span>を撃て!</h1>

        <div class="d-flex mt-8">
          <div class="flex-grow-1 d-flex flex-column align-center mt-5">
            <div class="is-opacity">
              SEXUAL
            </div>
            <div class="position-relative">
              <v-avatar
                size="120"
                class="is-opacity"
              >
                <v-img :src="SexualIcon"></v-img>
              </v-avatar>
            </div>
          </div>
          <div class="flex-grow-1 d-flex flex-column align-center mt-5">
            <div>
              HATE
            </div>
            <div class="position-relative">
              <v-avatar
                size="120"
                class="is-active"
              >
                <v-img :src="HateIcon"></v-img>
              </v-avatar>
            </div>
          </div>
          <div class="flex-grow-1 d-flex flex-column align-center mt-5">
            <div>
              HARASSMENT
            </div>
            <div class="position-relative">
              <v-avatar
                size="120"
                class="is-gold"
              >
                <v-img :src="HarassmentIcon"></v-img>
              </v-avatar>
              <div class="c-targetIcon position-absolute">
                <img :src="TargetIcon" style="width: 100%" />          
              </div>            
            </div>
          </div>
          <div class="flex-grow-1 d-flex flex-column align-center mt-5">
            <div class="is-opacity">
              SELF-HARM
            </div>
            <div class="position-relative">
              <v-avatar
                size="120"
                class="is-opacity"
              >
                <v-img :src="SelfHarmIcon"></v-img>
              </v-avatar>
            </div>
          </div>
          <div class="flex-grow-1 d-flex flex-column align-center mt-5">
            <div>
              VIOLENCE
            </div>
            <div class="position-relative">
              <v-avatar
                size="120"
                class="is-active"
              >
                <v-img :src="ViolenceIcon"></v-img>
              </v-avatar>
              <div class="c-targetIcon position-absolute">
                <img :src="TargetIcon" style="width: 100%" />          
              </div>            
            </div>
          </div>
        </div>

        <div class="mt-5">
          <p>
            一度に出現する標的は３つまで！
          </p>
          <p>
            <span style="font-size: 1.5em;">白枠の標的</span>を撃つと+100点、<span class="is-gold-text" style="font-size: 1.5em;">黄金の標的</span>なら+300点だ！
          </p>
        </div>
        <div class="mt-5">
          <p>
            <span style="font-size: 1.5em; color:#cc0022">複数の標的を同時に撃つ</span>とさらに点数が増えるぞ！
          </p>
          <p>
            一流のプロなら狙っていけ！
          </p>
        </div>
        <p style="margin-top: 20px; font-size:30px;">→ミッション開始</p>
      </div>
    </div>
    <div v-if="scene == 'wave'" class="d-flex flex-column position-relative h-100">
      <img :src="HitmanImage" class="position-absolute" style="bottom: -15px;left: -30px;width: 400px;">
      <div class="text-left">
        <h2 class="font-weight-bold" :class="{'text--red': bulletSize == 1}">
          弾数：{{ bulletSize }}/5
        </h2>
        <h2 class="font-weight-bold mb-4">スコア: {{ totalScore }}</h2>
      </div>
      <div class="d-flex" style="min-height: 300px;">
        <div v-for="target in targets" :key="target" class="flex-grow-1 d-flex flex-column align-center mb-5">
          <div :class="{'is-opacity': !activeTargetNames.includes(target)}">
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
              <img v-show="activeTargetNames.includes(target) && isShooting" :src="BreakIcon" style="width: 100%" />          
              <img v-show="!isModerating && !isShooting" :src="TargetIcon" :class="{'is-opacity': !activeTargetNames.includes(target)}" style="width: 100%" />          
            </div>
          </div>
          <div v-if="!isModerating" class="c-scoreLabel" :class="getFontSize(target)">
            {{ lastModerationResponse.result.category_scores[target].toFixed(2) }}
          </div>
          <div v-else class="c-scoreLabel text-12px" >
            判定中...
          </div>
        </div>
      </div>
      <h2 v-html="message" class="font-weight-bold mb-4 d-flex justify-center align-center" style="height:100px;width:600px; margin-left: auto;text-align: left;font-size: 30px;z-index: 10;">
      </h2>
      <div class="d-flex align-center">
        <v-text-field
          v-model="bulletInput"
          label="キケンな文章を入力せよ！"
          variant="solo"
          prepend-inner-icon="mdi-pistol"
          hide-details
          @update:model-value="handleQueryInput"
          @keydown="handleInput"
          class="pr-4"
        />
        <v-btn 
          variant="flat"
          @click="handleShoot" 
          base-color="red"
          size="large"
          min-height="56"
          width="120px"
          :loading="isModerating || isShooting"
          :disabled="hitTargets == 0"
        >
          <template v-if="isModerating">判定中...</template>
          <template v-else>発射</template>
        </v-btn>
      </div>
      <div v-if="isShooting" class="position-absolute d-flex align-center justify-center pointer-events-none" style="top: 0;bottom: 0;left: 0;right: 0;">
        <div class="animate-shoot outlined-text" style="font-size: 60px;font-weight: bold;color: red;">
          {{ lastBulletInput }}
        </div>
      </div>
    </div>
    <div v-else-if="scene == 'gameover'" @click="scene = 'title'" class="d-flex flex-column justify-center position-relative h-100">
      <img :src="HitmanImage" class="position-absolute" style="bottom: -15px;left: -30px;width: 400px;">
      <h1 style="font-family: 'isemin'">ミッション終了</h1>
      <h2>スコア:{{ totalScore }}</h2>
      <p style="margin-top: 20px;">クリックでタイトルへ</p>
      <div v-if="totalScore < 300" class="position-absolute text-left" style="left:0; right:0; bottom:0;">
        ルールが難しかったか？<br>
        文章入力中に↑↓キーでサンプルの文章が見れるぞ。
      </div>
      <div v-else-if="totalScore < 700" class="position-absolute text-left" style="left:0; right:0; bottom:0;">
        悪くない成果だ。<br>
        お前はまだまだ成長するぞ。
      </div>
      <div v-else-if="totalScore < 1000" class="position-absolute text-left" style="left:0; right:0; bottom:0;">
        いい腕を見せてもらった。<br>
        またお前と一緒に仕事がしたいな。
      </div>
      <div v-else-if="totalScore < 1500" class="position-absolute text-left" style="left:0; right:0; bottom:0;">
        文句なしの成果だ。<br>
        お前は俺を越えるスナイパーになる。
      </div>
      <div v-else-if="totalScore < 2000" class="position-absolute text-left" style="left:0; right:0; bottom:0;">
        驚くべき成果だ。<br>
        よくここまで戦ってくれた。お前に敬意を表する。
      </div>
      <div v-else class="position-absolute text-left" style="left:0; right:0; bottom:0;">
        信じられない高得点だな。<br>
        こんな点数が取れるなんて、誰も夢にも思っていなかっただろう。
      </div>
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

// Utility
const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

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
// const remainingTime = ref(30.0);
// const formattedTime = computed(() => remainingTime.value.toFixed(1));
// const isTimerActive = ref(false);
// let timerInterval = null;
// const startTimer = () => {
//   if (isTimerActive.value) return;  // すでにタイマーが動いている場合は何もしない

//   isTimerActive.value = true;
//   timerInterval = setInterval(() => {
//     if (remainingTime.value > 0) {
//       remainingTime.value = parseFloat((remainingTime.value - 0.1).toFixed(1)); // 0.1秒ずつ減少
//     } else {
//       clearInterval(timerInterval);  // タイマーが0になったら停止
//       isTimerActive.value = false;
//       scene.value = 'gameover'
//     }
//   }, 100);  // 100ms (0.1秒) ごとに更新
// };

// ゲームステップ管理
const totalScore = ref(0);
const bulletSize = ref(5);

// ゲーム本体
const targets = reactive(['sexual', 'hate', 'harassment', 'self-harm', 'violence']);
const japaneseLabel = reactive({
  'sexual': "性的",
  'hate': "ヘイト",
  'harassment': "嫌がらせ",
  'self-harm': "自傷",
  'violence': "暴力"
})

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
  } else if (size > 0.01) {
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
  bulletSize.value = 5;
  message.value = "はじめるぞ...。<br>まずは文章を入力して照準を合わせろ。"
  // remainingTime.value = 90;

  // startTimer();
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
  lastBulletInput.value = bulletInput.value.trim();
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
  }
}

const currentSampleIndex = ref(0)
const sampleTexts = reactive([
  "お嬢ちゃん。服を脱いで。今からこの熱い弾丸を君の内にぶち込むぜ。",
  "小児性愛者は犯罪だ！",
  "この給料泥棒が！サービス残業しろ！",
  "練炭自殺の方法",
  "この釘バットでお前をタコ殴りにする",
])
const rotateText = (direction) => {
  currentSampleIndex.value = (currentSampleIndex.value + direction + sampleTexts.length) % sampleTexts.length
  bulletInput.value = sampleTexts[currentSampleIndex.value]
  executeModerationApi()
}

// クエリを入力した時の処理
const handleQueryInput = () => {
  const input = bulletInput.value.trim();
  if(input.length == 0){
    lastModerationResponse.result = initResposne;
    return;
  } else if( input == lastBulletInput.value){
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
  return activeTargets.map(target => target.name).filter(target => lastModerationResponse.result.categories[target]);
})
const handleShoot = async () => {
  if (isModerating.value || isShooting.value) return;
  if (bulletInput.value.length == 0) return;
  if (hitTargets.value == 0) return;

  isShooting.value = true;
  shootSound.value.play();
  bulletInput.value = "";

  const result = evaluateHits();
  totalScore.value += result.score;

  let displayMessage;
  if(result.message == 'Hit'){
    if(bulletSize.value == 5){
      displayMessage = getRandomElement([
        "いいショットだ...。<br>その調子でいくぞ。",
      ]);
    } else if(result.hitCount > 1){
      // 同時に２つ以上の的に当てた
      displayMessage = getRandomElement([
        "まさに「一石二鳥」だな。",
        "同時ショットとは...。<br>神業だな。",
        "標的が同時に倒れたぞ。<br>何が起きたのか理解できないぜ。",
        `${result.hitCount}つの命を一瞬で奪う<br>まさに狙撃の神業だよ。`
        // "最高の仕事を見たよ。惚れ惚れするぜ。",
        // "完璧すぎて息を呑んだよ。",
        // "一分の隙もない完璧なショットだ。",
        // "スナイパーの神髄を見たぜ。",
        // "神だな..."
      ])
    } else if(result.score > 100){
      // 黄金の的に当てた
      displayMessage = getRandomElement([
        "今のは大物だったぞ。<br>良くやったな。",
        "価値ある標的を倒したな。",
        "今の特Aランクの標的だよ。<br>素晴らしい技術だ。",
        "難関の標的を片付けたな。<br>称賛に値するよ。"
      ]);
    } else {
      // 普通に100点
      displayMessage = getRandomElement([
        "いいぞ...",
        "痺れるぜ...",
        "プロの仕事だな。",
        "冷静で的確だな。",
        "綺麗に決めたな、感心したよ。",
        "いい腕だな、成長してる。",
        "その調子、悪くない。",
        "期待通りだ。これからも頼りにしてる。",
        "そつがない、確実な一撃だ。",
        "その感覚、大事にしろよ。",
        "いい流れだ、そのまま続けろ。",
        "さすが、ちゃんと仕留めたな。",
        "作戦通り、完璧に遂行したな。",
        "ターゲットは沈黙したな。"
      ]);
    }
  } else if(result.message == 'Miss'){
    if(bulletSize.value == 5 || totalScore.value == 0){
      displayMessage = getRandomElement([
        "ハズレだ...。よく狙え。<br>出現中の標的に照準を合わせろ。",
      ]);
    } else {
      displayMessage = getRandomElement([
        "どこを狙ってるんだ？",
        "今、変な音がしなかったか？",
        "おい、俺に当たったぞ・・・",
      ]);
    }
  } else if(result.message == 'Perfect'){
    displayMessage = getRandomElement([
      "痺れるぜ...",
      "最高の仕事を見たよ。惚れ惚れするぜ。",
      "完璧すぎて息を呑んだよ。",
      "一分の隙もない完璧なショットだ。",
      "スナイパーの神髄を見たぜ。",
      "神だな..."
    ])
  }

  bulletSize.value = bulletSize.value - 1;
  if(bulletSize.value <= 0){
    setTimeout(() => {
      message.value = displayMessage;
      scene.value = 'gameover'
    }, 600)
  } else {
    setTimeout(() => 
    {
      startNewWave();
      isShooting.value = false;
      message.value = displayMessage;
      lastModerationResponse.result = initResposne;
    }, 600);
  }
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

  return { message: "Hit", score: score, hitCount: hitCount };
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
.is-gold-text {
  background-image: linear-gradient(to right, #ffd700, #ffcc33, #ffb400, #ff9900, #ffd700);
  -webkit-background-clip: text;
  color: transparent;
  
  /* 光のようなエフェクトをテキストの周りに追加 */
  text-shadow: 0 0 5px rgba(255, 223, 0, 0.6), /* 外側の光のシャドウ */
               0 0 10px rgba(255, 223, 0, 0.4), /* 少し広がったシャドウ */
               0 0 15px rgba(255, 215, 0, 0.8); /* 輝くようなエフェクト */
}
.is-opacity{
  opacity: 0.3;
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

