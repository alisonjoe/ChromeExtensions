
document.addEventListener('DOMContentLoaded', function () {
    // 加载系统公告
    loadFilesFromFolder();
    // 加载青龙设置
    loadQinglongSettings();

    // Add click event listeners to navigation links
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Add event listener to the save button
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveQinglongSettings);
    }
});

function loadFilesFromFolder() {
    const folderPath = 'comment/';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', folderPath, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const fileList = xhr.responseText.split('\n');
            console.log('Files:', fileList);

            // 遍历文件列表，逐个加载文件内容
            fileList.forEach(file => {
                if (file.trim() !== '') {
                    loadFileContent(file.trim());
                }
            });
        } else {
            console.error('Error loading files from folder:', xhr.statusText);
        }
    };

    xhr.send();
}

function loadFileContent(filePath) {
    const fileUrl = 'comment/' + filePath;

    fetch(fileUrl)
        .then(response => response.text())
        .then(fileContent => {
            // 在这里可以处理加载到的文件内容
            appendFileContent(fileContent);
        })
        .catch(error => {
            console.error('Error loading file content:', error);
        });
}

function appendFileContent(fileContent) {
    // 获取公告容器
    const systemAnnouncement = document.getElementById('systemAnnouncement');

    // 创建一个新的 div 元素用于显示文件内容
    const fileContentDiv = document.createElement('div');
    fileContentDiv.innerHTML = fileContent;

    // 将新的 div 元素追加到公告容器中
    systemAnnouncement.appendChild(fileContentDiv);
}

function handleNavigation(event) {
    event.preventDefault();

    // 获取目标内容的 ID
    const targetContentId = event.target.getAttribute('href').substring(1);

    // 隐藏所有内容区域
    const contentSections = document.querySelectorAll('.content');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    // 显示选定的内容区域
    const targetContent = document.getElementById(targetContentId);
    if (targetContent) {
        targetContent.style.display = 'block';

        // 根据选定的链接加载特定的内容
        if (targetContentId === 'qinglongSettings') {
            loadQinglongSettings();
        }
    }
}

function loadQinglongSettings() {
    // 获取 Qinglong 设置
    const qinglongURL = localStorage.getItem('qinglongURL') || '';
    const clientId = localStorage.getItem('clientId') || '';
    const clientSecret = localStorage.getItem('clientSecret') || '';

    // 将输入字段填充为保存的 Qinglong 设置
    document.getElementById('qinglongURL').value = qinglongURL;
    document.getElementById('clientId').value = clientId;
    document.getElementById('clientSecret').value = clientSecret;
}

function saveQinglongSettings() {
    // 获取输入字段的值
    const qinglongURL = document.getElementById('qinglongURL').value;
    const clientId = document.getElementById('clientId').value;
    const clientSecret = document.getElementById('clientSecret').value;

    // 保存 Qinglong 设置到本地存储
    localStorage.setItem('qinglongURL', qinglongURL);
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('clientSecret', clientSecret);

    // 提示用户设置已保存
    alert('Qinglong settings saved successfully!');
}
