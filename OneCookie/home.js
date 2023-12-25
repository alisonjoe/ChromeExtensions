// 通过 ID 找到元素
const getCookieBtn = document.getElementById('getCookie');
const pushBtn = document.getElementById('pushServer');


// 封装 chrome.tabs.query 为 Promise
function queryTabs() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                resolve(tabs);
            } else {
                reject(new Error('Unable to get current tab.'));
            }
        });
    });
}

// 实现点击按钮获取当前网页 cookie
getCookieBtn.addEventListener('click', async () => {
    try {
        // 查询当前活动的标签页
        const tabs = await queryTabs();

        // tabs 是一个包含当前标签页对象的数组
        var currentTab = tabs[0];

        if (!currentTab) {
            console.error('Unable to get current tab.');
            return;
        }

        // 获取当前标签页的 URL
        var currentUrl = currentTab.url;

        if (!currentUrl) {
            console.error('Unable to get current URL.');
            return;
        }

        console.log('Current Tab ID:', currentTab.id);
        console.log('Current URL:', currentUrl);

        // 其他逻辑...
        // 获取当前标签页的 cookie
        chrome.cookies.getAll({ url: currentUrl }, function (allCookies) {
            console.log('All Cookies:', allCookies);
            // 这里可以对获取到的所有 cookie 进行筛选
            var filteredCookies = allCookies.filter(function (cookie) {
                // 在这里添加你的过滤条件
                return cookie.sameSite === 'no_restriction';
            });

            console.log('Filtered Cookies:', filteredCookies);
            // cookies 是一个包含当前标签页所有 cookie 的数组
            console.log('Cookies:', cookies);

            // 在这里查找特定键对应的 Cookie
            var targetKey = 'pin';

            // 使用 Array.find 查找特定键对应的 Cookie
            var foundCookie = cookies.find(function (cookie) {
                return cookie.name === targetKey;
            });
            if (foundCookie) {
                console.log('Found cookie:', foundCookie);
            } else {
                console.log('Cookie with key', targetKey, 'not found.');
            }

            console.log('Found cookie length', cookies.length);

            // 或者使用 for 循环遍历查找
            for (var i = 0; i < cookies.length; i++) {
                console.log('Found cookie:', cookies[i].name, cookies[i].value);
            }

            // 在这里可以对获取到的 cookies 进行处理
        });
    } catch (error) {
        console.error(error.message);
    }
});
