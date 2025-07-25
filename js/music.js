// 音乐播放器管理
const MusicManager = {
    // 音频元素
    audio: null,
    
    // 播放状态
    isPlaying: false,
    currentTrackIndex: 0,
    volume: 0.7,
    
    // 音乐列表
    playlist: [],
    
    // DOM元素
    playPauseBtn: null,
    nextBtn: null,
    addMusicBtn: null,
    musicUpload: null,
    songTitle: null,
    
    // 初始化音乐管理器
    init() {
        this.initElements();
        this.initAudio();
        this.loadPlaylist();
        this.bindEvents();
        this.updateDisplay();
    },
    
    // 初始化DOM元素
    initElements() {
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.addMusicBtn = document.getElementById('add-music-btn');
        this.musicUpload = document.getElementById('music-upload');
        this.songTitle = document.getElementById('current-song');
        
        if (!this.playPauseBtn || !this.nextBtn || !this.addMusicBtn || !this.musicUpload || !this.songTitle) {
            console.warn('Music player elements not found');
            return false;
        }
        
        return true;
    },
    
    // 初始化音频对象
    initAudio() {
        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.audio.preload = 'metadata';
        
        // 监听音频事件
        this.audio.addEventListener('ended', () => {
            this.next();
        });
        
        this.audio.addEventListener('loadstart', () => {
            this.updateDisplay();
        });
        
        this.audio.addEventListener('canplay', () => {
            this.updateDisplay();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.warn('Audio error:', e);
            this.next(); // 播放出错时自动切换到下一首
        });
    },
    
    // 加载播放列表
    loadPlaylist() {
        this.playlist = StorageManager.getMusicList();
        
        // 确保有默认音乐
        if (this.playlist.length === 0) {
            this.createDefaultPlaylist();
        }
        
        // 加载当前曲目
        if (this.playlist.length > 0) {
            this.loadTrack(this.currentTrackIndex);
        }
    },
    
    // 创建默认播放列表
    createDefaultPlaylist() {
        const defaultTracks = [
            { id: 'track1', name: I18n.t('music.track1') || '曲目一', url: 'sounds/track1.mp3', isDefault: true },
            { id: 'track2', name: I18n.t('music.track2') || '曲目二', url: 'sounds/track2.mp3', isDefault: true },
            { id: 'track3', name: I18n.t('music.track3') || '曲目三', url: 'sounds/track3.mp3', isDefault: true }
        ];
        
        StorageManager.setMusicList(defaultTracks);
        this.playlist = defaultTracks;
    },
    
    // 绑定事件
    bindEvents() {
        if (!this.initElements()) return;
        
        // 播放/暂停按钮
        this.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
            this.playClickSound();
        });
        
        // 下一首按钮
        this.nextBtn.addEventListener('click', () => {
            this.next();
            this.playClickSound();
        });
        
        // 添加音乐按钮
        this.addMusicBtn.addEventListener('click', () => {
            this.musicUpload.click();
            this.playClickSound();
        });
        
        // 文件上传
        this.musicUpload.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
        
        // 监听语言变化
        window.addEventListener('languageChanged', () => {
            this.updateDisplay();
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previous();
                    break;
            }
        });
    },
    
    // 播放点击音效
    playClickSound() {
        const settings = StorageManager.getUserSettings();
        if (settings && settings.soundEnabled) {
            Utils.audio.playSound('sounds/click.mp3', 0.3);
        }
    },
    
    // 加载曲目
    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        if (this.audio) {
            this.audio.src = track.url;
            this.audio.load();
        }
        
        this.updateDisplay();
    },
    
    // 切换播放/暂停
    async togglePlayPause() {
        if (!this.audio || this.playlist.length === 0) return;
        
        try {
            if (this.isPlaying) {
                this.audio.pause();
                this.isPlaying = false;
            } else {
                await this.audio.play();
                this.isPlaying = true;
            }
            
            this.updateDisplay();
            
        } catch (error) {
            console.warn('Playback error:', error);
            this.isPlaying = false;
            this.updateDisplay();
        }
    },
    
    // 播放
    async play() {
        if (!this.isPlaying) {
            await this.togglePlayPause();
        }
    },
    
    // 暂停
    pause() {
        if (this.isPlaying) {
            this.togglePlayPause();
        }
    },
    
    // 下一首
    next() {
        if (this.playlist.length === 0) return;
        
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        
        if (this.isPlaying) {
            setTimeout(() => {
                this.play();
            }, 100);
        }
    },
    
    // 上一首
    previous() {
        if (this.playlist.length === 0) return;
        
        this.currentTrackIndex = this.currentTrackIndex === 0 
            ? this.playlist.length - 1 
            : this.currentTrackIndex - 1;
            
        this.loadTrack(this.currentTrackIndex);
        
        if (this.isPlaying) {
            setTimeout(() => {
                this.play();
            }, 100);
        }
    },
    
    // 设置音量
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    },
    
    // 更新显示
    updateDisplay() {
        if (!this.songTitle) return;
        
        // 更新歌曲标题
        if (this.playlist.length > 0 && this.currentTrackIndex < this.playlist.length) {
            this.songTitle.textContent = this.playlist[this.currentTrackIndex].name;
        } else {
            this.songTitle.textContent = I18n.t('music.noMusic') || '无音乐';
        }
        
        // 更新播放/暂停按钮
        if (this.playPauseBtn) {
            const playIcon = this.playPauseBtn.querySelector('.play-icon');
            const pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
            
            if (playIcon && pauseIcon) {
                if (this.isPlaying) {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                } else {
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                }
            }
        }
    },
    
    // 处理文件上传
    async handleFileUpload(files) {
        if (!files || files.length === 0) return;
        
        for (const file of files) {
            if (!this.isValidAudioFile(file)) {
                this.showMessage(I18n.t('music.invalidFormat') || '不支持的音频格式', 'warning');
                continue;
            }
            
            try {
                const musicData = await this.processAudioFile(file);
                this.addToPlaylist(musicData);
                this.showMessage(I18n.t('music.uploadSuccess') || '音乐添加成功', 'success');
            } catch (error) {
                console.error('Error processing audio file:', error);
                this.showMessage(I18n.t('music.uploadError') || '音乐添加失败', 'error');
            }
        }
        
        // 清空input
        this.musicUpload.value = '';
    },
    
    // 验证音频文件
    isValidAudioFile(file) {
        const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a'];
        const validExtensions = ['.mp3', '.mpeg', '.wav', '.ogg', '.m4a'];
        
        return validTypes.includes(file.type) || 
               validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    },
    
    // 处理音频文件
    async processAudioFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const audioBlob = new Blob([e.target.result], { type: file.type });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // 获取文件名（去掉扩展名）
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                
                resolve({
                    name: fileName,
                    url: audioUrl,
                    blob: audioBlob,
                    size: file.size,
                    type: file.type
                });
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    },
    
    // 添加到播放列表
    addToPlaylist(musicData) {
        const track = {
            id: Utils.generateUUID(),
            name: musicData.name,
            url: musicData.url,
            isDefault: false,
            addedAt: Date.now(),
            size: musicData.size,
            type: musicData.type
        };
        
        this.playlist.push(track);
        StorageManager.setMusicList(this.playlist);
        
        // 如果当前没有音乐在播放，加载新添加的音乐
        if (this.playlist.length === 1) {
            this.loadTrack(0);
        }
    },
    
    // 从播放列表移除
    removeFromPlaylist(trackId) {
        const index = this.playlist.findIndex(track => track.id === trackId);
        if (index === -1) return;
        
        const track = this.playlist[index];
        
        // 如果是用户上传的音乐，释放blob URL
        if (!track.isDefault && track.url.startsWith('blob:')) {
            URL.revokeObjectURL(track.url);
        }
        
        this.playlist.splice(index, 1);
        StorageManager.setMusicList(this.playlist);
        
        // 调整当前播放索引
        if (this.currentTrackIndex >= index) {
            this.currentTrackIndex = Math.max(0, this.currentTrackIndex - 1);
        }
        
        // 如果删除的是当前播放的音乐，加载新的音乐
        if (index === this.currentTrackIndex || this.playlist.length === 0) {
            if (this.playlist.length > 0) {
                this.loadTrack(this.currentTrackIndex);
            } else {
                this.audio.pause();
                this.isPlaying = false;
                this.updateDisplay();
            }
        }
    },
    
    // 显示消息
    showMessage(message, type = 'info') {
        // 创建临时消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `music-message music-message-${type}`;
        messageEl.textContent = message;
        
        messageEl.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;
            border-radius: 20px;
            color: white;
            font-size: 14px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            animation: messageSlideIn 0.3s ease-out;
        `;
        
        // 根据类型设置颜色
        switch (type) {
            case 'success':
                messageEl.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
                break;
            case 'warning':
                messageEl.style.backgroundColor = 'rgba(245, 158, 11, 0.9)';
                break;
            case 'error':
                messageEl.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                break;
            default:
                messageEl.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
        }
        
        document.body.appendChild(messageEl);
        
        // 3秒后自动移除
        setTimeout(() => {
            messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    },
    
    // 获取当前播放信息
    getCurrentTrack() {
        if (this.playlist.length === 0 || this.currentTrackIndex >= this.playlist.length) {
            return null;
        }
        
        return {
            ...this.playlist[this.currentTrackIndex],
            isPlaying: this.isPlaying,
            currentTime: this.audio ? this.audio.currentTime : 0,
            duration: this.audio ? this.audio.duration : 0
        };
    },
    
    // 获取播放列表
    getPlaylist() {
        return this.playlist;
    },
    
    // 销毁音乐管理器
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            this.audio = null;
        }
        
        // 释放用户上传音乐的blob URLs
        this.playlist.forEach(track => {
            if (!track.isDefault && track.url.startsWith('blob:')) {
                URL.revokeObjectURL(track.url);
            }
        });
        
        this.playlist = [];
        this.isPlaying = false;
    }
};

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes messageSlideIn {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes messageSlideOut {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 全局导出
window.MusicManager = MusicManager;