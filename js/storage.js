// 数据存储管理
const StorageManager = {
    // 存储键名
    keys: {
        USER_SETTINGS: 'jit_user_settings',
        CHECK_IN_RECORDS: 'jit_checkin_records',
        SLEEP_RECORDS: 'jit_sleep_records',
        ACHIEVEMENTS: 'jit_achievements',
        PET_DATA: 'jit_pet_data',
        FLOWER_DATA: 'jit_flower_data',
        MUSIC_LIST: 'jit_music_list',
        COUNTDOWN_DATA: 'jit_countdown_data',
        WEATHER_PREFERENCES: 'jit_weather_preferences',
        NOTIFICATION_SETTINGS: 'jit_notification_settings',
        THEME_SETTINGS: 'jit_theme_settings',
        ACHIEVEMENT_POINTS: 'jit_achievement_points',
        UNLOCK_STATUS: 'jit_unlock_status'
    },

    // 初始化默认数据
    initDefaults() {
        // 用户设置
        if (!this.getUserSettings()) {
            this.setUserSettings({
                language: this.detectSystemLanguage(),
                theme: 'auto', // auto, light, dark
                petName: this.getDefaultPetName(),
                notificationTime: '21:00',
                soundEnabled: true,
                weatherPreferences: {
                    hateRain: false,
                    loveSnow: false,
                    fearThunder: false
                }
            });
        }

        // 宠物数据
        if (!this.getPetData()) {
            this.setPetData({
                name: this.getDefaultPetName(),
                currentAccessory: this.getCurrentSeasonAccessory(),
                unlockedAccessories: ['spring_grass', 'summer_fan', 'autumn_fruit', 'winter_scarf'],
                level: 1,
                experience: 0
            });
        }

        // 花朵数据
        if (!this.getFlowerData()) {
            this.setFlowerData({
                level: 0, // 0: 种子, 1: 出芽, 2: 小苗, 3: 花骨朵, 4: 开花
                sunlightValue: 0,
                thresholds: [0, 50, 150, 300, 500] // 每个等级的阈值
            });
        }

        // 成就点数
        if (!this.getAchievementPoints()) {
            this.setAchievementPoints(0);
        }

        // 音乐列表
        if (!this.getMusicList()) {
            this.setMusicList([
                { id: 'track1', name: '曲目一', url: 'sounds/track1.mp3', isDefault: true },
                { id: 'track2', name: '曲目二', url: 'sounds/track2.mp3', isDefault: true },
                { id: 'track3', name: '曲目三', url: 'sounds/track3.mp3', isDefault: true }
            ]);
        }

        // 解锁状态
        if (!this.getUnlockStatus()) {
            this.setUnlockStatus({
                themes: ['default'],
                accessories: ['spring_grass', 'summer_fan', 'autumn_fruit', 'winter_scarf'],
                achievements: []
            });
        }
    },

    // 检测系统语言
    detectSystemLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('zh') ? 'zh' : 'en';
    },

    // 获取默认宠物名
    getDefaultPetName() {
        const lang = this.detectSystemLanguage();
        return lang === 'zh' ? '小伙伴' : 'Buddy';
    },

    // 获取当前季节配饰
    getCurrentSeasonAccessory() {
        const season = Utils.date.getSeason();
        const accessories = {
            spring: 'spring_grass',
            summer: 'summer_fan',
            autumn: 'autumn_fruit',
            winter: 'winter_scarf'
        };
        return accessories[season];
    },

    // 用户设置相关
    getUserSettings() {
        return Utils.storage.get(this.keys.USER_SETTINGS);
    },

    setUserSettings(settings) {
        return Utils.storage.set(this.keys.USER_SETTINGS, settings);
    },

    updateUserSetting(key, value) {
        const settings = this.getUserSettings() || {};
        settings[key] = value;
        return this.setUserSettings(settings);
    },

    // 打卡记录相关
    getCheckInRecords() {
        return Utils.storage.get(this.keys.CHECK_IN_RECORDS, []);
    },

    addCheckInRecord(type, category = 'life') {
        const records = this.getCheckInRecords();
        const now = new Date();
        const record = {
            id: Utils.generateUUID(),
            type, // 'wake_up', 'sleep', 'custom'
            category, // 'life', 'study', 'work'
            timestamp: now.getTime(),
            date: Utils.date.format(now, 'YYYY-MM-DD'),
            time: Utils.date.format(now, 'HH:mm:ss')
        };
        
        records.push(record);
        Utils.storage.set(this.keys.CHECK_IN_RECORDS, records);
        
        // 更新花朵阳光值
        this.updateFlowerSunlight(type);
        
        // 检查成就
        this.checkAchievements(record);
        
        return record;
    },

    getTodayCheckIns() {
        const today = Utils.date.format(new Date(), 'YYYY-MM-DD');
        return this.getCheckInRecords().filter(record => record.date === today);
    },

    hasCheckedInToday(type) {
        return this.getTodayCheckIns().some(record => record.type === type);
    },

    // 睡眠记录相关
    getSleepRecords() {
        return Utils.storage.get(this.keys.SLEEP_RECORDS, []);
    },

    addSleepRecord(type, timestamp = new Date()) {
        const records = this.getSleepRecords();
        const record = {
            id: Utils.generateUUID(),
            type, // 'sleep', 'wake_up'
            timestamp: timestamp.getTime(),
            date: Utils.date.format(timestamp, 'YYYY-MM-DD'),
            time: Utils.date.format(timestamp, 'HH:mm')
        };
        
        records.push(record);
        Utils.storage.set(this.keys.SLEEP_RECORDS, records);
        
        return record;
    },

    getRecentSleepData(days = 7) {
        const records = this.getSleepRecords();
        const now = new Date();
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        
        return records
            .filter(record => new Date(record.timestamp) >= cutoff)
            .sort((a, b) => a.timestamp - b.timestamp);
    },

    calculateSleepDuration(sleepTime, wakeTime) {
        if (!sleepTime || !wakeTime) return 0;
        
        const sleep = new Date(sleepTime);
        const wake = new Date(wakeTime);
        
        // 如果唤醒时间早于睡眠时间，说明跨夜了
        if (wake < sleep) {
            wake.setDate(wake.getDate() + 1);
        }
        
        return (wake - sleep) / (1000 * 60 * 60); // 返回小时数
    },

    // 花朵阳光值更新
    updateFlowerSunlight(checkInType) {
        const flowerData = this.getFlowerData();
        if (!flowerData) return;

        // 不同打卡类型给予不同阳光值
        const sunlightRewards = {
            sleep: 20,     // 睡觉打卡奖励更多
            wake_up: 15,   // 起床打卡
            custom: 10     // 自定义打卡
        };

        const reward = sunlightRewards[checkInType] || 5;
        flowerData.sunlightValue += reward;

        // 检查是否可以升级
        this.checkFlowerLevelUp(flowerData);
        
        this.setFlowerData(flowerData);
    },

    checkFlowerLevelUp(flowerData) {
        const currentLevel = flowerData.level;
        const currentSunlight = flowerData.sunlightValue;
        const thresholds = flowerData.thresholds;

        // 检查是否达到下一级阈值
        if (currentLevel < thresholds.length - 1) {
            const nextThreshold = thresholds[currentLevel + 1];
            if (currentSunlight >= nextThreshold) {
                flowerData.level = currentLevel + 1;
                
                // 升级后提高下一级阈值
                if (currentLevel + 2 < thresholds.length) {
                    thresholds[currentLevel + 2] = Math.floor(thresholds[currentLevel + 2] * 1.2);
                }
                
                // 触发升级动画和通知
                this.triggerFlowerLevelUpEvent(currentLevel + 1);
            }
        }
    },

    triggerFlowerLevelUpEvent(newLevel) {
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('flowerLevelUp', {
            detail: { newLevel }
        }));
    },

    // 宠物数据相关
    getPetData() {
        return Utils.storage.get(this.keys.PET_DATA);
    },

    setPetData(data) {
        return Utils.storage.set(this.keys.PET_DATA, data);
    },

    updatePetAccessory(accessoryId) {
        const petData = this.getPetData();
        if (petData && petData.unlockedAccessories.includes(accessoryId)) {
            petData.currentAccessory = accessoryId;
            this.setPetData(petData);
            return true;
        }
        return false;
    },

    // 花朵数据相关
    getFlowerData() {
        return Utils.storage.get(this.keys.FLOWER_DATA);
    },

    setFlowerData(data) {
        return Utils.storage.set(this.keys.FLOWER_DATA, data);
    },

    // 成就系统
    getAchievements() {
        return Utils.storage.get(this.keys.ACHIEVEMENTS, []);
    },

    addAchievement(achievementId, data = {}) {
        const achievements = this.getAchievements();
        if (achievements.find(a => a.id === achievementId)) {
            return false; // 已经获得此成就
        }

        const achievement = {
            id: achievementId,
            timestamp: Date.now(),
            data
        };

        achievements.push(achievement);
        Utils.storage.set(this.keys.ACHIEVEMENTS, achievements);

        // 奖励成就点数
        this.addAchievementPoints(this.getAchievementReward(achievementId));

        // 触发成就获得事件
        window.dispatchEvent(new CustomEvent('achievementUnlocked', {
            detail: { achievement }
        }));

        return true;
    },

    getAchievementReward(achievementId) {
        const rewards = {
            early_bird: 50,
            night_owl: 30,
            healthy_sleep: 100,
            persistent_1: 25,
            persistent_7: 100,
            persistent_30: 300,
            category_master_life: 75,
            category_master_study: 75,
            category_master_work: 75
        };
        return rewards[achievementId] || 10;
    },

    checkAchievements(newRecord) {
        this.checkEarlyBirdAchievement(newRecord);
        this.checkPersistentAchievements();
        this.checkCategoryAchievements(newRecord);
        this.checkHealthySleepAchievement();
    },

    checkEarlyBirdAchievement(record) {
        if (record.type === 'wake_up') {
            const hour = new Date(record.timestamp).getHours();
            if (hour >= 6 && hour <= 9) {
                // 检查连续早起
                const recentWakeUps = this.getCheckInRecords()
                    .filter(r => r.type === 'wake_up')
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 3);

                const allEarly = recentWakeUps.length >= 3 && 
                    recentWakeUps.every(r => {
                        const h = new Date(r.timestamp).getHours();
                        return h >= 6 && h <= 9;
                    });

                if (allEarly) {
                    this.addAchievement('early_bird');
                }
            }
        }
    },

    checkPersistentAchievements() {
        const records = this.getCheckInRecords();
        const days = new Set(records.map(r => r.date)).size;

        if (days >= 30) {
            this.addAchievement('persistent_30');
        } else if (days >= 7) {
            this.addAchievement('persistent_7');
        } else if (days >= 1) {
            this.addAchievement('persistent_1');
        }
    },

    checkCategoryAchievements(record) {
        const categoryRecords = this.getCheckInRecords()
            .filter(r => r.category === record.category);

        if (categoryRecords.length >= 10) {
            this.addAchievement(`category_master_${record.category}`);
        }
    },

    checkHealthySleepAchievement() {
        const sleepRecords = this.getSleepRecords();
        const recentSleep = sleepRecords.slice(-7); // 最近7天

        if (recentSleep.length >= 7) {
            const healthyDays = recentSleep.filter(record => {
                const hour = new Date(record.timestamp).getHours();
                return record.type === 'sleep' && hour >= 22 && hour <= 23;
            });

            if (healthyDays.length >= 5) {
                this.addAchievement('healthy_sleep');
            }
        }
    },

    // 成就点数
    getAchievementPoints() {
        return Utils.storage.get(this.keys.ACHIEVEMENT_POINTS, 0);
    },

    setAchievementPoints(points) {
        return Utils.storage.set(this.keys.ACHIEVEMENT_POINTS, points);
    },

    addAchievementPoints(points) {
        const current = this.getAchievementPoints();
        return this.setAchievementPoints(current + points);
    },

    spendAchievementPoints(points) {
        const current = this.getAchievementPoints();
        if (current >= points) {
            return this.setAchievementPoints(current - points);
        }
        return false;
    },

    // 音乐列表
    getMusicList() {
        return Utils.storage.get(this.keys.MUSIC_LIST, []);
    },

    setMusicList(musicList) {
        return Utils.storage.set(this.keys.MUSIC_LIST, musicList);
    },

    addMusic(musicData) {
        const musicList = this.getMusicList();
        musicList.push({
            id: Utils.generateUUID(),
            name: musicData.name,
            url: musicData.url,
            isDefault: false,
            addedAt: Date.now()
        });
        return this.setMusicList(musicList);
    },

    removeMusic(musicId) {
        const musicList = this.getMusicList();
        const filtered = musicList.filter(music => music.id !== musicId);
        return this.setMusicList(filtered);
    },

    // 倒计时数据
    getCountdownData() {
        return Utils.storage.get(this.keys.COUNTDOWN_DATA);
    },

    setCountdownData(data) {
        return Utils.storage.set(this.keys.COUNTDOWN_DATA, data);
    },

    // 解锁状态
    getUnlockStatus() {
        return Utils.storage.get(this.keys.UNLOCK_STATUS);
    },

    setUnlockStatus(status) {
        return Utils.storage.set(this.keys.UNLOCK_STATUS, status);
    },

    unlockItem(type, itemId) {
        const status = this.getUnlockStatus();
        if (!status[type]) {
            status[type] = [];
        }
        if (!status[type].includes(itemId)) {
            status[type].push(itemId);
            this.setUnlockStatus(status);
            return true;
        }
        return false;
    },

    isUnlocked(type, itemId) {
        const status = this.getUnlockStatus();
        return status[type] && status[type].includes(itemId);
    },

    // 数据导出和导入
    exportData() {
        const data = {};
        Object.values(this.keys).forEach(key => {
            data[key] = Utils.storage.get(key);
        });
        return JSON.stringify(data, null, 2);
    },

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            Object.entries(data).forEach(([key, value]) => {
                if (Object.values(this.keys).includes(key)) {
                    Utils.storage.set(key, value);
                }
            });
            return true;
        } catch (e) {
            console.error('Import data failed:', e);
            return false;
        }
    },

    // 清空所有数据
    clearAllData() {
        Object.values(this.keys).forEach(key => {
            Utils.storage.remove(key);
        });
        // 重新初始化默认数据
        this.initDefaults();
    },

    // 获取统计数据
    getStatistics() {
        const checkIns = this.getCheckInRecords();
        const achievements = this.getAchievements();
        const sleepRecords = this.getSleepRecords();
        
        // 按类别统计打卡次数
        const categoryStats = {};
        checkIns.forEach(record => {
            categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
        });

        // 最近7天睡眠时长
        const recentSleep = this.getRecentSleepData(7);
        const sleepDurations = [];
        
        for (let i = 0; i < recentSleep.length - 1; i += 2) {
            const sleep = recentSleep[i];
            const wake = recentSleep[i + 1];
            if (sleep.type === 'sleep' && wake && wake.type === 'wake_up') {
                sleepDurations.push({
                    date: sleep.date,
                    duration: this.calculateSleepDuration(sleep.timestamp, wake.timestamp)
                });
            }
        }

        return {
            totalCheckIns: checkIns.length,
            categoryStats,
            achievementCount: achievements.length,
            achievementPoints: this.getAchievementPoints(),
            sleepDurations,
            flowerLevel: this.getFlowerData()?.level || 0
        };
    }
};

// 初始化默认数据
StorageManager.initDefaults();

// 全局导出
window.StorageManager = StorageManager;