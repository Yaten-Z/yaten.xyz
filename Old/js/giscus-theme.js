/**
 * Giscus 主题管理器 - 完全重写版本
 */
class GiscusThemeManager {
    constructor() {
        this.giscusFrame = null;
        this.currentTheme = null;
        this.observer = null;
        this.giscusLoaded = false;
        
        this.init();
    }
    
    // 初始化
    init() {
        console.log('GiscusThemeManager initializing...');
        
        // 先动态加载 Giscus 脚本
        this.loadGiscusScript();
        
        // 监听主题变化
        this.observeThemeChanges();
    }
    
    // 动态加载 Giscus 脚本
    loadGiscusScript() {
        // 获取当前主题
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const theme = isLight ? 'noborder_light' : 'noborder_dark';
        this.currentTheme = theme;
        
        console.log(`Loading Giscus with theme: ${theme}`);
        
        // 创建 Giscus 脚本元素
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'Yaten-Z/blog-giscus');
        script.setAttribute('data-repo-id', 'R_kgDOOzg2eg');
        script.setAttribute('data-category', 'Announcements');
        script.setAttribute('data-category-id', 'DIC_kwDOOzg2es4Cq1Mo');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-theme', theme);
        script.setAttribute('data-lang', 'zh-CN');
        script.setAttribute('data-loading', 'lazy');
        script.crossOrigin = 'anonymous';
        script.async = true;
        
        // 监听脚本加载完成
        script.onload = () => {
            console.log('Giscus script loaded');
            this.giscusLoaded = true;
            this.waitForGiscusFrame();
        };
        
        script.onerror = () => {
            console.error('Failed to load Giscus script');
        };
        
        // 添加到容器
        const container = document.getElementById('giscus-container');
        if (container) {
            container.appendChild(script);
        }
    }
    
    // 等待 Giscus iframe 加载
    waitForGiscusFrame() {
        let attempts = 0;
        const maxAttempts = 20; // 最多尝试20次，每次500ms
        
        const checkFrame = () => {
            attempts++;
            this.giscusFrame = document.querySelector('iframe[src*="giscus.app"]');
            
            if (this.giscusFrame) {
                console.log('Giscus frame found after', attempts, 'attempts');
                
                // 等待iframe完全加载
                if (this.giscusFrame.contentWindow) {
                    console.log('Giscus frame is ready');
                    return;
                }
                
                this.giscusFrame.addEventListener('load', () => {
                    console.log('Giscus frame loaded event fired');
                });
                
            } else if (attempts < maxAttempts) {
                // 继续等待
                setTimeout(checkFrame, 500);
            } else {
                console.warn('Giscus frame not found after maximum attempts');
            }
        };
        
        // 开始检查
        setTimeout(checkFrame, 500);
    }
    
    // 监听主题变化
    observeThemeChanges() {
        // 使用 MutationObserver 监听 data-theme 属性变化
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'data-theme') {
                    console.log('Theme change detected');
                    this.updateGiscusTheme();
                }
            });
        });
        
        // 监听 documentElement 的属性变化
        this.observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        // 也监听自定义主题变更事件
        document.addEventListener('themeChanged', (e) => {
            console.log('Custom theme change event received:', e.detail.theme);
            this.updateGiscusTheme();
        });
    }
    
    // 更新 Giscus 主题
    updateGiscusTheme() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const newTheme = isLight ? 'noborder_light' : 'noborder_dark';
        
        console.log(`Updating Giscus theme to: ${newTheme}, current: ${this.currentTheme}`);
        
        // 如果主题没有变化，不需要更新
        if (newTheme === this.currentTheme) {
            console.log('Theme unchanged, skipping update');
            return;
        }
        
        this.currentTheme = newTheme;
        
        // 如果 Giscus 还没有加载，重新加载
        if (!this.giscusLoaded || !this.giscusFrame) {
            console.log('Giscus not ready, reloading...');
            this.reloadGiscus();
            return;
        }
        
        try {
            // 向 Giscus iframe 发送主题变更消息
            const message = {
                type: 'set-theme',
                theme: newTheme
            };
            
            console.log('Sending theme message to Giscus:', message);
            
            this.giscusFrame.contentWindow.postMessage(
                { giscus: message }, 
                'https://giscus.app'
            );
            
        } catch (error) {
            console.warn('Failed to update Giscus theme via postMessage:', error);
            // 如果 postMessage 失败，尝试重新加载
            this.reloadGiscus();
        }
    }
    
    // 重新加载 Giscus
    reloadGiscus() {
        console.log('Reloading Giscus...');
        
        // 清除现有的 Giscus 内容
        const container = document.getElementById('giscus-container');
        if (container) {
            container.innerHTML = '<div class="giscus-loading"><i class="fas fa-spinner fa-spin"></i><p>正在加载评论系统...</p></div>';
        }
        
        // 重置状态
        this.giscusFrame = null;
        this.giscusLoaded = false;
        
        // 延迟重新加载
        setTimeout(() => {
            this.loadGiscusScript();
        }, 500);
    }
    
    // 手动更新主题（可供其他脚本调用）
    forceUpdateTheme() {
        console.log('Force updating Giscus theme...');
        this.currentTheme = null; // 强制更新
        this.updateGiscusTheme();
    }
    
    // 获取当前主题
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // 销毁观察器
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保主题管理器先初始化
    setTimeout(() => {
        console.log('Initializing GiscusThemeManager...');
        window.giscusThemeManager = new GiscusThemeManager();
    }, 500);
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GiscusThemeManager;
}