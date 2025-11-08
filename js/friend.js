// 加载友链数据
async function loadFriends() {
    try {
        const response = await fetch('data/links.json');
        const data = await response.json();
        renderFriends(data.friends);
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('加载友链失败:', error);
        document.getElementById('loading').innerHTML = '<p style="color: #e74c3c;">加载失败，请稍后重试</p>';
    }
}

// 渲染友链卡片
function renderFriends(friends) {
    const container = document.getElementById('friendsContainer');
    container.innerHTML = friends.map(friend => `
                <a href="${friend.url}" target="_blank" class="friend-card-link">
                    <div class="friend-card">
                        <img src="${friend.avatar}" alt="${friend.name}" class="friend-avatar" onerror="this.src='https://via.placeholder.com/120?text=${friend.name}'">
                        <div class="friend-info">
                            <h3 class="friend-name">${friend.name}</h3>
                            <p class="friend-desc">${friend.description}</p>
                            <span class="friend-link">${friend.url}</span>
                        </div>
                    </div>
                </a>
            `).join('');
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', loadFriends);