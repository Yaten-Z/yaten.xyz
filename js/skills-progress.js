/**
 * 技能进度条动画管理器
 */
class SkillsProgressManager {
    constructor() {
        this.progressBars = document.querySelectorAll('.progress-fill');
        this.skillItems = document.querySelectorAll('.skill-item');
        this.observer = null;
        
        this.init();
    }
    
    // 初始化
    init() {
        // 如果支持 Intersection Observer，使用它来检测元素是否在视口中
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // 降级处理：直接启动动画
            this.animateAllProgressBars();
        }
        
        // 添加悬停效果
        this.setupHoverEffects();
    }
    
    // 设置 Intersection Observer
    setupIntersectionObserver() {
        const options = {
            threshold: 0.3, // 至少30%的元素可见时触发
            rootMargin: '0px 0px -50px 0px' // 提前50px触发
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress-fill');
                    if (progressBar && !progressBar.classList.contains('animated')) {
                        this.animateProgressBar(progressBar);
                    }
                }
            });
        }, options);
        
        // 观察所有技能项
        this.skillItems.forEach(item => {
            this.observer.observe(item);
        });
    }
    
    // 动画单个进度条
    animateProgressBar(progressBar) {
        const targetProgress = parseInt(progressBar.getAttribute('data-progress'));
        
        // 标记为已动画，避免重复触发
        progressBar.classList.add('animated');
        
        // 延迟启动动画，创建更自然的效果
        setTimeout(() => {
            progressBar.style.width = targetProgress + '%';
            
            // 添加数字动画效果
            const progressText = progressBar.closest('.skill-item').querySelector('.progress-text');
            if (progressText) {
                this.animateProgressText(progressText, targetProgress);
            }
        }, Math.random() * 300); // 随机延迟0-300ms
    }
    
    // 动画进度数字
    animateProgressText(element, targetValue) {
        let currentValue = 0;
        const increment = targetValue / 50; // 分50步完成动画
        const duration = 1500; // 1.5秒
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.round(currentValue) + '%';
        }, stepTime);
    }
    
    // 动画所有进度条（降级处理）
    animateAllProgressBars() {
        this.progressBars.forEach((progressBar, index) => {
            setTimeout(() => {
                this.animateProgressBar(progressBar);
            }, index * 200); // 错开动画时间
        });
    }
    
    // 设置悬停效果
    setupHoverEffects() {
        this.skillItems.forEach(item => {
            const progressFill = item.querySelector('.progress-fill');
            const progressText = item.querySelector('.progress-text');
            
            item.addEventListener('mouseenter', () => {
                if (progressFill) {
                    progressFill.style.transform = 'scaleY(1.2)';
                    progressFill.style.filter = 'brightness(1.1)';
                }
                if (progressText) {
                    progressText.style.transform = 'scale(1.1)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (progressFill) {
                    progressFill.style.transform = 'scaleY(1)';
                    progressFill.style.filter = 'brightness(1)';
                }
                if (progressText) {
                    progressText.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    // 重置所有动画（用于主题切换等场景）
    resetAnimations() {
        this.progressBars.forEach(progressBar => {
            progressBar.classList.remove('animated');
            progressBar.style.width = '0%';
        });
        
        // 重新启动观察
        if (this.observer) {
            this.skillItems.forEach(item => {
                this.observer.observe(item);
            });
        } else {
            setTimeout(() => {
                this.animateAllProgressBars();
            }, 300);
        }
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
    // 等待CSS加载完成
    setTimeout(() => {
        new SkillsProgressManager();
    }, 100);
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsProgressManager;
}