// 通过 ID 找到元素
const getCookieBtn = document.getElementById('getCookie');
const pushBtn = document.getElementById('pushServer');
const textShow = document.getElementById('textshow');
// 获取打开新标签页按钮元素
const openJDTabBtn = document.getElementById('openJDTab');


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

// 封装获取当前网页 cookie 的函数
async function getJDCookie() {
  try {
      // 查询当前活动的标签页
      const tabs = await queryTabs();

      // tabs 是一个包含当前标签页对象的数组
      var currentTab = tabs[0];

      if (!currentTab) {
          console.error('Unable to get current tab.');
          return null;
      }

      // 获取当前标签页的 URL
      var currentUrl = currentTab.url;

      if (!currentUrl) {
          console.error('Unable to get current URL.');
          return null;
      }

      console.log('Current Tab ID:', currentTab.id);
      console.log('Current URL:', currentUrl);

      return new Promise((resolve, reject) => {
          chrome.cookies.getAll({ url: currentUrl }, function (cookies) {
              if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                  reject(new Error(chrome.runtime.lastError));
              } else {
                  console.log('Cookies:', cookies);

                  var result = {
                      pt_key: null,
                      pt_pin: null
                  };

                  for (var i = 0; i < cookies.length; i++) {
                      var cookie = cookies[i];
                      console.log(cookie.name + "=" + cookie.value);
                      if (cookie.name == "pt_key") {
                          result.pt_key = cookie.value;
                      }
                      if (cookie.name == "pt_pin") {
                          result.pt_pin = cookie.value;
                      }
                  }

                  if (result.pt_key && result.pt_pin) {
                      resolve(result);
                  } else {
                      alert("请先登录京东网页版")
                      reject(new Error('pt_key or pt_pin not found in cookies.'));
                  }
              }
          });
      });
  } catch (error) {
      console.error(error.message);
      throw new Error('Failed to get current page cookie.');
  }
}

// 在按钮点击事件处理中调用该函数
getCookieBtn.addEventListener('click', async () => {
  try {
      const { pt_key, pt_pin } = await getJDCookie();
      if (pt_key && pt_pin) {
          console.log('pt_key:', pt_key);
          console.log('pt_pin:', pt_pin);
          // 这里你可以对 pt_key 和 pt_pin 进行处理
          textShow.value = `pt_key=${pt_key};pt_pin=${pt_pin}`;
      } else {
        alert("请先登录京东网页版")
        console.log('Cookie not found.');
      }
  } catch (error) {
      console.log(error.message);
  }
});

// 遍历 envs 查找 pt_pin 相等的数据
function findEnvByPtPin(envs, pt_pin) {
  return envs.find(env => env.value.includes(`pt_pin=${pt_pin}`));
}


// 点击按钮打开新标签页
openJDTabBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://m.jd.com' });
});


pushBtn.addEventListener('click', async () => {
  try {
    // 调用 getQLToken 获取 token
    const qlToken = await getQLToken();
    if (qlToken == null || qlToken == "") {
      alert("确认你填入了正确的青龙服务器配置")
      return;
    }

    // 在这里处理获取到 token 后的逻辑
    console.log('Got Qinglong Token:', qlToken);

    // 获取所有环境变量
    const envs = await getAllEnvs(qlToken);
    console.log(envs);

    const { pt_key, pt_pin } = await getJDCookie();

    const foundEnv = findEnvByPtPin(envs, pt_pin);
    if (foundEnv) {
      console.log('Found environment variable:', foundEnv);
      const updatedEnv = await updateEnv(qlToken, foundEnv.id, `pt_key=${pt_key};pt_pin=${pt_pin};`, foundEnv.remarks);
      console.log('Environment variable updated:', updatedEnv);
      // 启用环境变量
      await enableEnv(qlToken, foundEnv.id);

      // 在这里处理找到环境变量后的逻辑
    } else {
      console.log('Environment variable not found for pt_pin:', pt_pin);
      // 在这里处理未找到环境变量的逻辑
    }
    // 在这里添加你的逻辑，使用 qlToken 向服务器提交请求等
  } catch (error) {
    console.log('Error:', error);
    // 在这里处理获取 token 失败的逻辑
  }
});
