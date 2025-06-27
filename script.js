document.addEventListener('DOMContentLoaded', function() {
    // Inicializa a biblioteca de animação de scroll
    AOS.init({
        duration: 800,
        once: true,
    });

    // --- Lógica do Tema Claro/Escuro com Efeito de Onda e Ícone ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const waveOverlay = document.getElementById('theme-wave-overlay');
    const themeIconContainer = document.getElementById('theme-icon-container');
    const waveMoonIcon = document.getElementById('wave-moon-icon');
    const waveSunIcon = document.getElementById('wave-sun-icon');
    let isAnimatingTheme = false;

    // Aplica tema inicial ao carregar a página
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
        document.documentElement.classList.add('dark');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
        document.documentElement.classList.remove('dark');
    }

    // Evento de clique para trocar o tema
    themeToggleButton.addEventListener('click', function() {
        if (isAnimatingTheme) return;
        isAnimatingTheme = true;

        const isSwitchingToDark = !document.documentElement.classList.contains('dark');
        
        // 1. Prepara a onda e o ícone
        waveOverlay.style.backgroundColor = isSwitchingToDark ? '#0f172a' : '#f8fafc';
        if (isSwitchingToDark) {
            waveMoonIcon.classList.remove('hidden');
        } else {
            waveSunIcon.classList.remove('hidden');
        }
        
        // 2. Inicia a animação de entrada
        waveOverlay.style.transform = 'scaleY(1)';
        themeIconContainer.classList.add('icon-visible');

        setTimeout(() => {
            // 3. Troca o tema e inicia a animação de saída
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('color-theme', isSwitchingToDark ? 'dark' : 'light');
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');
            
            waveOverlay.style.transform = 'scaleY(0)';
            themeIconContainer.classList.remove('icon-visible');

        }, 600); 

        // 4. Limpa e reseta os ícones após a animação
        setTimeout(() => {
            waveMoonIcon.classList.add('hidden');
            waveSunIcon.classList.add('hidden');
            isAnimatingTheme = false;
        }, 1200); 
    });

    // --- Lógica do Texto Alternado ---
    const alternatingTextElement = document.getElementById('alternating-text');
    if (alternatingTextElement) {
        const textsToAlternate = ['Lucas Magalhães', 'Desenvolvedor', 'Designer'];
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % textsToAlternate.length;
            alternatingTextElement.style.opacity = 0;
            setTimeout(() => {
                alternatingTextElement.textContent = textsToAlternate[currentIndex];
                alternatingTextElement.style.opacity = 1;
            }, 500);
        }, 2500);
    }
    
    // --- Lógica do Menu Mobile ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
    mobileMenu.addEventListener('click', (event) => { if(event.target.tagName === 'A') { mobileMenu.classList.add('hidden'); }});

    // --- Lógica do Formulário de Contato ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const object = {};
        formData.forEach((value, key) => { object[key] = value; });
        const json = JSON.stringify(object);
        formMessage.style.color = 'gray';
        formMessage.innerHTML = "Enviando, por favor aguarde...";
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: json
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status == 200) {
                formMessage.style.color = 'green';
                formMessage.innerHTML = jsonResponse.message || "A sua mensagem foi enviada com sucesso!";
            } else {
                formMessage.style.color = 'red';
                formMessage.innerHTML = jsonResponse.message || "Ocorreu um erro ao enviar a mensagem.";
            }
        })
        .catch(error => {
            console.log(error);
            formMessage.style.color = 'red';
            formMessage.innerHTML = "Algo correu mal! Tente novamente mais tarde.";
        })
        .then(function() {
            contactForm.reset();
            setTimeout(() => { formMessage.innerHTML = ''; }, 5000);
        });
    });
});
