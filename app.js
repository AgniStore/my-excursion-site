// Конфигурация с маршрутами
const panoramaRoutes = {
    'room1': {
        image: 'room1.jpg',
        next: 'room2', // Куда ведет стрелка вверх
        prev: null     // Стрелка вниз скроется
    },
    'room2': {
        image: 'room2.jpg',
        next: 'room3', // Можно добавить больше комнат
        prev: 'room1'  // Вернуться назад
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('panorama-container');
    const loadingIndicator = document.getElementById('loading');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // 1. Создаем просмотрщик
    const viewer = new PANOLENS.Viewer({
        container: container,
        autoRotate: false,
        controlBar: false, // Скрываем стандартные элементы
        cameraFov: 75
    });

    // 2. Загружаем панорамы
    const loadedPanoramas = {};
    
    Object.keys(panoramaRoutes).forEach(panoramaId => {
        const panorama = new PANOLENS.ImagePanorama(panoramaRoutes[panoramaId].image);
        
        panorama.addEventListener('load', () => {
            loadingIndicator.style.display = 'none';
            console.log(`Панорама "${panoramaId}" загружена`);
        });
        
        panorama.addEventListener('error', (error) => {
            console.error(`Ошибка загрузки "${panoramaId}":`, error);
            loadingIndicator.textContent = 'Ошибка загрузки изображения';
        });
        
        loadedPanoramas[panoramaId] = panorama;
        viewer.add(panorama);
    });

    // 3. Управление навигацией
    let currentRoom = 'room1';
    
    const updateNavigation = () => {
        prevBtn.style.display = panoramaRoutes[currentRoom].prev ? 'flex' : 'none';
        nextBtn.style.display = panoramaRoutes[currentRoom].next ? 'flex' : 'none';
    };
    
    const navigateTo = (roomId) => {
        if (loadedPanoramas[roomId]) {
            viewer.setPanorama(loadedPanoramas[roomId]);
            currentRoom = roomId;
            updateNavigation();
        }
    };

    // 4. Обработчики кнопок
    nextBtn.addEventListener('click', () => navigateTo(panoramaRoutes[currentRoom].next));
    prevBtn.addEventListener('click', () => navigateTo(panoramaRoutes[currentRoom].prev));

    // 5. Старт
    updateNavigation();
    viewer.setPanorama(loadedPanoramas[currentRoom]);
});