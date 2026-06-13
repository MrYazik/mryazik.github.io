/* 
    Баг поправила нейронка

    Поправить баг с переключением между скриншотами в модальном окне.
    Сейчас если дойти до крайних позиций и выйти с скриншота, то при повторном открытии скриншота, кнопки навигации остаются в отключённом состоянии, даже если скриншотов больше одного.
*/

/* 
    Расписать свои проекты 
*/ 

const projectTypes = {
    'Telegram боты': [
        {
            title: 'Daily Math Buddy',
            description: 'Бот, который который позволяет пользователям решать примеры из таблицы умножения. В боте имеется 3 уровня сложности, и таблица лидеров для мотивации пользователей.',
            image: './png/DailyMathBuddy/daily_math_buddy_icon.png',
            url: 'https://github.com/MrYazik/DailyMathBuddy',
            forWhat: 'Создан для того чтоб выучить таблицу умножения. Для личного использования.',
            stack: 'Python, aiogram, SQLite',
            screenshots: [
                './png/DailyMathBuddy/main_menu.png',
                './png/DailyMathBuddy/stats.png',
                './png/DailyMathBuddy/task_complite.png'
            ]
        }
    ],
    'JavaFX приложения': [
        {
            title: 'Project Manager',
            description: 'Project Manager - десктопное JavaFX-приложение для ведения проектов, задач, идей и заметок в одном месте. Оно помогает структурировать работу по проектам, привязывать идеи к задачам, редактировать README проекта и хранить данные в локальной файловой системе.',
            image: './png/ProjectManager/preview_image.png',
            url: 'https://github.com/MrYazik/Project-Manager',
            forWhat: 'Создано для личного использования, чтобы структурировать работу по проектам, задачам.',
            stack: 'Java, JavaFX, jacson',
            screenshots: [
                './png/ProjectManager/main_menu.png',
                './png/ProjectManager/task_menu.png',
                './png/ProjectManager/change_readme.png'
            ]
        }
    ],
    'Android приложения': [
        {
            title: 'Android приложение',
            description: 'Мобильный клиент для отслеживания настроения и привычек с ежедневными уведомлениями.',
            image: 'https://via.placeholder.com/400x240?text=Android+приложение',
            url: 'https://github.com/',
            purpose: 'Создано для ежедневного мониторинга привычек и повышения личной продуктивности.',
            stack: 'Kotlin, Jetpack Compose, Firebase',
            screenshots: [
                'https://via.placeholder.com/480x260?text=Скрин+1',
                'https://via.placeholder.com/480x260?text=Скрин+2'
            ]
        },
        {
            title: 'Мобильный трекер',
            description: 'Приложение для контроля тренировок и прогресса с визуализацией активности.',
            image: 'https://via.placeholder.com/400x240?text=Трекер',
            url: 'https://github.com/',
            purpose: 'Помогает спортсменам и любителям отслеживать тренировки и улучшать результаты.',
            stack: 'Java, Android SDK, REST API',
            screenshots: [
                'https://via.placeholder.com/480x260?text=Скрин+1',
                'https://via.placeholder.com/480x260?text=Скрин+2'
            ]
        }
    ]
};

const typeButtons = document.querySelectorAll('.project-type-button');
const projectsSection = document.querySelector('.projects');
const currentTypeLabel = document.querySelector('.name-type');
const modal = document.getElementById('projectModal');

const modalTitle = document.getElementById('modalTitle');
const modalType = document.querySelector('.modal-type');
const modalDescription = document.getElementById('modalDescription');
const modalStack = document.getElementById('modalStack');
const modalForWhat = document.getElementById('modalForWhat');
const modalScreenshots = document.getElementById('modalScreenshots');
const modalGithub = document.querySelector('.modal-github');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');
const imageModal = document.getElementById('imageModal');
const imageModalImage = document.getElementById('imageModalImage');
const closeImageModalButtons = document.querySelectorAll('[data-close-image-modal]');
const imagePrevButton = document.querySelector('[data-image-prev]');
const imageNextButton = document.querySelector('[data-image-next]');

let imageModalCloseTimer = null;
let currentScreenshotSources = [];
let currentScreenshotIndex = 0;

function renderProjects(type) {
    const projects = projectTypes[type] || [];
    currentTypeLabel.textContent = type;
    projectsSection.innerHTML = projects.map((project, index) => `
        <article class="project-card" data-project-index="${index}" data-project-type="${type}">
            <img src="${project.image}" alt="${project.title}">
            <div class="project-content">
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <a class="project-button" href="${project.url}" target="_blank" rel="noreferrer">View in GitHub</a>
            </div>
        </article>
    `).join('');
}

function setActiveButton(activeButton) {
    typeButtons.forEach(button => button.classList.toggle('active', button === activeButton));
}

function openModal(project, type) {
    if (imageModalCloseTimer) {
        clearTimeout(imageModalCloseTimer);
        imageModalCloseTimer = null;
    }

    modalTitle.textContent = project.title;
    modalType.textContent = type;
    modalDescription.textContent = project.description;
    modalStack.textContent = project.stack;
    modalForWhat.textContent = project.forWhat;
    modalGithub.href = project.url;
    currentScreenshotSources = project.screenshots || [];
    currentScreenshotIndex = 0;

    modalScreenshots.innerHTML = project.screenshots.map(src => `
        <div class="modal-screenshot"><img src="${src}" alt="Скриншот ${project.title}"></div>
    `).join('');

    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

function updateImageModalControls() {
    const lastIndex = currentScreenshotSources.length - 1;
    imagePrevButton.disabled = currentScreenshotIndex <= 0;
    imageNextButton.disabled = currentScreenshotIndex >= lastIndex;
}

function openImageModal(src, title, index) {
    // Открываем скриншот поверх окна проекта.
    if (imageModalCloseTimer) {
        clearTimeout(imageModalCloseTimer);
        imageModalCloseTimer = null;
    }

    if (typeof index === 'number') {
        currentScreenshotIndex = Math.max(0, Math.min(index, currentScreenshotSources.length - 1));
    }

    imageModalImage.alt = `Скриншот ${title}`;
    imageModalImage.src = src;
    updateImageModalControls();
    imageModal.classList.remove('hidden', 'is-closing');
    requestAnimationFrame(() => {
        imageModal.classList.add('is-open');
    });
}

function goToScreenshot(step) {
    const nextIndex = currentScreenshotIndex + step;
    if (nextIndex < 0 || nextIndex >= currentScreenshotSources.length) {
        return;
    }

    currentScreenshotIndex = nextIndex;
    imageModalImage.src = currentScreenshotSources[currentScreenshotIndex];
    updateImageModalControls();
}

imageModalImage.addEventListener('load', updateImageModalControls);

function closeImageModal() {
    if (imageModal.classList.contains('hidden')) {
        return;
    }

    // Закрываем просмотр скриншота и возвращаемся к окну проекта.
    imageModal.classList.remove('is-open');
    imageModal.classList.add('is-closing');

    imageModalCloseTimer = window.setTimeout(() => {
        imageModal.classList.add('hidden');
        imageModal.classList.remove('is-closing');
        imageModalImage.src = '';
        imageModalImage.alt = '';
        updateImageModalControls();
        imageModalCloseTimer = null;
    }, 240);
}

function closeModal() {
    closeImageModal();
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

projectsSection.addEventListener('click', event => {
    const buttonClick = event.target.closest('.project-button');
    if (buttonClick) {
        return;
    }

    const card = event.target.closest('.project-card');
    if (!card) {
        return;
    }

    const projectType = card.dataset.projectType;
    const projectIndex = Number(card.dataset.projectIndex);
    const project = projectTypes[projectType]?.[projectIndex];
    if (project) {
        openModal(project, projectType);
    }
});

modalScreenshots.addEventListener('click', event => {
    const screenshot = event.target.closest('.modal-screenshot img');
    if (!screenshot) {
        return;
    }

    const screenshots = Array.from(modalScreenshots.querySelectorAll('.modal-screenshot img'));
    const index = screenshots.indexOf(screenshot);
    openImageModal(screenshot.src, modalTitle.textContent || 'скриншот', index);
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});

closeImageModalButtons.forEach(button => {
    button.addEventListener('click', closeImageModal);
});

imagePrevButton.addEventListener('click', () => {
    goToScreenshot(-1);
});

imageNextButton.addEventListener('click', () => {
    goToScreenshot(1);
});

modal.addEventListener('click', event => {
    if (event.target === modal || event.target.hasAttribute('data-close-modal')) {
        closeModal();
    }
});

imageModal.addEventListener('click', event => {
    if (event.target === imageModalImage) {
        closeImageModal();
        return;
    }

    if (event.target === imageModal || event.target.hasAttribute('data-close-image-modal')) {
        closeImageModal();
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !imageModal.classList.contains('hidden')) {
        closeImageModal();
        return;
    }

    if (event.key === 'ArrowLeft' && !imageModal.classList.contains('hidden')) {
        goToScreenshot(-1);
        return;
    }

    if (event.key === 'ArrowRight' && !imageModal.classList.contains('hidden')) {
        goToScreenshot(1);
        return;
    }

    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const typeName = button.textContent.trim();
        setActiveButton(button);
        renderProjects(typeName);
    });
});

// Вкладка которая открывается по умолчанию при загрузке страницы
renderProjects('JavaFX приложения');