// 国际化管理
const I18n = {
    // 当前语言
    currentLanguage: 'zh',
    
    // 翻译文本
    translations: {
        zh: {
            // 通用
            common: {
                confirm: '确认',
                cancel: '取消',
                save: '保存',
                delete: '删除',
                edit: '编辑',
                add: '添加',
                close: '关闭',
                back: '返回',
                next: '下一个',
                previous: '上一个',
                loading: '加载中...',
                error: '出错了',
                success: '成功',
                warning: '警告',
                info: '提示',
                yes: '是',
                no: '否'
            },
            
            // 导航
            nav: {
                home: '首页',
                stats: '统计',
                wardrobe: '衣柜',
                garden: '花园',
                settings: '设置'
            },
            
            // 首页
            home: {
                title: 'Just in Time',
                subtitle: '恰逢其时',
                currentTime: '当前时间',
                weather: '当前天气为{weather}，{description}',
                wakeUpBtn: '我起床啦',
                sleepBtn: '我要睡了',
                customCheckIn: '自定义打卡',
                category: '类别',
                categoryLife: '生活',
                categoryStudy: '学习',
                categoryWork: '工作',
                checkInPlaceholder: '输入今天的感受...',
                todayCheckIns: '今日打卡',
                noCheckIns: '今天还没有打卡记录',
                alarmClock: '闹钟',
                setAlarm: '设置闹钟',
                countdown: '倒计时',
                pet: '宠物',
                flower: '花朵',
                level: '等级',
                sunlight: '阳光值'
            },
            
            // 问候语
            greetings: {
                earlyMorning: {
                    default: '早安！新的一天开始了',
                    withSleep: '睡得好吗？新的一天充满希望！',
                    rain: '虽然外面在下雨，但你的笑容比阳光还灿烂',
                    sunny: '阳光明媚的早晨，适合做任何事情'
                },
                breakfast: {
                    default: '吃早饭了吗？',
                    late: '早饭时间快过了，记得吃点东西哦',
                    healthy: '营养均衡的早餐是美好一天的开始'
                },
                midMorning: {
                    default: '上午好！工作学习都要加油哦',
                    focused: '这个时间段最适合专注做事了',
                    break: '记得喝口水，让大脑休息一下'
                },
                lunch: {
                    default: '午饭时间到了',
                    hungry: '该好好吃一顿了',
                    healthy: '午餐记得荤素搭配哦'
                },
                afternoon: {
                    default: '下午时光，继续努力',
                    tired: '如果累了就休息一下',
                    productive: '下午是很有生产力的时间段'
                },
                lateAfternoon: {
                    default: '傍晚时分，一天快结束了',
                    sunset: '夕阳西下，今天收获如何？',
                    relax: '可以开始放松一下了'
                },
                dinner: {
                    default: '晚饭时间',
                    family: '和家人一起用餐是最温馨的时光',
                    simple: '简单的晚餐也很美好'
                },
                evening: {
                    default: '晚上好！',
                    relax: '放松的时间到了',
                    reflection: '回顾一下今天的收获吧'
                },
                night: {
                    default: '夜深了，该准备休息了',
                    sleep: '充足的睡眠很重要哦',
                    late: '不要熬夜太晚'
                },
                lateNight: {
                    default: '已经很晚了',
                    care: '身体健康比什么都重要',
                    rest: '明天还有美好的事情等着你'
                }
            },
            
            // 天气描述
            weather: {
                sunny: '晴朗',
                cloudy: '多云',
                rainy: '下雨',
                snowy: '下雪',
                foggy: '有雾',
                windy: '有风',
                stormy: '暴风雨',
                comfortRain: '雨声很治愈呢',
                lovelySnow: '雪花纷飞的日子最浪漫了',
                gentleWind: '微风徐来，很舒服'
            },
            
            // 打卡反馈
            checkInFeedback: {
                wakeUp: {
                    early: '早起的鸟儿有虫吃，你真棒！',
                    onTime: '准时起床，很有规律呢',
                    late: '虽然起晚了，但新的一天依然美好',
                    streak: '已经连续{days}天早起啦，太厉害了！'
                },
                sleep: {
                    early: '早睡早起身体好，明天会更有精神',
                    onTime: '这个时间睡觉刚刚好',
                    late: '虽然晚了一些，但睡个好觉很重要',
                    streak: '已经连续{days}天按时睡觉了，好习惯！'
                },
                custom: {
                    life: '生活中的小确幸都被你记录下来了',
                    study: '学习的每一步都在让你变得更好',
                    work: '努力工作的你最闪亮',
                    repeat: '今天又完成了这件事，坚持的力量真伟大'
                }
            },
            
            // 成就
            achievements: {
                earlyBird: {
                    name: '一日之计在于晨',
                    description: '连续3天在6-9点间起床'
                },
                nightOwl: {
                    name: '夜猫子',
                    description: '经常在深夜活动'
                },
                healthySleep: {
                    name: '健康作息',
                    description: '一周内5天在22-23点睡觉'
                },
                persistent1: {
                    name: '初心',
                    description: '开始使用应用'
                },
                persistent7: {
                    name: '坚持不懈',
                    description: '连续使用7天'
                },
                persistent30: {
                    name: '习惯成自然',
                    description: '连续使用30天'
                },
                categoryMasterLife: {
                    name: '生活达人',
                    description: '生活类打卡10次'
                },
                categoryMasterStudy: {
                    name: '学习之星',
                    description: '学习类打卡10次'
                },
                categoryMasterWork: {
                    name: '工作能手',
                    description: '工作类打卡10次'
                }
            },
            
            // 统计页
            stats: {
                title: '数据统计',
                categoryDistribution: '打卡类别分布',
                sleepTrend: '最近7天睡眠时长',
                totalCheckIns: '总打卡次数',
                achievementCount: '获得成就',
                flowerLevel: '花朵等级',
                hours: '小时',
                noData: '暂无数据'
            },
            
            // 衣柜页
            wardrobe: {
                title: '宠物衣柜',
                petName: '宠物名称',
                currentAccessory: '当前配饰',
                availableAccessories: '可用配饰',
                themes: '主题商店',
                accessories: '配饰商店',
                achievements: '成就中心',
                points: '成就点数',
                unlock: '解锁',
                equipped: '已装备',
                locked: '未解锁'
            },
            
            // 花园页
            garden: {
                title: '成就花园',
                currentPoints: '当前成就点数',
                spendPoints: '消费点数观赏',
                starGarden: '星空花园',
                flowerGarden: '花朵花园',
                enterGarden: '进入花园',
                backToMain: '返回主界面',
                viewStars: '观赏星空',
                viewFlowers: '观赏花朵'
            },
            
            // 设置页
            settings: {
                title: '设置',
                display: '显示设置',
                theme: '主题模式',
                themeAuto: '跟随系统',
                themeLight: '浅色模式',
                themeDark: '深色模式',
                language: '语言设置',
                languageZh: '中文',
                languageEn: 'English',
                personalization: '个性化',
                petName: '宠物名称',
                weatherPreferences: '天气偏好',
                hateRain: '讨厌雨天',
                loveSnow: '喜欢雪天',
                fearThunder: '害怕打雷',
                countdown: '倒计时设置',
                countdownEvent: '倒计时事件',
                countdownDate: '目标日期',
                notifications: '通知设置',
                notificationTime: '提醒时间',
                requestPermission: '申请通知权限',
                soundSettings: '音效设置',
                enableSound: '启用音效',
                dataManagement: '数据管理',
                resetData: '回到最初的时光',
                resetConfirm: '这样做会清除所有数据',
                resetThinking: '我再想想',
                resetConfirmBtn: '我明白',
                resetSuccess: '你即将涅槃重生，恭喜进入下一个人生阶段'
            },
            
            // 通知消息
            notifications: {
                morning: '新的一天开始了，今天想做什么呢？',
                evening: '忙碌的一天即将结束，记得好好休息哦',
                checkInReminder: '今天还有任务没完成，要不要打个卡？',
                encouragement: '每一天都在成长，为自己点个赞吧',
                sleepReminder: '夜深了，早点休息对身体更好',
                achievement: '恭喜获得新成就：{name}！',
                flowerLevelUp: '你的花朵升级了！当前等级：{level}'
            },
            
            // 音乐播放器
            music: {
                addMusic: '添加音乐',
                selectFiles: '选择音频文件',
                uploadSuccess: '音乐添加成功',
                uploadError: '音乐添加失败',
                removeMusic: '移除音乐'
            },
            
            // 闹钟
            alarm: {
                setAlarm: '设置闹钟',
                alarmTime: '闹钟时间',
                alarmSet: '闹钟已设置',
                alarmRing: '闹钟响了！',
                snooze: '稍后提醒',
                dismiss: '关闭'
            },
            
            // 花朵等级
            flowerLevels: {
                0: '种子',
                1: '出芽',
                2: '小苗',
                3: '花骨朵',
                4: '开花'
            }
        },
        
        en: {
            // Common
            common: {
                confirm: 'Confirm',
                cancel: 'Cancel',
                save: 'Save',
                delete: 'Delete',
                edit: 'Edit',
                add: 'Add',
                close: 'Close',
                back: 'Back',
                next: 'Next',
                previous: 'Previous',
                loading: 'Loading...',
                error: 'Error',
                success: 'Success',
                warning: 'Warning',
                info: 'Info',
                yes: 'Yes',
                no: 'No'
            },
            
            // Navigation
            nav: {
                home: 'Home',
                stats: 'Stats',
                wardrobe: 'Wardrobe',
                garden: 'Garden',
                settings: 'Settings'
            },
            
            // Home
            home: {
                title: 'Just in Time',
                subtitle: 'Perfect Timing',
                currentTime: 'Current Time',
                weather: 'Current weather is {weather}, {description}',
                wakeUpBtn: 'I\'m Awake',
                sleepBtn: 'Going to Bed',
                customCheckIn: 'Custom Check-in',
                category: 'Category',
                categoryLife: 'Life',
                categoryStudy: 'Study',
                categoryWork: 'Work',
                checkInPlaceholder: 'How are you feeling today...',
                todayCheckIns: 'Today\'s Check-ins',
                noCheckIns: 'No check-ins today',
                alarmClock: 'Alarm',
                setAlarm: 'Set Alarm',
                countdown: 'Countdown',
                pet: 'Pet',
                flower: 'Flower',
                level: 'Level',
                sunlight: 'Sunlight'
            },
            
            // Greetings
            greetings: {
                earlyMorning: {
                    default: 'Good morning! A new day begins',
                    withSleep: 'Did you sleep well? A new day full of hope!',
                    rain: 'Though it\'s raining outside, your smile shines brighter than the sun',
                    sunny: 'Sunny morning, perfect for anything'
                },
                breakfast: {
                    default: 'Have you had breakfast?',
                    late: 'Breakfast time is almost over, remember to eat something',
                    healthy: 'A balanced breakfast is the start of a beautiful day'
                },
                midMorning: {
                    default: 'Good morning! Keep working and studying hard',
                    focused: 'This is the perfect time to focus',
                    break: 'Remember to drink water and give your brain a break'
                },
                lunch: {
                    default: 'Lunchtime!',
                    hungry: 'Time for a good meal',
                    healthy: 'Remember to balance your lunch'
                },
                afternoon: {
                    default: 'Afternoon time, keep going',
                    tired: 'Take a break if you\'re tired',
                    productive: 'Afternoon is a very productive time'
                },
                lateAfternoon: {
                    default: 'Late afternoon, the day is almost over',
                    sunset: 'As the sun sets, how was your day?',
                    relax: 'Time to start relaxing'
                },
                dinner: {
                    default: 'Dinner time',
                    family: 'Dining with family is the warmest time',
                    simple: 'A simple dinner is also wonderful'
                },
                evening: {
                    default: 'Good evening!',
                    relax: 'Time to relax',
                    reflection: 'Reflect on today\'s achievements'
                },
                night: {
                    default: 'It\'s getting late, time to prepare for rest',
                    sleep: 'Adequate sleep is very important',
                    late: 'Don\'t stay up too late'
                },
                lateNight: {
                    default: 'It\'s very late now',
                    care: 'Health is more important than anything',
                    rest: 'Beautiful things await you tomorrow'
                }
            },
            
            // Weather
            weather: {
                sunny: 'sunny',
                cloudy: 'cloudy',
                rainy: 'rainy',
                snowy: 'snowy',
                foggy: 'foggy',
                windy: 'windy',
                stormy: 'stormy',
                comfortRain: 'the sound of rain is so healing',
                lovelySnow: 'snowy days are the most romantic',
                gentleWind: 'gentle breeze, very comfortable'
            },
            
            // Check-in Feedback
            checkInFeedback: {
                wakeUp: {
                    early: 'The early bird catches the worm, you\'re amazing!',
                    onTime: 'Waking up on time, very regular',
                    late: 'Though you woke up late, the new day is still beautiful',
                    streak: 'You\'ve been getting up early for {days} days in a row, incredible!'
                },
                sleep: {
                    early: 'Early to bed and early to rise makes you healthy',
                    onTime: 'This is the perfect bedtime',
                    late: 'Though it\'s a bit late, a good sleep is important',
                    streak: 'You\'ve been sleeping on time for {days} days, great habit!'
                },
                custom: {
                    life: 'You\'ve recorded the little joys in life',
                    study: 'Every step of learning makes you better',
                    work: 'You shine brightest when working hard',
                    repeat: 'You completed this again today, the power of persistence is amazing'
                }
            },
            
            // Achievements
            achievements: {
                earlyBird: {
                    name: 'Early Bird',
                    description: 'Wake up between 6-9 AM for 3 consecutive days'
                },
                nightOwl: {
                    name: 'Night Owl',
                    description: 'Frequently active late at night'
                },
                healthySleep: {
                    name: 'Healthy Sleep',
                    description: 'Sleep between 22-23 PM for 5 days in a week'
                },
                persistent1: {
                    name: 'First Step',
                    description: 'Start using the app'
                },
                persistent7: {
                    name: 'Persistence',
                    description: 'Use for 7 consecutive days'
                },
                persistent30: {
                    name: 'Habit Formed',
                    description: 'Use for 30 consecutive days'
                },
                categoryMasterLife: {
                    name: 'Life Master',
                    description: 'Check in 10 times for life category'
                },
                categoryMasterStudy: {
                    name: 'Study Star',
                    description: 'Check in 10 times for study category'
                },
                categoryMasterWork: {
                    name: 'Work Expert',
                    description: 'Check in 10 times for work category'
                }
            },
            
            // Stats
            stats: {
                title: 'Statistics',
                categoryDistribution: 'Check-in Category Distribution',
                sleepTrend: 'Sleep Duration - Last 7 Days',
                totalCheckIns: 'Total Check-ins',
                achievementCount: 'Achievements Earned',
                flowerLevel: 'Flower Level',
                hours: 'hours',
                noData: 'No data available'
            },
            
            // Wardrobe
            wardrobe: {
                title: 'Pet Wardrobe',
                petName: 'Pet Name',
                currentAccessory: 'Current Accessory',
                availableAccessories: 'Available Accessories',
                themes: 'Theme Shop',
                accessories: 'Accessory Shop',
                achievements: 'Achievement Center',
                points: 'Achievement Points',
                unlock: 'Unlock',
                equipped: 'Equipped',
                locked: 'Locked'
            },
            
            // Garden
            garden: {
                title: 'Achievement Garden',
                currentPoints: 'Current Achievement Points',
                spendPoints: 'Spend Points to View',
                starGarden: 'Star Garden',
                flowerGarden: 'Flower Garden',
                enterGarden: 'Enter Garden',
                backToMain: 'Back to Main',
                viewStars: 'View Stars',
                viewFlowers: 'View Flowers'
            },
            
            // Settings
            settings: {
                title: 'Settings',
                display: 'Display Settings',
                theme: 'Theme Mode',
                themeAuto: 'Follow System',
                themeLight: 'Light Mode',
                themeDark: 'Dark Mode',
                language: 'Language Settings',
                languageZh: '中文',
                languageEn: 'English',
                personalization: 'Personalization',
                petName: 'Pet Name',
                weatherPreferences: 'Weather Preferences',
                hateRain: 'Hate Rainy Days',
                loveSnow: 'Love Snowy Days',
                fearThunder: 'Fear Thunder',
                countdown: 'Countdown Settings',
                countdownEvent: 'Countdown Event',
                countdownDate: 'Target Date',
                notifications: 'Notification Settings',
                notificationTime: 'Reminder Time',
                requestPermission: 'Request Notification Permission',
                soundSettings: 'Sound Settings',
                enableSound: 'Enable Sound Effects',
                dataManagement: 'Data Management',
                resetData: 'Back to the Beginning',
                resetConfirm: 'This will clear all data',
                resetThinking: 'Let me think',
                resetConfirmBtn: 'I understand',
                resetSuccess: 'You are about to be reborn, congratulations on entering the next stage'
            },
            
            // Notifications
            notifications: {
                morning: 'A new day has begun, what do you want to do today?',
                evening: 'The busy day is coming to an end, remember to rest well',
                checkInReminder: 'You still have incomplete tasks today, want to check in?',
                encouragement: 'Growing every day, give yourself a thumbs up',
                sleepReminder: 'It\'s getting late, early rest is better for your health',
                achievement: 'Congratulations on earning the achievement: {name}!',
                flowerLevelUp: 'Your flower has leveled up! Current level: {level}'
            },
            
            // Music Player
            music: {
                addMusic: 'Add Music',
                selectFiles: 'Select Audio Files',
                uploadSuccess: 'Music added successfully',
                uploadError: 'Failed to add music',
                removeMusic: 'Remove Music'
            },
            
            // Alarm
            alarm: {
                setAlarm: 'Set Alarm',
                alarmTime: 'Alarm Time',
                alarmSet: 'Alarm Set',
                alarmRing: 'Alarm Ringing!',
                snooze: 'Snooze',
                dismiss: 'Dismiss'
            },
            
            // Flower Levels
            flowerLevels: {
                0: 'Seed',
                1: 'Sprout',
                2: 'Seedling',
                3: 'Bud',
                4: 'Bloom'
            }
        }
    },
    
    // 初始化
    init() {
        const settings = StorageManager.getUserSettings();
        if (settings && settings.language) {
            this.currentLanguage = settings.language;
        } else {
            this.currentLanguage = StorageManager.detectSystemLanguage();
        }
        this.updateDocumentLanguage();
    },
    
    // 设置语言
    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            StorageManager.updateUserSetting('language', language);
            this.updateDocumentLanguage();
            this.updatePageContent();
            return true;
        }
        return false;
    },
    
    // 获取翻译文本
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                // 回退到英文
                value = this.translations.en;
                for (const k2 of keys) {
                    if (value && value[k2]) {
                        value = value[k2];
                    } else {
                        return key; // 找不到翻译，返回原key
                    }
                }
                break;
            }
        }
        
        if (typeof value === 'string') {
            // 替换参数
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] || match;
            });
        }
        
        return key;
    },
    
    // 更新文档语言属性
    updateDocumentLanguage() {
        document.documentElement.lang = this.currentLanguage;
    },
    
    // 更新页面内容
    updatePageContent() {
        // 更新所有具有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
        
        // 更新导航标签
        document.querySelectorAll('.nav-label').forEach((label, index) => {
            const navKeys = ['home', 'stats', 'wardrobe', 'garden', 'settings'];
            if (navKeys[index]) {
                label.textContent = this.t(`nav.${navKeys[index]}`);
            }
        });
        
        // 触发语言切换事件
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    },
    
    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    },
    
    // 获取支持的语言列表
    getSupportedLanguages() {
        return Object.keys(this.translations);
    },
    
    // 格式化数字
    formatNumber(number) {
        return new Intl.NumberFormat(this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US').format(number);
    },
    
    // 格式化日期
    formatDate(date, options = {}) {
        const locale = this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
        return new Intl.DateTimeFormat(locale, options).format(new Date(date));
    },
    
    // 格式化时间
    formatTime(date) {
        const locale = this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
        return new Intl.DateTimeFormat(locale, {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },
    
    // 获取本地化的问候语
    getGreeting(timeSegment, context = {}) {
        const greetings = this.translations[this.currentLanguage].greetings[timeSegment];
        if (!greetings) return this.t('greetings.earlyMorning.default');
        
        // 根据上下文选择合适的问候语
        if (context.weather === 'rainy' && context.hateRain) {
            return greetings.rain || greetings.default;
        }
        
        if (context.hadSleep) {
            return greetings.withSleep || greetings.default;
        }
        
        if (context.isLate) {
            return greetings.late || greetings.default;
        }
        
        return greetings.default;
    },
    
    // 获取天气描述
    getWeatherDescription(weather, preferences = {}) {
        const weatherKey = `weather.${weather}`;
        let description = this.t(weatherKey);
        
        // 根据用户偏好添加额外描述
        if (weather === 'rainy' && !preferences.hateRain) {
            description += '，' + this.t('weather.comfortRain');
        } else if (weather === 'snowy' && preferences.loveSnow) {
            description += '，' + this.t('weather.lovelySnow');
        } else if (weather === 'windy') {
            description += '，' + this.t('weather.gentleWind');
        }
        
        return description;
    }
};

// 初始化国际化
I18n.init();

// 全局导出
window.I18n = I18n;