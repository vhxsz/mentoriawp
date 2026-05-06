// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header transparente no scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0,0,0,0.98)';
    } else {
        header.style.background = 'rgba(0,0,0,0.95)';
    }
});

// Animação dos números (contador)
const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat .number');
    
    numbers.forEach(number => {
        const target = parseInt(number.textContent.replace(/\D/g, ''));
        const suffix = number.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                number.textContent = target + suffix;
                clearInterval(timer);
            } else {
                number.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    });
};

// Executar animação quando a seção estiver visível
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
});

// Animação de entrada dos cards de benefícios
const observerCards = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
});

// Aplicar animação aos cards quando carregarem
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.beneficio-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observerCards.observe(card);
    });
    
    // Animação timeline metodologia
    const timelineItems = document.querySelectorAll('.processo-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(' + (index % 2 === 0 ? '-50px' : '50px') + ')';
        item.style.transition = 'all 0.8s ease';
        observerCards.observe(item);
    });
    
    // Animação diferenciais
    const diferenciais = document.querySelectorAll('.diferencial-item');
    diferenciais.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observerCards.observe(item);
    });
    
    // Animação testimonials
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observerCards.observe(item);
    });
    
    // Duplicar cards para animação infinita
    const columns = document.querySelectorAll('.testimonials-column');
    columns.forEach(column => {
        const cards = column.querySelectorAll('.testimonial-card');
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            column.appendChild(clone);
        });
    });
});

// FAQ Toggle
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fechar todos os outros
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Abrir o clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

// Formulário de contato
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simular envio
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Enviando...';
            button.disabled = true;
            
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                form.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        });
    }
});

// Tracking de cliques nos botões de compra
document.addEventListener('DOMContentLoaded', () => {
    const btnProdutos = document.querySelectorAll('.btn-produto');
    
    btnProdutos.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            // Analytics tracking (exemplo)
            const produtoNome = btn.closest('.produto-card').querySelector('h3').textContent;
            console.log(`Clique no produto: ${produtoNome}`);
            
            // Adicionar loading state
            btn.style.opacity = '0.7';
            btn.textContent = 'Redirecionando...';
            
            // Restaurar após um tempo (caso o usuário volte)
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.textContent = 'Quero Esta Mentoria';
            }, 3000);
        });
    });
});

// Animação dos produtos
window.addEventListener('load', () => {
    const produtos = document.querySelectorAll('.produto-card');
    produtos.forEach((produto, index) => {
        produto.style.opacity = '0';
        produto.style.transform = 'translateY(30px)';
        produto.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            produto.style.opacity = '1';
            produto.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Animações Avançadas no Scroll
const observerAdvanced = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

// Aplicar animações aos elementos
document.addEventListener('DOMContentLoaded', () => {
    // Fade in para section headers
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('fade-in');
        observerAdvanced.observe(el);
    });
    
    // Slide in para sobre content
    const sobreImage = document.querySelector('.sobre-image');
    const sobreText = document.querySelector('.sobre-text');
    
    if (sobreImage && sobreText) {
        sobreImage.classList.add('slide-in-left');
        sobreText.classList.add('slide-in-right');
        observerAdvanced.observe(sobreImage);
        observerAdvanced.observe(sobreText);
    }
});

// Scroll suave melhorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Performance: Lazy loading para imagens
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Otimização: Debounce para scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Header scroll otimizado
const handleScroll = debounce(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0,0,0,0.98)';
    } else {
        header.style.background = 'rgba(0,0,0,0.95)';
    }
}, 10);

window.addEventListener('scroll', handleScroll);