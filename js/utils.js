// 工具函数库
const Utils = {
    // 日期时间相关
    date: {
        // 获取当前时间
        now() {
            return new Date();
        },
        
        // 格式化时间
        format(date, format = 'YYYY-MM-DD HH:mm:ss') {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');
            
            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        },
        
        // 获取时间段
        getTimeSegment(date = new Date()) {
            const hour = date.getHours();
            if (hour >= 6 && hour < 8) return 'earlyMorning';
            if (hour >= 8 && hour < 10) return 'breakfast';
            if (hour >= 10 && hour < 12) return 'midMorning';
            if (hour >= 12 && hour < 14) return 'lunch';
            if (hour >= 14 && hour < 16) return 'afternoon';
            if (hour >= 16 && hour < 18) return 'lateAfternoon';
            if (hour >= 18 && hour < 20) return 'dinner';
            if (hour >= 20 && hour < 22) return 'evening';
            if (hour >= 22 || hour < 2) return 'night';
            if (hour >= 2 && hour < 6) return 'lateNight';
            return 'morning';
        },
        
        // 获取季节
        getSeason(date = new Date()) {
            const month = date.getMonth() + 1;
            if (month >= 3 && month <= 5) return 'spring';
            if (month >= 6 && month <= 8) return 'summer';
            if (month >= 9 && month <= 11) return 'autumn';
            return 'winter';
        },
        
        // 判断是否为夜晚
        isNight(date = new Date()) {
            const hour = date.getHours();
            return hour >= 22 || hour < 6;
        },
        
        // 获取星期几
        getDayOfWeek(date = new Date()) {
            return date.getDay();
        },
        
        // 计算两个日期间的天数差
        daysBetween(date1, date2) {
            const oneDay = 24 * 60 * 60 * 1000;
            return Math.round(Math.abs((date1 - date2) / oneDay));
        },
        
        // 获取今天开始时间
        getTodayStart() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return today;
        },
        
        // 获取今天结束时间
        getTodayEnd() {
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return today;
        }
    },
    
    // 动画相关
    animation: {
        // 创建GSAP时间线
        timeline(options = {}) {
            return gsap.timeline(options);
        },
        
        // 页面过渡动画
        pageTransition(element, direction = 'left') {
            const tl = gsap.timeline();
            
            if (direction === 'left') {
                tl.fromTo(element, 
                    { x: 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
                );
            } else if (direction === 'right') {
                tl.fromTo(element,
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
                );
            } else {
                tl.fromTo(element,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
                );
            }
            
            return tl;
        },
        
        // 卡片出现动画
        cardAppear(elements) {
            return gsap.fromTo(elements, 
                { y: 30, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 }
            );
        },
        
        // 按钮点击动画
        buttonClick(element) {
            return gsap.timeline()
                .to(element, { scale: 0.95, duration: 0.1 })
                .to(element, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.5)" });
        },
        
        // 成功动画
        success(element) {
            return gsap.timeline()
                .to(element, { scale: 1.1, duration: 0.2 })
                .to(element, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
        },
        
        // 错误摇晃动画
        shake(element) {
            return gsap.timeline()
                .to(element, { x: -10, duration: 0.1 })
                .to(element, { x: 10, duration: 0.1 })
                .to(element, { x: -5, duration: 0.1 })
                .to(element, { x: 0, duration: 0.1 });
        }
    },
    
    // DOM操作相关
    dom: {
        // 创建元素
        createElement(tag, className = '', attributes = {}) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            
            Object.keys(attributes).forEach(key => {
                if (key === 'textContent') {
                    element.textContent = attributes[key];
                } else if (key === 'innerHTML') {
                    element.innerHTML = attributes[key];
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });
            
            return element;
        },
        
        // 查询元素
        $(selector) {
            return document.querySelector(selector);
        },
        
        // 查询多个元素
        $$(selector) {
            return document.querySelectorAll(selector);
        },
        
        // 添加事件监听
        on(element, event, handler) {
            element.addEventListener(event, handler);
            return () => element.removeEventListener(event, handler);
        },
        
        // 移除所有子元素
        clearChildren(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },
    
    // 数学相关
    math: {
        // 随机数
        random(min, max) {
            return Math.random() * (max - min) + min;
        },
        
        // 随机整数
        randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        // 限制数值范围
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },
        
        // 线性插值
        lerp(start, end, factor) {
            return start + (end - start) * factor;
        },
        
        // 映射数值范围
        map(value, inMin, inMax, outMin, outMax) {
            return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        }
    },
    
    // 颜色相关
    color: {
        // 调整颜色亮度
        adjustBrightness(color, amount) {
            const usePound = color[0] === '#';
            const col = usePound ? color.slice(1) : color;
            const num = parseInt(col, 16);
            
            let r = (num >> 16) + amount;
            let g = (num >> 8 & 0x00FF) + amount;
            let b = (num & 0x0000FF) + amount;
            
            r = r > 255 ? 255 : r < 0 ? 0 : r;
            g = g > 255 ? 255 : g < 0 ? 0 : g;
            b = b > 255 ? 255 : b < 0 ? 0 : b;
            
            return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
        },
        
        // 获取时间段对应的背景色
        getTimeColors(timeSegment, theme = 'light') {
            const colors = {
                light: {
                    earlyMorning: ['#ff9a9e', '#fecfef'],
                    breakfast: ['#ffecd2', '#fcb69f'],
                    midMorning: ['#a8edea', '#fed6e3'],
                    lunch: ['#ffd89b', '#19547b'],
                    afternoon: ['#667eea', '#764ba2'],
                    lateAfternoon: ['#f093fb', '#f5576c'],
                    dinner: ['#4facfe', '#00f2fe'],
                    evening: ['#43e97b', '#38f9d7'],
                    night: ['#0c3483', '#a2b6df'],
                    lateNight: ['#1e3c72', '#2a5298']
                },
                dark: {
                    earlyMorning: ['#2d1b69', '#11998e'],
                    breakfast: ['#fc466b', '#3f5efb'],
                    midMorning: ['#667eea', '#764ba2'],
                    lunch: ['#f093fb', '#f5576c'],
                    afternoon: ['#4facfe', '#00f2fe'],
                    lateAfternoon: ['#43e97b', '#38f9d7'],
                    dinner: ['#fa709a', '#fee140'],
                    evening: ['#a8edea', '#fed6e3'],
                    night: ['#0c0c0c', '#1a1a2e'],
                    lateNight: ['#16213e', '#0f3460']
                }
            };
            
            return colors[theme][timeSegment] || colors[theme].morning;
        }
    },
    
    // 存储相关
    storage: {
        // 获取存储数据
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.warn('Storage get error:', e);
                return defaultValue;
            }
        },
        
        // 设置存储数据
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Storage set error:', e);
                return false;
            }
        },
        
        // 删除存储数据
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Storage remove error:', e);
                return false;
            }
        },
        
        // 清空所有数据
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.warn('Storage clear error:', e);
                return false;
            }
        }
    },
    
    // 网络相关
    network: {
        // 检查网络状态
        isOnline() {
            return navigator.onLine;
        },
        
        // 监听网络状态变化
        onNetworkChange(callback) {
            const handleOnline = () => callback(true);
            const handleOffline = () => callback(false);
            
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            
            return () => {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
            };
        }
    },
    
    // 设备相关
    device: {
        // 检测是否为移动设备
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        // 检测是否为iOS设备
        isIOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent);
        },
        
        // 检测是否为iPad
        isIPad() {
            return /iPad/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        },
        
        // 检测是否为iPhone
        isIPhone() {
            return /iPhone/.test(navigator.userAgent);
        },
        
        // 获取屏幕尺寸
        getScreenSize() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        
        // 检测是否支持触摸
        isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }
    },
    
    // 音频相关
    audio: {
        // 播放音效
        playSound(url, volume = 1) {
            try {
                const audio = new Audio(url);
                audio.volume = volume;
                audio.play().catch(e => console.warn('Audio play failed:', e));
                return audio;
            } catch (e) {
                console.warn('Audio creation failed:', e);
                return null;
            }
        },
        
        // 创建音频上下文（用于分析）
        createAudioContext() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            return new AudioContext();
        }
    },
    
    // 防抖和节流
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 深拷贝
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            Object.keys(obj).forEach(key => {
                clonedObj[key] = this.deepClone(obj[key]);
            });
            return clonedObj;
        }
    },
    
    // 生成UUID
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    // 睡眠函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// 全局导出
window.Utils = Utils;