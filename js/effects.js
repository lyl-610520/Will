// 特效层管理
const EffectsManager = {
    canvas: null,
    ctx: null,
    
    // 粒子系统
    particles: [],
    stars: [],
    meteors: [],
    
    // 配置
    config: {
        maxParticles: 100,
        maxStars: 80,
        maxMeteors: 3,
        starTwinkleSpeed: 0.02,
        meteorSpeed: 0.8,
        meteorFrequency: 0.001, // 流星出现频率
        particleLifetime: 5000 // 粒子生命周期（毫秒）
    },
    
    // 动画状态
    animationFrame: null,
    isNight: false,
    currentWeatherEffect: null,
    
    // 初始化特效管理器
    init() {
        this.canvas = document.getElementById('effects-canvas');
        if (!this.canvas) {
            console.warn('Effects canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.initStars();
        this.startAnimation();
        this.bindEvents();
    },
    
    // 设置画布
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },
    
    // 调整画布大小
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    },
    
    // 绑定事件
    bindEvents() {
        // 监听天气更新
        window.addEventListener('weatherUpdated', (e) => {
            this.updateWeatherEffects(e.detail);
        });
        
        // 监听时间变化
        setInterval(() => {
            this.checkNightMode();
        }, 60000); // 每分钟检查一次
        
        // 初始检查
        this.checkNightMode();
        this.updateWeatherEffects();
    },
    
    // 检查夜晚模式
    checkNightMode() {
        const now = new Date();
        const hour = now.getHours();
        const wasNight = this.isNight;
        this.isNight = hour >= 22 || hour < 6;
        
        // 夜晚模式变化时重新初始化星星
        if (wasNight !== this.isNight) {
            if (this.isNight) {
                this.initStars();
            } else {
                this.stars = [];
            }
        }
    },
    
    // 初始化星星
    initStars() {
        this.stars = [];
        const starCount = this.config.maxStars;
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push(this.createStar());
        }
    },
    
    // 创建星星
    createStar() {
        const rect = this.canvas.getBoundingClientRect();
        
        return {
            x: Math.random() * rect.width,
            y: Math.random() * rect.height * 0.6, // 只在上半部分显示
            size: Math.random() * 2 + 0.5,
            brightness: Math.random(),
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: this.config.starTwinkleSpeed * (0.5 + Math.random())
        };
    },
    
    // 创建流星
    createMeteor() {
        const rect = this.canvas.getBoundingClientRect();
        const side = Math.random() < 0.5 ? 'left' : 'right';
        
        let startX, startY, endX, endY;
        
        if (side === 'left') {
            startX = -50;
            startY = Math.random() * rect.height * 0.3;
            endX = rect.width * 0.3 + Math.random() * rect.width * 0.4;
            endY = startY + rect.height * 0.2 + Math.random() * rect.height * 0.3;
        } else {
            startX = rect.width + 50;
            startY = Math.random() * rect.height * 0.3;
            endX = rect.width * 0.3 + Math.random() * rect.width * 0.4;
            endY = startY + rect.height * 0.2 + Math.random() * rect.height * 0.3;
        }
        
        return {
            startX,
            startY,
            endX,
            endY,
            currentX: startX,
            currentY: startY,
            progress: 0,
            speed: this.config.meteorSpeed * (0.5 + Math.random()),
            size: Math.random() * 3 + 1,
            trail: [],
            trailLength: 15
        };
    },
    
    // 更新天气特效
    updateWeatherEffects(weatherData) {
        if (!weatherData) {
            weatherData = WeatherManager.getCurrentWeatherData();
        }
        
        const effects = WeatherManager.getWeatherEffects();
        this.currentWeatherEffect = effects;
        
        // 根据天气类型初始化对应粒子
        this.initWeatherParticles(effects.type, effects.intensity);
    },
    
    // 初始化天气粒子
    initWeatherParticles(type, intensity) {
        this.particles = [];
        
        if (type === 'none' || intensity === 0) {
            return;
        }
        
        const particleCount = Math.floor(this.config.maxParticles * intensity);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createWeatherParticle(type));
        }
    },
    
    // 创建天气粒子
    createWeatherParticle(type) {
        const rect = this.canvas.getBoundingClientRect();
        
        const baseParticle = {
            x: Math.random() * rect.width,
            y: -10,
            life: this.config.particleLifetime,
            maxLife: this.config.particleLifetime,
            type
        };
        
        switch (type) {
            case 'rain':
                return {
                    ...baseParticle,
                    y: Math.random() * rect.height,
                    speed: 3 + Math.random() * 4,
                    length: 10 + Math.random() * 15,
                    angle: Math.PI + Math.random() * 0.2 - 0.1,
                    opacity: 0.6 + Math.random() * 0.4
                };
                
            case 'snow':
                return {
                    ...baseParticle,
                    y: Math.random() * rect.height,
                    speed: 1 + Math.random() * 2,
                    size: 2 + Math.random() * 3,
                    drift: Math.random() * 2 - 1,
                    rotation: 0,
                    rotationSpeed: (Math.random() - 0.5) * 0.1,
                    opacity: 0.7 + Math.random() * 0.3
                };
                
            case 'fog':
                return {
                    ...baseParticle,
                    y: rect.height * 0.7 + Math.random() * rect.height * 0.3,
                    x: Math.random() * rect.width,
                    speed: 0.5 + Math.random(),
                    size: 50 + Math.random() * 100,
                    opacity: 0.1 + Math.random() * 0.2,
                    direction: Math.random() * Math.PI * 2
                };
                
            case 'sunbeam':
                return {
                    ...baseParticle,
                    x: rect.width * 0.2 + Math.random() * rect.width * 0.6,
                    y: Math.random() * rect.height * 0.4,
                    speed: 0.2 + Math.random() * 0.3,
                    width: 2 + Math.random() * 3,
                    length: 100 + Math.random() * 200,
                    angle: Math.PI * 0.25 + Math.random() * 0.1,
                    opacity: 0.1 + Math.random() * 0.15
                };
                
            default:
                return baseParticle;
        }
    },
    
    // 开始动画循环
    startAnimation() {
        const animate = (timestamp) => {
            this.update(timestamp);
            this.render();
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        this.animationFrame = requestAnimationFrame(animate);
    },
    
    // 停止动画
    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    },
    
    // 更新所有元素
    update(timestamp) {
        this.updateStars(timestamp);
        this.updateMeteors();
        this.updateWeatherParticles();
        this.spawnMeteors();
    },
    
    // 更新星星
    updateStars(timestamp) {
        if (!this.isNight) return;
        
        this.stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            star.brightness = 0.3 + 0.7 * (Math.sin(star.twinklePhase) * 0.5 + 0.5);
        });
    },
    
    // 更新流星
    updateMeteors() {
        if (!this.isNight) return;
        
        this.meteors.forEach((meteor, index) => {
            meteor.progress += meteor.speed * 0.01;
            
            if (meteor.progress >= 1) {
                this.meteors.splice(index, 1);
                return;
            }
            
            // 更新流星位置
            meteor.currentX = Utils.math.lerp(meteor.startX, meteor.endX, meteor.progress);
            meteor.currentY = Utils.math.lerp(meteor.startY, meteor.endY, meteor.progress);
            
            // 更新尾迹
            meteor.trail.push({
                x: meteor.currentX,
                y: meteor.currentY,
                opacity: 1
            });
            
            if (meteor.trail.length > meteor.trailLength) {
                meteor.trail.shift();
            }
            
            // 更新尾迹透明度
            meteor.trail.forEach((point, i) => {
                point.opacity = i / meteor.trail.length;
            });
        });
    },
    
    // 更新天气粒子
    updateWeatherParticles() {
        if (!this.currentWeatherEffect || this.currentWeatherEffect.type === 'none') {
            return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        
        this.particles.forEach((particle, index) => {
            particle.life -= 16; // 假设60fps，每帧16ms
            
            if (particle.life <= 0) {
                // 重新生成粒子
                Object.assign(particle, this.createWeatherParticle(particle.type));
                return;
            }
            
            switch (particle.type) {
                case 'rain':
                    particle.x += Math.sin(particle.angle) * particle.speed;
                    particle.y += Math.cos(particle.angle) * particle.speed;
                    
                    if (particle.y > rect.height + 50) {
                        particle.y = -50;
                        particle.x = Math.random() * rect.width;
                    }
                    break;
                    
                case 'snow':
                    particle.x += particle.drift;
                    particle.y += particle.speed;
                    particle.rotation += particle.rotationSpeed;
                    
                    if (particle.y > rect.height + 10) {
                        particle.y = -10;
                        particle.x = Math.random() * rect.width;
                    }
                    
                    if (particle.x < -10 || particle.x > rect.width + 10) {
                        particle.x = Math.random() * rect.width;
                    }
                    break;
                    
                case 'fog':
                    particle.x += Math.cos(particle.direction) * particle.speed;
                    particle.y += Math.sin(particle.direction) * particle.speed * 0.5;
                    
                    if (particle.x < -particle.size || particle.x > rect.width + particle.size) {
                        particle.x = Math.random() * rect.width;
                    }
                    break;
                    
                case 'sunbeam':
                    particle.y += particle.speed;
                    particle.opacity *= 0.999;
                    
                    if (particle.y > rect.height + particle.length) {
                        particle.y = -particle.length;
                        particle.x = rect.width * 0.2 + Math.random() * rect.width * 0.6;
                        particle.opacity = 0.1 + Math.random() * 0.15;
                    }
                    break;
            }
        });
    },
    
    // 生成流星
    spawnMeteors() {
        if (!this.isNight || this.meteors.length >= this.config.maxMeteors) {
            return;
        }
        
        if (Math.random() < this.config.meteorFrequency) {
            this.meteors.push(this.createMeteor());
        }
    },
    
    // 主渲染函数
    render() {
        const rect = this.canvas.getBoundingClientRect();
        
        // 清空画布
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        
        // 渲染天气特效
        this.renderWeatherParticles();
        
        // 渲染夜空特效（仅在夜晚）
        if (this.isNight) {
            this.renderStars();
            this.renderMeteors();
        }
    },
    
    // 渲染星星
    renderStars() {
        this.ctx.save();
        
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.brightness * 0.8;
            this.ctx.fillStyle = '#ffffff';
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 添加星星闪烁效果
            if (star.brightness > 0.7) {
                this.ctx.globalAlpha = (star.brightness - 0.7) * 2;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        this.ctx.restore();
    },
    
    // 渲染流星
    renderMeteors() {
        this.ctx.save();
        
        this.meteors.forEach(meteor => {
            // 渲染尾迹
            meteor.trail.forEach((point, index) => {
                this.ctx.globalAlpha = point.opacity * 0.8;
                this.ctx.fillStyle = '#ffffff';
                
                const size = meteor.size * (index / meteor.trail.length);
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            // 渲染流星主体
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(meteor.currentX, meteor.currentY, meteor.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 添加光晕效果
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(meteor.currentX, meteor.currentY, meteor.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.restore();
    },
    
    // 渲染天气粒子
    renderWeatherParticles() {
        if (!this.currentWeatherEffect || this.currentWeatherEffect.type === 'none') {
            return;
        }
        
        this.ctx.save();
        
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.opacity * (particle.life / particle.maxLife);
            
            switch (particle.type) {
                case 'rain':
                    this.renderRainDrop(particle);
                    break;
                case 'snow':
                    this.renderSnowflake(particle);
                    break;
                case 'fog':
                    this.renderFogParticle(particle);
                    break;
                case 'sunbeam':
                    this.renderSunbeam(particle);
                    break;
            }
        });
        
        this.ctx.restore();
    },
    
    // 渲染雨滴
    renderRainDrop(particle) {
        this.ctx.strokeStyle = '#87CEEB';
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(
            particle.x + Math.sin(particle.angle) * particle.length,
            particle.y + Math.cos(particle.angle) * particle.length
        );
        this.ctx.stroke();
    },
    
    // 渲染雪花
    renderSnowflake(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 添加雪花形状
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < 6; i++) {
            this.ctx.rotate(Math.PI / 3);
            this.ctx.beginPath();
            this.ctx.moveTo(0, -particle.size);
            this.ctx.lineTo(0, particle.size);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    },
    
    // 渲染雾气粒子
    renderFogParticle(particle) {
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
        );
        
        gradient.addColorStop(0, 'rgba(200, 200, 200, 0.3)');
        gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    },
    
    // 渲染阳光束
    renderSunbeam(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.angle);
        
        const gradient = this.ctx.createLinearGradient(
            -particle.width/2, 0,
            particle.width/2, 0
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${particle.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(-particle.width/2, 0, particle.width, particle.length);
        
        this.ctx.restore();
    },
    
    // 销毁特效管理器
    destroy() {
        this.stopAnimation();
        this.particles = [];
        this.stars = [];
        this.meteors = [];
        
        if (this.canvas) {
            window.removeEventListener('resize', this.resizeCanvas);
        }
    }
};

// 全局导出
window.EffectsManager = EffectsManager;