// 动态背景管理
const BackgroundManager = {
    canvas: null,
    ctx: null,
    
    // 背景配置
    config: {
        updateInterval: 1000, // 1秒更新一次
        transitionDuration: 3000, // 3秒过渡时间
        treeAnimationSpeed: 0.001,
        watercolorEffect: true
    },
    
    // 当前状态
    currentTimeSegment: null,
    currentSeason: null,
    currentTheme: 'light',
    animationFrame: null,
    
    // 树的配置
    tree: {
        x: 0.8, // 相对位置
        y: 0.7,
        baseHeight: 0.4,
        baseWidth: 0.15,
        branchCount: 8,
        leafCount: 50,
        animationPhase: 0
    },
    
    // 颜色缓存
    colorCache: new Map(),
    
    // 初始化背景管理器
    init() {
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) {
            console.warn('Background canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.bindEvents();
        this.startAnimation();
        
        // 监听主题变化
        this.updateTheme();
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
        // 监听主题变化
        const themeObserver = new MutationObserver(() => {
            this.updateTheme();
        });
        
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        // 监听时间变化
        setInterval(() => {
            this.checkTimeUpdate();
        }, this.config.updateInterval);
    },
    
    // 更新主题
    updateTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        if (theme !== this.currentTheme) {
            this.currentTheme = theme;
            this.colorCache.clear(); // 清空颜色缓存
        }
    },
    
    // 检查时间更新
    checkTimeUpdate() {
        const now = new Date();
        const timeSegment = Utils.date.getTimeSegment(now);
        const season = Utils.date.getSeason(now);
        
        if (timeSegment !== this.currentTimeSegment || season !== this.currentSeason) {
            this.currentTimeSegment = timeSegment;
            this.currentSeason = season;
            this.updateBackground();
        }
    },
    
    // 更新背景
    updateBackground() {
        // 平滑过渡到新的背景色
        this.transitionBackground();
    },
    
    // 背景过渡动画
    transitionBackground() {
        const startTime = Date.now();
        const duration = this.config.transitionDuration;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeProgress = this.easeInOutCubic(progress);
            
            this.render(easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // 缓动函数
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
    
    // 开始动画循环
    startAnimation() {
        const animate = () => {
            this.tree.animationPhase += this.config.treeAnimationSpeed;
            this.render();
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    },
    
    // 停止动画
    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    },
    
    // 主渲染函数
    render(transitionProgress = 1) {
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // 清空画布
        this.ctx.clearRect(0, 0, width, height);
        
        // 绘制渐变背景
        this.renderGradientBackground(width, height, transitionProgress);
        
        // 绘制四季之树
        this.renderSeasonalTree(width, height);
        
        // 绘制水彩效果
        if (this.config.watercolorEffect) {
            this.renderWatercolorEffect(width, height);
        }
    },
    
    // 渲染渐变背景
    renderGradientBackground(width, height, transitionProgress = 1) {
        const colors = this.getTimeGradientColors();
        
        // 创建径向渐变
        const gradient = this.ctx.createRadialGradient(
            width * 0.5, height * 0.3, 0,
            width * 0.5, height * 0.3, Math.max(width, height) * 0.8
        );
        
        gradient.addColorStop(0, colors.start);
        gradient.addColorStop(0.6, colors.middle);
        gradient.addColorStop(1, colors.end);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        
        // 添加天气相关的颜色调整
        this.applyWeatherColorAdjustment(width, height, transitionProgress);
    },
    
    // 获取时间段对应的渐变色
    getTimeGradientColors() {
        const cacheKey = `${this.currentTimeSegment}_${this.currentTheme}`;
        
        if (this.colorCache.has(cacheKey)) {
            return this.colorCache.get(cacheKey);
        }
        
        const baseColors = Utils.color.getTimeColors(this.currentTimeSegment, this.currentTheme);
        
        let colors;
        if (this.currentTheme === 'dark') {
            colors = {
                start: this.adjustColorBrightness(baseColors[0], -40),
                middle: this.blendColors(baseColors[0], baseColors[1], 0.5),
                end: this.adjustColorBrightness(baseColors[1], -30)
            };
        } else {
            colors = {
                start: this.adjustColorBrightness(baseColors[0], 20),
                middle: this.blendColors(baseColors[0], baseColors[1], 0.5),
                end: this.adjustColorBrightness(baseColors[1], 10)
            };
        }
        
        this.colorCache.set(cacheKey, colors);
        return colors;
    },
    
    // 调整颜色亮度
    adjustColorBrightness(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        
        return `rgb(${r}, ${g}, ${b})`;
    },
    
    // 混合两种颜色
    blendColors(color1, color2, ratio) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        
        return `rgb(${r}, ${g}, ${b})`;
    },
    
    // 应用天气颜色调整
    applyWeatherColorAdjustment(width, height, transitionProgress) {
        const weatherAdjustment = WeatherManager.getWeatherColorAdjustment();
        
        if (weatherAdjustment.hue !== 0 || weatherAdjustment.saturation !== 1 || weatherAdjustment.brightness !== 1) {
            this.ctx.globalCompositeOperation = 'overlay';
            this.ctx.globalAlpha = 0.2 * transitionProgress;
            
            const adjustmentColor = this.getWeatherAdjustmentColor(weatherAdjustment);
            this.ctx.fillStyle = adjustmentColor;
            this.ctx.fillRect(0, 0, width, height);
            
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.globalAlpha = 1;
        }
    },
    
    // 获取天气调整颜色
    getWeatherAdjustmentColor(adjustment) {
        const hue = adjustment.hue;
        const saturation = Math.round(adjustment.saturation * 100);
        const lightness = Math.round(adjustment.brightness * 50);
        
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },
    
    // 渲染四季之树
    renderSeasonalTree(width, height) {
        const treeX = width * this.tree.x;
        const treeY = height * this.tree.y;
        const treeHeight = height * this.tree.baseHeight;
        const treeWidth = width * this.tree.baseWidth;
        
        this.ctx.save();
        
        // 绘制树干
        this.renderTreeTrunk(treeX, treeY, treeWidth * 0.3, treeHeight * 0.6);
        
        // 绘制树枝
        this.renderTreeBranches(treeX, treeY - treeHeight * 0.6, treeWidth, treeHeight * 0.4);
        
        // 根据季节绘制叶子/花朵/果实
        this.renderSeasonalElements(treeX, treeY - treeHeight * 0.6, treeWidth, treeHeight * 0.4);
        
        this.ctx.restore();
    },
    
    // 渲染树干
    renderTreeTrunk(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.moveTo(x - width/2, y);
        this.ctx.lineTo(x - width/3, y - height);
        this.ctx.lineTo(x + width/3, y - height);
        this.ctx.lineTo(x + width/2, y);
        this.ctx.closePath();
        
        // 树干颜色
        const trunkGradient = this.ctx.createLinearGradient(x - width/2, y, x + width/2, y);
        trunkGradient.addColorStop(0, '#8B4513');
        trunkGradient.addColorStop(0.5, '#A0522D');
        trunkGradient.addColorStop(1, '#654321');
        
        this.ctx.fillStyle = trunkGradient;
        this.ctx.fill();
        
        // 添加纹理效果
        this.ctx.strokeStyle = '#5D4037';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    },
    
    // 渲染树枝
    renderTreeBranches(x, y, width, height) {
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        const branchCount = this.tree.branchCount;
        const angleStep = (Math.PI * 0.8) / branchCount;
        const startAngle = -Math.PI * 0.4;
        
        for (let i = 0; i < branchCount; i++) {
            const angle = startAngle + angleStep * i;
            const branchLength = height * (0.6 + Math.random() * 0.4);
            const endX = x + Math.cos(angle) * branchLength;
            const endY = y - Math.sin(angle) * branchLength * 0.8;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            
            // 使用贝塞尔曲线创建自然的分支效果
            const controlX = x + Math.cos(angle) * branchLength * 0.5;
            const controlY = y - Math.sin(angle) * branchLength * 0.3;
            this.ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            
            this.ctx.stroke();
            
            // 绘制子分支
            this.renderSubBranches(endX, endY, angle, branchLength * 0.3);
        }
    },
    
    // 渲染子分支
    renderSubBranches(x, y, parentAngle, length) {
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 2; i++) {
            const angle = parentAngle + (i === 0 ? -0.5 : 0.5);
            const endX = x + Math.cos(angle) * length;
            const endY = y - Math.sin(angle) * length * 0.8;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
    },
    
    // 渲染季节性元素
    renderSeasonalElements(x, y, width, height) {
        switch (this.currentSeason) {
            case 'spring':
                this.renderSpringElements(x, y, width, height);
                break;
            case 'summer':
                this.renderSummerElements(x, y, width, height);
                break;
            case 'autumn':
                this.renderAutumnElements(x, y, width, height);
                break;
            case 'winter':
                this.renderWinterElements(x, y, width, height);
                break;
        }
    },
    
    // 春季元素（嫩绿叶子和花朵）
    renderSpringElements(x, y, width, height) {
        const leafCount = this.tree.leafCount;
        
        for (let i = 0; i < leafCount; i++) {
            const leafX = x + (Math.random() - 0.5) * width;
            const leafY = y + (Math.random() - 0.5) * height;
            
            // 绘制嫩绿色叶子
            this.ctx.beginPath();
            this.ctx.arc(leafX, leafY, 3 + Math.random() * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(120, 70%, ${60 + Math.random() * 20}%)`;
            this.ctx.fill();
            
            // 偶尔添加小花朵
            if (Math.random() < 0.2) {
                this.renderSmallFlower(leafX, leafY);
            }
        }
    },
    
    // 夏季元素（茂盛绿叶）
    renderSummerElements(x, y, width, height) {
        const leafCount = this.tree.leafCount * 1.5;
        
        for (let i = 0; i < leafCount; i++) {
            const leafX = x + (Math.random() - 0.5) * width;
            const leafY = y + (Math.random() - 0.5) * height;
            
            // 绘制深绿色叶子
            this.ctx.beginPath();
            this.ctx.arc(leafX, leafY, 4 + Math.random() * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(120, 80%, ${30 + Math.random() * 20}%)`;
            this.ctx.fill();
        }
    },
    
    // 秋季元素（红黄叶子，落叶效果）
    renderAutumnElements(x, y, width, height) {
        const leafCount = this.tree.leafCount;
        
        for (let i = 0; i < leafCount; i++) {
            const leafX = x + (Math.random() - 0.5) * width;
            const leafY = y + (Math.random() - 0.5) * height;
            
            // 随机选择秋季颜色
            const colors = ['#FF6B35', '#F7931E', '#FFD700', '#DC143C', '#B8860B'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.ctx.beginPath();
            this.ctx.arc(leafX, leafY, 3 + Math.random() * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
        
        // 添加飘落的叶子动画
        this.renderFallingLeaves(x, y, width, height);
    },
    
    // 冬季元素（稀疏枝条和雪花）
    renderWinterElements(x, y, width, height) {
        // 只渲染少量残留的叶子
        const leafCount = this.tree.leafCount * 0.1;
        
        for (let i = 0; i < leafCount; i++) {
            const leafX = x + (Math.random() - 0.5) * width;
            const leafY = y + (Math.random() - 0.5) * height;
            
            this.ctx.beginPath();
            this.ctx.arc(leafX, leafY, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fill();
        }
        
        // 在树枝上添加雪花
        this.renderSnowOnBranches(x, y, width, height);
    },
    
    // 渲染小花朵
    renderSmallFlower(x, y) {
        const petalCount = 5;
        const petalLength = 3;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        for (let i = 0; i < petalCount; i++) {
            this.ctx.rotate(Math.PI * 2 / petalCount);
            this.ctx.beginPath();
            this.ctx.ellipse(0, -petalLength/2, petalLength/3, petalLength/2, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFB6C1';
            this.ctx.fill();
        }
        
        // 花心
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 1, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fill();
        
        this.ctx.restore();
    },
    
    // 渲染飘落的叶子
    renderFallingLeaves(x, y, width, height) {
        const time = this.tree.animationPhase * 100;
        const leafCount = 8;
        
        for (let i = 0; i < leafCount; i++) {
            const leafX = x + Math.sin(time + i) * width * 0.3;
            const leafY = y + height + (time + i * 20) % (height * 2);
            
            this.ctx.save();
            this.ctx.translate(leafX, leafY);
            this.ctx.rotate(time + i);
            
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 3, 5, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FF6B35';
            this.ctx.fill();
            
            this.ctx.restore();
        }
    },
    
    // 在树枝上渲染雪花
    renderSnowOnBranches(x, y, width, height) {
        const snowCount = 15;
        
        for (let i = 0; i < snowCount; i++) {
            const snowX = x + (Math.random() - 0.5) * width;
            const snowY = y + (Math.random() - 0.5) * height;
            
            this.ctx.beginPath();
            this.ctx.arc(snowX, snowY, 1 + Math.random(), 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fill();
        }
    },
    
    // 渲染水彩效果
    renderWatercolorEffect(width, height) {
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.globalAlpha = 0.1;
        
        // 创建多层半透明的颜色叠加
        const layerCount = 3;
        for (let i = 0; i < layerCount; i++) {
            const gradient = this.ctx.createRadialGradient(
                Math.random() * width, Math.random() * height, 0,
                Math.random() * width, Math.random() * height, width * 0.5
            );
            
            const colors = this.getTimeGradientColors();
            gradient.addColorStop(0, colors.start);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, width, height);
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 1;
    },
    
    // 获取当前背景信息
    getCurrentBackgroundInfo() {
        return {
            timeSegment: this.currentTimeSegment,
            season: this.currentSeason,
            theme: this.currentTheme,
            colors: this.getTimeGradientColors()
        };
    },
    
    // 销毁背景管理器
    destroy() {
        this.stopAnimation();
        this.colorCache.clear();
        
        if (this.canvas) {
            window.removeEventListener('resize', this.resizeCanvas);
        }
    }
};

// 全局导出
window.BackgroundManager = BackgroundManager;