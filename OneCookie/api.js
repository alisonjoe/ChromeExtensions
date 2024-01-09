// 获取 qinglong 动态 token
async function getQLToken() {
    const { qinglongURL, clientId, clientSecret } = getSavedQinglongSettings();
    const tokenURL = `${qinglongURL}/open/auth/token?client_id=${clientId}&client_secret=${clientSecret}`;

    try {
        const response = await fetch(tokenURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to get token. Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.code !== 200) {
            throw new Error(`Failed to get token. Code: ${data.code}, Message: ${data.message}`);
        }

        return data.data.token;
    } catch (error) {
        alert("请检查青龙配置:" + error.message)
        throw new Error(`Error getting token: ${error.message}`);
    }
}



// 定义获取所有环境变量的函数
async function getAllEnvs(qlToken) {
    const { qinglongURL, clientId, clientSecret } = getSavedQinglongSettings();
    const apiUrl = `${qinglongURL}/open/envs/`;

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
    const { qinglongURL, clientId, clientSecret } = getSavedQinglongSettings();
    const updateEnvUrl = `${qinglongURL}/open/envs`;
    
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
    const { qinglongURL, clientId, clientSecret } = getSavedQinglongSettings();
    const enableEnvUrl = `${qinglongURL}/open/envs/enable`;

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

// 获取保存的 Qinglong 设置
function getSavedQinglongSettings() {
    const qinglongURL = localStorage.getItem('qinglongURL') || '';
    const clientId = localStorage.getItem('clientId') || '';
    const clientSecret = localStorage.getItem('clientSecret') || '';

    return {
        qinglongURL,
        clientId,
        clientSecret,
    };
}