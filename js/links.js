/**
 * 友链页面管理器
 */
class FriendsManager {
    constructor() {
        this.friendsGrid = document.getElementById('friendsGrid');
        this.friendsData = [];
        
        this.init();
    }
    
    // 初始化
    async init() {
        try {
            await this.loadFriendsData();
            this.renderFriends();
        } catch (error) {
            this.showError('加载友链数据失败');
            console.error('Failed to load friends data:', error);
        }
    }
    
    // 加载友链数据
    async loadFriendsData() {
        try {
            const response = await fetch('data/links.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.friendsData = data.friends || [];
        } catch (error) {
            // 如果加载失败，使用默认数据
            console.warn('Failed to load friends.json, using default data');
            this.friendsData = this.getDefaultFriendsData();
        }
    }
    
    // 默认友链数据（作为备用）
    getDefaultFriendsData() {
        return [
            {
                "name": "TATEN",
                "url": "https://taten.xyz",
                "avatar": "https://s1.imagehub.cc/images/2025/08/01/aacbcc1f6151e74eadb1d372e7caa5bf.png",
                "description": "一群热爱编程的学生，致力于探索技术的无限可能。"
            }
        ];
    }
    
    // 渲染友链
    renderFriends() {
        if (this.friendsData.length === 0) {
            this.showEmpty();
            return;
        }
        
        const friendsHTML = this.friendsData.map(friend => 
            this.createFriendCard(friend)
        ).join('');
        
        this.friendsGrid.innerHTML = friendsHTML;
        
        // 添加点击统计（可选）
        this.addClickTracking();
    }
    
    // 创建友链卡片
    createFriendCard(friend) {
        // 处理头像加载失败的情况
        const avatarError = `this.onerror=null; this.src='https://via.placeholder.com/50x50/${this.getRandomColor()}/${this.getContrastColor()}?text=${friend.name.charAt(0).toUpperCase()}';`;
        
        return `
            <a href="${this.escapeHtml(friend.url)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="friend-card"
               data-friend="${this.escapeHtml(friend.name)}">
                <div class="friend-header">
                    <img class="friend-avatar" 
                         src="${this.escapeHtml(friend.avatar)}" 
                         alt="${this.escapeHtml(friend.name)}的头像"
                         onerror="${avatarError}">
                    <div class="friend-info">
                        <h3>${this.escapeHtml(friend.name)}</h3>
                        <div class="friend-url">${this.escapeHtml(this.formatUrl(friend.url))}</div>
                    </div>
                </div>
                <p class="friend-description">${this.escapeHtml(friend.description)}</p>
            </a>
        `;
    }
    
    // 格式化URL显示
    formatUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            return url;
        }
    }
    
    // 获取随机颜色（用于默认头像）
    getRandomColor() {
        const colors = ['4fc3f7', '66bb6a', 'ff7043', 'ab47bc', 'ffa726', '26c6da'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 获取对比色
    getContrastColor() {
        return 'ffffff';
    }
    
    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 显示错误信息
    showError(message) {
        this.friendsGrid.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
    
    // 显示空状态
    showEmpty() {
        this.friendsGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-users"></i>
                <p>暂无友链</p>
            </div>
        `;
    }
    
    // 添加点击统计（可选功能）
    addClickTracking() {
        const friendCards = this.friendsGrid.querySelectorAll('.friend-card');
        friendCards.forEach(card => {
            card.addEventListener('click', () => {
                const friendName = card.getAttribute('data-friend');
                console.log(`Clicked on friend: ${friendName}`);
                // 这里可以添加统计代码，比如发送到分析服务
            });
        });
    }
    
    // 重新加载友链（用于刷新）
    async reload() {
        this.friendsGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>正在重新加载...</p>
            </div>
        `;
        
        await this.init();
    }
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new FriendsManager();
});

// 导出给其他模块使用（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FriendsManager;
}