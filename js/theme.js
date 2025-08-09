/**
 * 统一的主题切换功能
 */
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.githubCard = document.getElementById('githubCard');
        
        // 初始化主题
        this.initTheme();
        
        // 绑定事件
        this.bindEvents();
    }
    
    // 初始化主题
    initTheme() {
        // 从localStorage获取保存的主题，默认为深色主题
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    }
    
    // 设置主题
    setTheme(theme) {
        const html = document.documentElement;
        const body = document.body;
        
        if (theme === 'light') {
            // 设置浅色主题
            html.setAttribute('data-theme', 'light');
            body.classList.remove('dark');
            this.themeIcon.className = 'fas fa-moon';
            this.themeToggle.setAttribute('aria-label', '切换到深色模式');
            
            // 更新 GitHub 卡片（如果存在）
            if (this.githubCard) {
                this.githubCard.src = "https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=Yaten-Z";
            }
        } else {
            // 设置深色主题
            html.removeAttribute('data-theme');
            body.classList.add('dark');
            this.themeIcon.className = 'fas fa-sun';
            this.themeToggle.setAttribute('aria-label', '切换到浅色模式');
            
            // 更新 GitHub 卡片（如果存在）
            if (this.githubCard) {
                this.githubCard.src = "https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=Yaten-Z&theme=blueberry";
            }
        }
        
        // 保存主题到localStorage
        localStorage.setItem('theme', theme);
        
        // 通知其他组件主题已更改
        this.notifyThemeChange(theme);
    }
    
    // 通知主题更改（用于 Giscus 等组件）
    notifyThemeChange(theme) {
        console.log(`Theme changed to: ${theme}`);
        
        // 触发自定义事件
        const event = new CustomEvent('themeChanged', {
            detail: { theme }
        });
        document.dispatchEvent(event);
        
        // 延迟触发 storage 事件（用于跨标签页同步）
        setTimeout(() => {
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'theme',
                newValue: theme,
                storageArea: localStorage
            }));
        }, 100);
    }
    
    // 切换主题
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    // 绑定事件
    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // 键盘支持 - 按T键切换主题
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                // 确保不在输入框中
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'INPUT' && 
                    activeElement.tagName !== 'TEXTAREA' && 
                    !activeElement.isContentEditable) {
                    this.toggleTheme();
                }
            }
        });
    }
    
    // 获取当前主题
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }
}

// DOM加载完成后初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// 导出给其他模块使用（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}