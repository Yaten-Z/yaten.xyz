/**
 * 设备检测和自动重定向
 * 在 index.html 和 mobile.html 中都引入此脚本
 */
(function() {
  // 检测是否为移动设备
  function isMobileDevice() {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(navigator.userAgent);
    const isMobileWidth = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isMobileUA || (isMobileWidth && isTouchDevice);
  }
  
  function isOnMobilePage() {
    return window.location.pathname.includes('mobile.html');
  }
  
  if (isMobileDevice() && !isOnMobilePage()) {
    window.location.replace('mobile.html');
  } else if (!isMobileDevice() && isOnMobilePage()) {
    window.location.replace('index.html');
  }
})();