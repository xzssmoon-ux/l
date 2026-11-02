let currentPage = 1;

// Токен бота и твой ID (Слава)
const BOT_TOKEN = "8823167341:AAFYxnFbars8Yuj9NQf9b4bRyVoI9ebisE4";
const CHAT_ID = "8801075372"; 

const userAnswers = {
    q1: "", q2: "", q3: "", q4: "", q5: ""
};

// Функция для мгновенной отправки сообщения тебе в ЛС
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: CHAT_ID, 
                text: message, 
                parse_mode: 'Markdown' 
            })
        });
    } catch (e) {
        console.log("Ошибка отправки в ТГ", e);
    }
}

function nextPage(pageNum) {
    document.getElementById('page' + currentPage).classList.remove('active');
    currentPage = pageNum;
    document.getElementById('page' + currentPage).classList.add('active');
}

// Красивые сердечки на фоне (не ракеты, а любовь ❤️)
function createHearts() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    // Чередуем разные сердечки для красоты
    const icons = ['❤️', '💖', '💕', '💗', '💓'];
    heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 3 + 's';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    
    container.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 6000);
}
setInterval(createHearts, 300);

// --- ЛОГИКА ВОПРОСОВ ---

// Вопрос 1
function handleQ1(answer) {
    userAnswers.q1 = answer;
    sendToTelegram(`💌 *Новое действие от Даны!*\n\n👑 **1. Ты красивая?**\nОтвет: ${answer}`);
    
    const ans1Text = document.getElementById('ans1-text');
    const q2Block = document.getElementById('q2-block');
    
    if (answer === 'Да, я красотка') {
        ans1Text.innerHTML = "Конечно так, это же очевидно! 😉❤️";
    } else if (answer === 'Я няшная') {
        ans1Text.innerHTML = "Да, ты очень няшная и милая! 🥰❤️";
    } else if (answer === 'Нет') {
        ans1Text.innerHTML = "Неправда! Вообще-то ты очень красивая и милая! 😘❤️";
    }
    
    ans1Text.classList.add('show');
    nextPage(8);
    
    setTimeout(() => {
        q2Block.style.display = "block";
        q2Block.classList.add('show');
    }, 3000);
}

// Вопрос 2 (Текст)
function submitTextAns() {
    const text = document.getElementById('whoAmI').value;
    if (text.trim() === "") {
        alert("Напиши хоть что-нибудь 🙈");
        return;
    }
    userAnswers.q2 = text;
    sendToTelegram(`💌 *Новое действие от Даны!*\n\n👤 **2. Кто я для тебя?**\nОтвет: ${text}`);
    nextPage(9);
}

// Вопрос 3 (Доверие)
function handleQ3(isYes) {
    userAnswers.q3 = isYes ? "Да" : "Нет";
    sendToTelegram(`💌 *Новое действие от Даны!*\n\n🤝 **3. Ты мне доверяешь?**\nОтвет: ${userAnswers.q3}`);
    
    const trustText = document.getElementById('trust-text');
    const q4Block = document.getElementById('q4-block');
    
    if (isYes) {
        trustText.innerHTML = "Спасибо, солнышко! ❤️";
    } else {
        trustText.innerHTML = "Эх... ну ладно 😔"; 
    }
    
    trustText.classList.add('show');
    nextPage(10);
    
    setTimeout(() => {
        const loveBtns = document.getElementById('love-buttons');
        if (loveBtns.innerHTML === "") {
            for (let i = 0; i < 10; i++) {
                const btn = document.createElement('button');
                btn.className = 'ans-btn';
                btn.innerText = 'Нет';
                btn.onclick = function() {
                    userAnswers.q4 = "Нет";
                    sendToTelegram(`💌 *Новое действие от Даны!*\n\n💔 **4. Ты меня любишь?**\nОтвет: Нет (тыкала 10 раз)`);
                    nextPage(11); // Переход к 5 вопросу (Мнение)
                };
                loveBtns.appendChild(btn);
            }
        }
        q4Block.style.display = "block";
        q4Block.classList.add('show');
    }, 3000);
}

// Вопрос 5 (Мнение)
function submitOpinion() {
    const text = document.getElementById('myOpinion').value;
    if (text.trim() === "") {
        alert("Напиши хоть что-нибудь 🙈");
        return;
    }
    userAnswers.q5 = text;
    sendToTelegram(`💌 *Новое действие от Даны!*\n\n💭 **5. Мнение обо мне:**\nОтвет: ${text}`);
    nextPage(12);
}

// Перехватываем переход на страницу стиха (13), чтобы отправить финальный отчёт
const originalNextPage = nextPage;
nextPage = function(pageNum) {
    if (pageNum === 13) {
        const report = `
🔔 **Дана прошла викторину до конца!** ❤️

**Итоги:**
1. Красивая? -> ${userAnswers.q1}
2. Кто я для тебя? -> ${userAnswers.q2}
3. Доверяешь? -> ${userAnswers.q3}
4. Любит? -> ${userAnswers.q4}
5. Мнение обо мне: -> ${userAnswers.q5}
        `;
        sendToTelegram(report);
    }
    originalNextPage(pageNum);
};
