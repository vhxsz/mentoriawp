document.addEventListener('DOMContentLoaded', function() {
    /* Menu mobile */
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* Loading screen */
    var loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
            }, 800);
        });
    }

    /* Contador animado — métricas de autoridade */
    function animateMetric(el) {
        var text = el.textContent.trim();
        if (text.indexOf('.') !== -1) return;
        var match = text.match(/^(\d+)(\+|%)?$/);
        if (!match) return;

        var target = parseInt(match[1], 10);
        var suffix = match[2] || '';
        var current = 0;
        var step = Math.max(1, Math.floor(target / 40));

        var timer = setInterval(function() {
            current += step;
            if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
            } else {
                el.textContent = current + suffix;
            }
        }, 30);
    }

    var metricsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.metric-card strong, .hero-trust-item strong, .depo-stat strong').forEach(function(el) {
                    if (!el.dataset.animated) {
                        el.dataset.animated = '1';
                        animateMetric(el);
                    }
                });
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('#autoridade, .hero-trust, .depo-stats-bar').forEach(function(section) {
        metricsObserver.observe(section);
    });

    /* Formulário → WhatsApp */
    var contatoForm = document.getElementById('contatoForm');
    if (contatoForm) {
        contatoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var nome = document.getElementById('contatoNome').value;
            var email = document.getElementById('contatoEmail').value;
            var tel = document.getElementById('contatoTel').value;
            var tempo = document.getElementById('contatoTempo').value;
            var msg = document.getElementById('contatoMsg').value;
            var lines = [
                'Olá! Preenchi o formulário da página.',
                '',
                '• Casal: ' + nome,
                '• E-mail: ' + email,
                '• WhatsApp: ' + tel,
                '• Tempo de casamento: ' + tempo
            ];
            if (msg) lines.push('• Desafios: ' + msg);
            window.open('https://wa.me/5521965925216?text=' + encodeURIComponent(lines.join('\n')), '_blank');
        });
    }
});
