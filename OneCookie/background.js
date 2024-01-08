
// 在 background.js 中添加以下代码
chrome.runtime.onInstalled.addListener(() => {
  // 在插件安装时请求通知权限
  chrome.notifications.getPermissionLevel((level) => {
      if (level === 'granted') {
          console.log('Notification permission is already granted.');
      } else {
          console.log('Requesting notification permission.');
          chrome.notifications.requestPermission();
      }
  });
});