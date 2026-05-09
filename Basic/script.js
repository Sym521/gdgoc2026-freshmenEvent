const GEMINI_API_KEY = "[APIKEY]"; // .env から転記

const INGREDIENTS = {
  lettuce: { label: 'レタス', emoji: '🥬', color: '#7CB342', class: 'ing-lettuce' },
  tomato: { label: 'トマト', emoji: '🍅', color: '#E53935', class: 'ing-tomato' },
  cheese: { label: 'チーズ', emoji: '🧀', color: '#FFB300', class: 'ing-cheese' },
  patty: { label: 'パティ', emoji: '🥩', color: '#6D4C41', class: 'ing-patty' },
  onion: { label: 'オニオン', emoji: '🧅', color: '#E8D5F5', class: 'ing-onion' },
  bacon: { label: 'ベーコン', emoji: '🥓', color: '#C62828', class: 'ing-bacon' },
};

const state = {
  parentTask: null,
  isLoading: false,
  isRecording: false,
  isEating: false,
};

// DOM Elements
const taskInput = document.getElementById('task-input');
const micBtn = document.getElementById('mic-btn');
const submitBtn = document.getElementById('submit-btn');
const taskForm = document.getElementById('task-form');
const errorMsg = document.getElementById('error-message');
const inputSection = document.getElementById('input-section');
const taskSection = document.getElementById('task-section');

const parentTaskNameEl = document.getElementById('parent-task-name');
const bunLabel = document.getElementById('bun-label');
const resetBtn = document.getElementById('reset-btn');

const completedCountEl = document.getElementById('completed-count');
const totalCountEl = document.getElementById('total-count');
const progressFill = document.getElementById('progress-fill');
const allDoneMsg = document.getElementById('all-done-msg');
const taskListEl = document.getElementById('task-list');

const ingredientsEl = document.getElementById('ingredients');
const topBun = document.getElementById('top-bun');

const eatBtn = document.getElementById('eat-btn');
const burgerContainer = document.querySelector('.burger-container');
const eatOverlay = document.getElementById('eat-overlay');
const particleContainer = document.getElementById('particle-container');
const eatFeedback = document.getElementById('eat-feedback');

// Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'ja-JP';

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    taskInput.value = transcript;
    updateSubmitBtn();
  };

  recognition.onerror = (event) => {
    showError('音声認識エラー: ' + event.error);
    stopRecording();
  };

  recognition.onend = () => {
    state.isRecording = false;
    updateMicBtn();
  };
} else {
  micBtn.style.display = 'none';
}

function startRecording() {
  if (!recognition) return;
  taskInput.value = '';
  hideError();
  recognition.start();
  state.isRecording = true;
  updateMicBtn();
}

function stopRecording() {
  if (!recognition) return;
  recognition.stop();
  state.isRecording = false;
  updateMicBtn();
}

function updateMicBtn() {
  if (state.isRecording) {
    micBtn.classList.add('recording');
  } else {
    micBtn.classList.remove('recording');
  }
}

function updateSubmitBtn() {
  submitBtn.disabled = taskInput.value.trim().length === 0 || state.isLoading;
}

taskInput.addEventListener('input', updateSubmitBtn);
micBtn.addEventListener('click', () => {
  if (state.isRecording) stopRecording();
  else startRecording();
});

// Gemini API Call
async function decomposeTask(taskName) {
  const prompt = `あなたはタスク分解の専門家です。以下の親タスクを、実行可能な具体的な子タスク（3〜5個）に分割してください。各子タスクには、ハンバーガーの具材（'lettuce', 'tomato', 'cheese', 'patty', 'onion', 'bacon' のいずれか）を1つずつ割り当ててください。\n親タスク: "${taskName}"\n出力は以下のJSON配列形式のみとしてください。\n[\n  {\n    "name": "子タスクの名前",\n    "ingredient": "具材名"\n  }\n]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) throw new Error('API呼び出しに失敗しました');
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('JSONが見つかりませんでした');

  const parsed = JSON.parse(jsonMatch[0]);
  const validIngredients = ['lettuce', 'tomato', 'cheese', 'patty', 'onion', 'bacon'];

  return parsed.map((item, index) => {
    let ing = 'lettuce';
    if (item.ingredient && validIngredients.includes(item.ingredient)) ing = item.ingredient;
    return {
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      name: item.name || `サブタスク ${index + 1}`,
      ingredient: ing,
      completed: false
    };
  });
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = 'block';
}
function hideError() {
  errorMsg.style.display = 'none';
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const taskName = taskInput.value.trim();
  if (!taskName || state.isLoading) return;

  if (state.isRecording) stopRecording();

  state.isLoading = true;
  updateSubmitBtn();
  submitBtn.innerHTML = '<div class="spinner"></div>';
  hideError();

  try {
    const subTasks = await decomposeTask(taskName);
    state.parentTask = {
      id: 'parent-' + Math.random().toString(36).substr(2, 9),
      name: taskName,
      subTasks
    };
    renderTaskView();
  } catch (err) {
    showError(err.message || 'タスクの作成に失敗しました。');
  } finally {
    state.isLoading = false;
    submitBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translateX(-1px)"><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>`;
    updateSubmitBtn();
  }
});

function renderTaskView() {
  inputSection.style.display = 'none';
  taskSection.style.display = 'flex';

  parentTaskNameEl.textContent = state.parentTask.name;
  bunLabel.textContent = state.parentTask.name;

  updateTaskState();
}

function toggleSubTask(taskId) {
  const task = state.parentTask.subTasks.find(t => t.id === taskId);
  if (!task || task.completed) return;

  task.completed = true;
  updateTaskState();
}

function updateTaskState() {
  const tasks = state.parentTask.subTasks;
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  completedCountEl.textContent = completedCount;
  totalCountEl.textContent = totalCount;
  progressFill.style.width = `${(completedCount / totalCount) * 100}%`;

  allDoneMsg.style.display = isAllCompleted && !state.isEating ? 'block' : 'none';

  // Update Eat Button
  if (isAllCompleted && !state.isEating) {
    eatBtn.style.display = 'block';
  } else {
    eatBtn.style.display = 'none';
  }

  // Render Task List
  taskListEl.innerHTML = '';
  tasks.forEach(task => {
    const ingData = INGREDIENTS[task.ingredient];
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    card.onclick = () => toggleSubTask(task.id);

    card.innerHTML = `
      <div class="ingredient-badge" style="background-color: ${ingData.color}18">${ingData.emoji}</div>
      <div class="task-content">
        <span class="task-name">${task.name}</span>
        <span class="ingredient-label">${ingData.label}</span>
      </div>
      <div class="checkmark">
        <svg viewBox="0 0 24 24"><polyline points="4 12 10 18 20 6" /></svg>
      </div>
    `;
    taskListEl.appendChild(card);
  });

  // Render Hamburger
  ingredientsEl.innerHTML = '';
  tasks.filter(t => t.completed).forEach(task => {
    const ingData = INGREDIENTS[task.ingredient];
    const ingEl = document.createElement('div');
    ingEl.className = `ingredient ${ingData.class}`;
    ingredientsEl.appendChild(ingEl);
  });

  // Update Top Bun
  if (isAllCompleted) {
    topBun.classList.remove('floating');
    topBun.classList.add('landing');
  } else {
    topBun.classList.add('floating');
    topBun.classList.remove('landing');
  }
}

resetBtn.addEventListener('click', () => {
  state.parentTask = null;
  state.isEating = false;
  burgerContainer.classList.remove('eaten');
  eatOverlay.style.display = 'none';
  eatFeedback.style.display = 'none';
  particleContainer.innerHTML = '';

  taskInput.value = '';
  updateSubmitBtn();
  inputSection.style.display = 'block';
  taskSection.style.display = 'none';
});

// Eat Animation Logic
eatBtn.addEventListener('click', () => {
  state.isEating = true;
  updateTaskState(); // hide button and msg

  // collapse burger
  burgerContainer.classList.add('eaten');

  // show overlay
  eatOverlay.style.display = 'flex';
  particleContainer.innerHTML = '';
  eatFeedback.style.display = 'none';

  // generate particles
  const tasks = state.parentTask.subTasks.filter(t => t.completed);
  const ingredientTypes = tasks.length > 0 ? tasks.map(t => t.ingredient) : ['lettuce', 'tomato', 'cheese', 'patty'];

  const PARTICLE_COUNT = 24;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const type = ingredientTypes[i % ingredientTypes.length];
    const ingData = INGREDIENTS[type];

    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const radius = 80 + Math.random() * 120;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius - 40;
    const rotation = Math.random() * 720 - 360;
    const scale = 0.4 + Math.random() * 0.8;
    const delay = Math.random() * 0.15;

    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.color = ingData.color;
    particle.innerHTML = ingData.emoji;

    particleContainer.appendChild(particle);

    // Animate with Web Animations API
    particle.animate([
      { opacity: 0, transform: `translate(0px, 0px) scale(0) rotate(0deg)` },
      { opacity: 1, transform: `translate(${x * 0.3}px, ${y * 0.3 - 30}px) scale(${scale * 1.4}) rotate(${rotation * 0.5}deg)`, offset: 0.3 },
      { opacity: 1, transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`, offset: 0.7 },
      { opacity: 0, transform: `translate(${x}px, ${y + 60}px) scale(0) rotate(${rotation}deg)`, offset: 1 }
    ], {
      duration: 1200,
      easing: 'ease-out',
      delay: 400 + delay * 1000,
      fill: 'forwards'
    });
  }

  // show feedback
  setTimeout(() => {
    eatFeedback.style.display = 'flex';
  }, 600);
});
