/**
 * 简化版背景图片渐进加载
 */
function loadBackgroundImage(imageUrl) {
    // 创建新的Image对象用于预加载图片
    const img = new Image();

    // 图片加载成功后的处理
    img.onload = function () {
        // 应用背景图片到伪元素
        const style = document.createElement("style");
        style.textContent = `
                    body::before {
                        background-image: url("${imageUrl}");
                    }
                `;
        document.head.appendChild(style);

        // 添加加载完成类，触发CSS过渡效果
        document.body.classList.add("bg-loaded");
    };

    // 开始加载图片
    img.src = imageUrl;
}

// DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
    // 你的背景图片URL
    const backgroundImageUrl =
        "https://picx.zhimg.com/100/v2-5c39f11f51c72b71082b5edfb10bb59b_r.jpg";

    // 开始加载背景图片
    loadBackgroundImage(backgroundImageUrl);
});
