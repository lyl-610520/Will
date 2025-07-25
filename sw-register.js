// Service Worker 注册和管理
const ServiceWorkerManager = {
    registration: null,
    
    // 注册 Service Worker
    async register() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return false;
        }
        
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker registered successfully');
            
            // 监听更新
            this.handleUpdates();
            
            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    },
    
    // 处理 Service Worker 更新
    handleUpdates() {
        if (!this.registration) return;
        
        // 监听安装事件
        this.registration.addEventListener('updatefound', () => {
            const newWorker = this.registration.installing;
            
            if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // 有新版本可用
                        this.showUpdateAvailable();
                    }
                });
            }
        });
        
        // 监听控制器变化
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            // Service Worker 已更新，刷新页面
            window.location.reload();
        });
    },
    
    // 显示更新可用提示
    showUpdateAvailable() {
        // 创建更新提示
        const updateNotice = document.createElement('div');
        updateNotice.className = 'update-notice';
        updateNotice.innerHTML = `
            <div class="update-content">
                <p>新版本可用</p>
                <button class="update-btn" onclick="ServiceWorkerManager.applyUpdate()">更新</button>
                <button class="dismiss-btn" onclick="ServiceWorkerManager.dismissUpdate()">稍后</button>
            </div>
        `;
        
        updateNotice.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            padding: 16px 20px;
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
            box-shadow: 0 8px 32px var(--shadow-light);
        `;
        
        document.body.appendChild(updateNotice);
    },
    
    // 应用更新
    applyUpdate() {
        if (this.registration && this.registration.waiting) {
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        this.dismissUpdate();
    },
    
    // 取消更新提示
    dismissUpdate() {
        const notice = document.querySelector('.update-notice');
        if (notice) {
            notice.style.animation = 'slideUp 0.3s ease-in forwards';
            setTimeout(() => {
                notice.remove();
            }, 300);
        }
    },
    
    // 请求持久化存储
    async requestPersistentStorage() {
        if ('storage' in navigator && 'persist' in navigator.storage) {
            try {
                const granted = await navigator.storage.persist();
                console.log(granted ? 'Persistent storage granted' : 'Persistent storage denied');
                return granted;
            } catch (error) {
                console.warn('Persistent storage request failed:', error);
                return false;
            }
        }
        return false;
    },
    
    // 获取存储使用情况
    async getStorageEstimate() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                return {
                    quota: estimate.quota,
                    usage: estimate.usage,
                    available: estimate.quota - estimate.usage,
                    percentage: Math.round((estimate.usage / estimate.quota) * 100)
                };
            } catch (error) {
                console.warn('Storage estimate failed:', error);
                return null;
            }
        }
        return null;
    },
    
    // 清理缓存
    async clearCache() {
        if (this.registration) {
            try {
                await this.sendMessage({ type: 'CLEAR_CACHE' });
                console.log('Cache cleared successfully');
                return true;
            } catch (error) {
                console.error('Cache clear failed:', error);
                return false;
            }
        }
        return false;
    },
    
    // 发送消息给 Service Worker
    async sendMessage(message) {
        if (!this.registration || !this.registration.active) {
            throw new Error('Service Worker not active');
        }
        
        return new Promise((resolve, reject) => {
            const messageChannel = new MessageChannel();
            
            messageChannel.port1.onmessage = (event) => {
                if (event.data.error) {
                    reject(new Error(event.data.error));
                } else {
                    resolve(event.data);
                }
            };
            
            this.registration.active.postMessage(message, [messageChannel.port2]);
        });
    }
};

// 添加更新动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
    
    .update-content {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-primary);
    }
    
    .update-content p {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
    }
    
    .update-btn, .dismiss-btn {
        padding: 6px 12px;
        border-radius: 8px;
        border: none;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .update-btn {
        background: var(--accent-primary);
        color: white;
    }
    
    .update-btn:hover {
        background: var(--accent-secondary);
        transform: translateY(-1px);
    }
    
    .dismiss-btn {
        background: var(--glass-bg);
        color: var(--text-secondary);
        border: 1px solid var(--glass-border);
    }
    
    .dismiss-btn:hover {
        background: var(--bg-tertiary);
    }
`;
document.head.appendChild(style);

// 自动注册 Service Worker
document.addEventListener('DOMContentLoaded', () => {
    ServiceWorkerManager.register();
    ServiceWorkerManager.requestPersistentStorage();
});

// 全局导出
window.ServiceWorkerManager = ServiceWorkerManager;