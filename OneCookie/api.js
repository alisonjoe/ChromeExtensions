// 获取 qinglong 动态 token
function getQLToken() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const cid = "ZbmkOvwR_96U";
        const secret = "d4umwwlB8d792l8US_BM06zt";
        const tokenURL = `http://qinglong.wxy-vision.com/open/auth/token?client_id=${cid}&client_secret=${secret}`;

        xhr.open('GET', tokenURL, true);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    const responseData = JSON.parse(xhr.responseText);
                    if (responseData.code === 200) {
                        resolve(responseData.data.token);
                    } else {
                        reject(`Request failed. Returned status of ${xhr.status}. Code: ${responseData.code}`);
                    }
                } else {
                    reject(`Request failed. Returned status of ${xhr.status}`);
                }
            }
        };
    });
}

// 定义获取所有环境变量的函数
async function getAllEnvs(qlToken) {
    const apiUrl = 'http://qinglong.wxy-vision.com/open/envs/';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${qlToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        throw new Error(`Failed to fetch environment variables: ${error.message}`);
    }
}


// 更新环境变量
async function updateEnv(qlToken, envId, newValue, remarks) {
    const updateEnvUrl = `http://qinglong.wxy-vision.com/open/envs`;
    
    const response = await fetch(updateEnvUrl, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${qlToken}`
        },
        body: JSON.stringify({
            id: envId,
            name: "JD_COOKIE",
            value: newValue,
            remarks: remarks,
        })
    });

    if (response.ok) {
        const updatedEnv = await response.json();
        console.log('Updated environment variable:', updatedEnv);
        return updatedEnv;
    } else {
        const errorData = await response.json();
        console.error('Error updating environment variable:', errorData);
        throw new Error('Failed to update environment variable');
    }
}

// 启用环境变量
async function enableEnv(qlToken, envId) {
    const enableEnvUrl = `http://qinglong.wxy-vision.com/open/envs/enable`;

    try {
    const response = await fetch(enableEnvUrl, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${qlToken}`
        },
        body: JSON.stringify([envId])
    });

    if (response.ok) {
        const enabledEnv = await response.json();
        console.log('Enabled environment variable:', enabledEnv);
        showNotification('Success', 'Environment variable enabled successfully.');
        return enabledEnv;
    } else {
        const errorData = await response.json();
        console.error('Error enabling environment variable:', errorData);
        showNotification('Error', 'Failed to enable environment variable. Check the console for details.');
        throw new Error('Failed to enable environment variable');
    }
    } catch (error) {
        console.error(error.message);
        showNotification('Error', 'Failed to enable environment variable. Check the console for details.');
        throw new Error('Failed to enable environment variable');
    }
}

// 通知函数
function showNotification(title, message) {
    console.log('Showing notification:', title, message);

    alert(message);
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/get_started16.png', // 替换为你的图标路径
        title: title,
        message: message
    });
}
