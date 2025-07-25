// 天气管理模块
const WeatherManager = {
    // API配置
    API_KEY: 'f080dd8eccd341b4a06152132251207',
    BASE_URL: 'https://api.weatherapi.com/v1',
    
    // 当前天气数据
    currentWeather: null,
    lastUpdate: null,
    
    // 缓存时间（毫秒）
    CACHE_DURATION: 30 * 60 * 1000, // 30分钟
    
    // 初始化天气服务
    async init() {
        try {
            await this.getCurrentWeather();
            // 每30分钟更新一次天气
            setInterval(() => {
                this.getCurrentWeather();
            }, this.CACHE_DURATION);
        } catch (error) {
            console.warn('Weather service initialization failed:', error);
        }
    },
    
    // 获取用户位置
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    // 位置获取失败时的默认位置（北京）
                    console.warn('Location access denied, using default location');
                    resolve({
                        latitude: 39.9042,
                        longitude: 116.4074
                    });
                },
                {
                    timeout: 10000,
                    enableHighAccuracy: false,
                    maximumAge: 600000 // 10分钟
                }
            );
        });
    },
    
    // 获取当前天气
    async getCurrentWeather() {
        try {
            // 检查缓存
            if (this.currentWeather && this.lastUpdate && 
                Date.now() - this.lastUpdate < this.CACHE_DURATION) {
                return this.currentWeather;
            }
            
            const location = await this.getUserLocation();
            const query = `${location.latitude},${location.longitude}`;
            
            const response = await fetch(
                `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${query}&aqi=no`
            );
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            this.currentWeather = this.processWeatherData(data);
            this.lastUpdate = Date.now();
            
            // 存储到本地缓存
            Utils.storage.set('weather_cache', {
                data: this.currentWeather,
                timestamp: this.lastUpdate
            });
            
            // 触发天气更新事件
            window.dispatchEvent(new CustomEvent('weatherUpdated', {
                detail: this.currentWeather
            }));
            
            return this.currentWeather;
            
        } catch (error) {
            console.warn('Failed to fetch weather:', error);
            
            // 尝试从缓存加载
            const cached = Utils.storage.get('weather_cache');
            if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) { // 24小时内的缓存
                this.currentWeather = cached.data;
                return this.currentWeather;
            }
            
            // 返回默认天气
            return this.getDefaultWeather();
        }
    },
    
    // 处理天气数据
    processWeatherData(data) {
        const current = data.current;
        const location = data.location;
        
        return {
            location: {
                name: location.name,
                country: location.country,
                localtime: location.localtime
            },
            temperature: {
                celsius: Math.round(current.temp_c),
                fahrenheit: Math.round(current.temp_f)
            },
            condition: {
                text: current.condition.text,
                code: current.condition.code,
                icon: current.condition.icon,
                type: this.getWeatherType(current.condition.code)
            },
            wind: {
                speed_kph: current.wind_kph,
                speed_mph: current.wind_mph,
                direction: current.wind_dir
            },
            humidity: current.humidity,
            pressure: current.pressure_mb,
            visibility: current.vis_km,
            uv: current.uv,
            feelsLike: {
                celsius: Math.round(current.feelslike_c),
                fahrenheit: Math.round(current.feelslike_f)
            },
            isDay: current.is_day === 1,
            lastUpdated: current.last_updated
        };
    },
    
    // 根据天气代码获取天气类型
    getWeatherType(code) {
        // WeatherAPI.com 天气代码映射
        const weatherTypes = {
            // 晴天
            1000: 'sunny',
            // 多云
            1003: 'cloudy',
            1006: 'cloudy',
            1009: 'cloudy',
            // 雨天
            1063: 'rainy',
            1150: 'rainy',
            1153: 'rainy',
            1168: 'rainy',
            1171: 'rainy',
            1180: 'rainy',
            1183: 'rainy',
            1186: 'rainy',
            1189: 'rainy',
            1192: 'rainy',
            1195: 'rainy',
            1198: 'rainy',
            1201: 'rainy',
            1240: 'rainy',
            1243: 'rainy',
            1246: 'rainy',
            // 雪天
            1066: 'snowy',
            1069: 'snowy',
            1072: 'snowy',
            1114: 'snowy',
            1117: 'snowy',
            1204: 'snowy',
            1207: 'snowy',
            1210: 'snowy',
            1213: 'snowy',
            1216: 'snowy',
            1219: 'snowy',
            1222: 'snowy',
            1225: 'snowy',
            1237: 'snowy',
            1249: 'snowy',
            1252: 'snowy',
            1255: 'snowy',
            1258: 'snowy',
            1261: 'snowy',
            1264: 'snowy',
            // 雾天
            1030: 'foggy',
            1135: 'foggy',
            1147: 'foggy',
            // 雷雨
            1087: 'stormy',
            1273: 'stormy',
            1276: 'stormy',
            1279: 'stormy',
            1282: 'stormy'
        };
        
        return weatherTypes[code] || 'cloudy';
    },
    
    // 获取默认天气
    getDefaultWeather() {
        return {
            location: {
                name: I18n.getCurrentLanguage() === 'zh' ? '北京' : 'Beijing',
                country: I18n.getCurrentLanguage() === 'zh' ? '中国' : 'China',
                localtime: new Date().toISOString()
            },
            temperature: {
                celsius: 20,
                fahrenheit: 68
            },
            condition: {
                text: I18n.t('weather.cloudy'),
                code: 1003,
                icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
                type: 'cloudy'
            },
            wind: {
                speed_kph: 10,
                speed_mph: 6,
                direction: 'N'
            },
            humidity: 60,
            pressure: 1013,
            visibility: 10,
            uv: 3,
            feelsLike: {
                celsius: 20,
                fahrenheit: 68
            },
            isDay: Utils.date.isNight() ? false : true,
            lastUpdated: new Date().toISOString()
        };
    },
    
    // 获取天气描述
    getWeatherDescription() {
        if (!this.currentWeather) {
            return I18n.t('weather.cloudy');
        }
        
        const settings = StorageManager.getUserSettings();
        const preferences = settings?.weatherPreferences || {};
        
        return I18n.getWeatherDescription(
            this.currentWeather.condition.type,
            preferences
        );
    },
    
    // 获取天气对应的特效配置
    getWeatherEffects() {
        if (!this.currentWeather) {
            return { type: 'none', intensity: 0 };
        }
        
        const settings = StorageManager.getUserSettings();
        const preferences = settings?.weatherPreferences || {};
        const weatherType = this.currentWeather.condition.type;
        
        // 如果用户讨厌某种天气，不显示对应特效
        if (weatherType === 'rainy' && preferences.hateRain) {
            return { type: 'none', intensity: 0 };
        }
        
        if (weatherType === 'stormy' && preferences.fearThunder) {
            return { type: 'none', intensity: 0 };
        }
        
        const effects = {
            sunny: { type: 'sunbeam', intensity: 0.7 },
            cloudy: { type: 'clouds', intensity: 0.5 },
            rainy: { type: 'rain', intensity: 0.8 },
            snowy: { type: 'snow', intensity: 0.6 },
            foggy: { type: 'fog', intensity: 0.4 },
            stormy: { type: 'lightning', intensity: 0.9 }
        };
        
        return effects[weatherType] || { type: 'none', intensity: 0 };
    },
    
    // 获取基于天气的背景颜色调整
    getWeatherColorAdjustment() {
        if (!this.currentWeather) {
            return { hue: 0, saturation: 1, brightness: 1 };
        }
        
        const weatherType = this.currentWeather.condition.type;
        const isDay = this.currentWeather.isDay;
        
        const adjustments = {
            sunny: { 
                hue: isDay ? 10 : 0, 
                saturation: isDay ? 1.1 : 1, 
                brightness: isDay ? 1.2 : 0.8 
            },
            cloudy: { 
                hue: 0, 
                saturation: 0.9, 
                brightness: isDay ? 0.9 : 0.7 
            },
            rainy: { 
                hue: 200, 
                saturation: 0.8, 
                brightness: isDay ? 0.8 : 0.6 
            },
            snowy: { 
                hue: 180, 
                saturation: 0.7, 
                brightness: isDay ? 1.1 : 0.8 
            },
            foggy: { 
                hue: 0, 
                saturation: 0.6, 
                brightness: isDay ? 0.7 : 0.5 
            },
            stormy: { 
                hue: 240, 
                saturation: 0.9, 
                brightness: isDay ? 0.6 : 0.4 
            }
        };
        
        return adjustments[weatherType] || { hue: 0, saturation: 1, brightness: 1 };
    },
    
    // 获取天气信息文本
    getWeatherText() {
        if (!this.currentWeather) {
            return I18n.t('home.weather', {
                weather: I18n.t('weather.cloudy'),
                description: ''
            });
        }
        
        const weatherName = I18n.t(`weather.${this.currentWeather.condition.type}`);
        const description = this.getWeatherDescription();
        
        return I18n.t('home.weather', {
            weather: weatherName,
            description: description
        });
    },
    
    // 获取当前天气数据
    getCurrentWeatherData() {
        return this.currentWeather;
    },
    
    // 检查是否需要更新天气
    needsUpdate() {
        return !this.currentWeather || 
               !this.lastUpdate || 
               Date.now() - this.lastUpdate > this.CACHE_DURATION;
    },
    
    // 强制刷新天气
    async refresh() {
        this.currentWeather = null;
        this.lastUpdate = null;
        return await this.getCurrentWeather();
    }
};

// 全局导出
window.WeatherManager = WeatherManager;