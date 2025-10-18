/**
 * 版权页面管理器
 */
class CopyrightManager {
    constructor() {
        this.contactLinks = document.querySelectorAll('.contact-link');
        this.init();
    }
    
    // 初始化
    init() {
        this.setupCopyLinks();
    }
    
    // 设置复制链接功能
    setupCopyLinks() {
        this.contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const textToCopy = link.getAttribute('data-copy');
                if (textToCopy) {
                    e.preventDefault();
                    this.copyToClipboard(textToCopy, link);
                }
            });
        });
    }
    
    // 复制到剪贴板
    copyToClipboard(text, link) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = link.textContent;
            link.innerHTML = '<i class="fas fa-check"></i> 已复制！';
            link.style.background = 'rgba(76, 175, 80, 0.2)';
            link.style.borderColor = '#4caf50';
            
            setTimeout(() => {
                link.innerHTML = originalText;
                link.style.background = 'var(--skill-item-bg)';
                link.style.borderColor = 'var(--skill-item-border)';
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
        });
    }
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new CopyrightManager();
});

// 导出给其他模块使用（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CopyrightManager;
}