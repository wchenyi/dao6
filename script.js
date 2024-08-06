// 六宫定义
const gongs = [
    { name: '大安', number: 1, color: 'green', element: '木', yinYang: '阳' },
    { name: '留连', number: 2, color: 'brown', element: '土', yinYang: '阴' },
    { name: '速喜', number: 3, color: 'red', element: '火', yinYang: '阳' },
    { name: '赤口', number: 4, color: 'gold', element: '金', yinYang: '阴' },
    { name: '小吉', number: 5, color: 'blue', element: '水', yinYang: '阳' },
    { name: '空亡', number: 6, color: 'brown', element: '土', yinYang: '阴' }
];

// 时辰五行属性
const shichenElements = {
    '子': { element: '水', yinYang: '阳' },
    '丑': { element: '土', yinYang: '阴' },
    '寅': { element: '木', yinYang: '阳' },
    '卯': { element: '木', yinYang: '阴' },
    '辰': { element: '土', yinYang: '阳' },
    '巳': { element: '火', yinYang: '阴' },
    '午': { element: '火', yinYang: '阳' },
    '未': { element: '土', yinYang: '阴' },
    '申': { element: '金', yinYang: '阳' },
    '酉': { element: '金', yinYang: '阴' },
    '戌': { element: '土', yinYang: '阳' },
    '亥': { element: '水', yinYang: '阴' }
};

// 五行生克关系
const wuxingRelations = {
    '金': { '水': '生出', '木': '克出', '金': '同', '土': '被生', '火': '被克' },
    '水': { '木': '生出', '火': '克出', '水': '同', '金': '被生', '土': '被克' },
    '木': { '火': '生出', '土': '克出', '木': '同', '水': '被生', '金': '被克' },
    '火': { '土': '生出', '金': '克出', '火': '同', '木': '被生', '水': '被克' },
    '土': { '金': '生出', '水': '克出', '土': '同', '火': '被生', '木': '被克' }
};

// 更新当前时间和农历时间
function updateTime() {
    const now = new Date();
    document.getElementById('current-time').innerHTML = `<strong>北京时间：</strong>${now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`;
    
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const lunar = solarToLunar(year, month, day);
    
    document.getElementById('lunar-time').innerHTML = `<strong>农历时间：</strong>${lunar.yearGanZhi}年${lunar.lMonthChinese}${lunar.lDayChinese} ${getShichen(now.getHours())}时`;
}

// 计算起卦结果
function calculateDivination(x, y, z) {
    x = normalizeNumber(x);
    y = normalizeNumber(y);
    z = normalizeNumber(z);

    const tianGong = gongs[x - 1];
    const diGong = gongs[normalizeNumber(x - 1 + y) - 1];
    const renGong = gongs[normalizeNumber(normalizeNumber(x - 1 + y) - 1 + z) - 1];

    return { tianGong, diGong, renGong };
}

// 归一化数字（1-6）
function normalizeNumber(num) {
    if (num <= 6) return num;
    let remainder = num % 6;
    return remainder === 0 ? 6 : remainder;
}

// 显示起卦结果
function showResult(result, method, numbers) {
    const now = new Date();
    const shichen = getShichen(now.getHours());

    document.getElementById('tian-gong').textContent = result.tianGong.name;
    document.getElementById('tian-gong').dataset.name = result.tianGong.name;
    document.getElementById('di-gong').textContent = result.diGong.name;
    document.getElementById('di-gong').dataset.name = result.diGong.name;
    document.getElementById('ren-gong').textContent = result.renGong.name;
    document.getElementById('ren-gong').dataset.name = result.renGong.name;
    document.getElementById('shi-chen').textContent = shichen + '时';
    document.getElementById('shi-chen').style.color = getShichenColor(shichen);

    document.getElementById('divination-method').innerHTML = `<strong>起卦方式：</strong>${method}`;
    
    if (numbers) {
        document.getElementById('used-numbers').innerHTML = `<strong>使用的数字：</strong>天 ${numbers[0]}，地 ${numbers[1]}，人 ${numbers[2]}`;
    } else {
        document.getElementById('used-numbers').textContent = '';
    }

    showRelations(result, shichen);
    showFortune(result.renGong.name);

    document.getElementById('result').style.display = 'block';
    document.getElementById('restart').style.display = 'block';
}

// 获取时辰的颜色
function getShichenColor(shichen) {
    const element = shichenElements[shichen].element;
    switch (element) {
        case '木': return 'green';
        case '火': return 'red';
        case '土': return 'brown';
        case '金': return 'gold';
        case '水': return 'blue';
        default: return 'black';
    }
}

// 获取两个宫位之间的关系
function getRelation(gong1, gong2) {
    return wuxingRelations[gong1.element][gong2.element];
}

// 获取体用关系
function getBodyUseRelation(body, use) {
    if (body.element === use.element) {
        return body.yinYang === use.yinYang ? '比肩' : '比助';
    }
    const relation = wuxingRelations[body.element][use.element];
    switch (relation) {
        case '被克': return '小凶';
        case '克出': return '小吉';
        case '被生': return '大吉';
        case '生出': return '大凶';
        default: return relation;
    }
}

// 显示生克同关系
function showRelations(result, shichen) {
    const relationsDiv = document.getElementById('relations');
    const tianDi = getRelation(result.tianGong, result.diGong);
    const tianRen = getRelation(result.tianGong, result.renGong);
    const diRen = getRelation(result.diGong, result.renGong);
    const renShi = getBodyUseRelation(result.renGong, getShichenGong(shichen));

    relationsDiv.innerHTML = `
        <h3>关系分析</h3>
        <p><strong>天地关系：</strong>${tianDi}</p>
        <p><strong>天人关系：</strong>${tianRen}</p>
        <p><strong>地人关系：</strong>${diRen}</p>
        <p><strong>人时关系（体用）：</strong>${renShi}</p>
    `;
}

// 根据时辰获取对应的宫位
function getShichenGong(shichen) {
    return { name: shichen, ...shichenElements[shichen] };
}

// 显示吉凶信息
function showFortune(renGong) {
    const fortuneDiv = document.getElementById('fortune');
    let fortune = '';
    switch (renGong) {
        case '大安':
            fortune = '大吉';
            break;
        case '速喜':
            fortune = '中吉';
            break;
        case '小吉':
            fortune = '小吉';
            break;
        case '留连':
            fortune = '小凶（如果是晚上测就是有变数）';
            break;
        case '赤口':
            fortune = '中凶';
            break;
        case '空亡':
            fortune = '大凶（也可能是什么事情都没有）';
            break;
    }
    fortuneDiv.innerHTML = `<strong>单以人宫看吉凶：</strong>${fortune}`;
}

// 时间起卦选项
document.getElementById('time-divination').addEventListener('click', () => {
    document.getElementById('time-divination-options').style.display = 'flex';
    document.getElementById('number-input').style.display = 'none';
    document.getElementById('custom-number-input').style.display = 'none';
    document.getElementById('custom-gong-input').style.display = 'none';
});

// 数字起卦选项
document.getElementById('number-divination').addEventListener('click', () => {
    document.getElementById('number-input').style.display = 'flex';
    document.getElementById('time-divination-options').style.display = 'none';
    document.getElementById('custom-number-input').style.display = 'none';
    document.getElementById('custom-gong-input').style.display = 'none';
});

// 自选起卦选项
document.getElementById('custom-divination').addEventListener('click', () => {
    document.getElementById('custom-gong-input').style.display = 'flex';
    document.getElementById('time-divination-options').style.display = 'none';
    document.getElementById('number-input').style.display = 'none';
    document.getElementById('custom-number-input').style.display = 'none';
});

// 月-日-时起卦
document.getElementById('month-day-hour').addEventListener('click', () => {
    const now = new Date();
    const lunar = solarToLunar(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const month = lunar.lMonth;
    const day = lunar.lDay;
    const hour = now.getHours();
    const shichenIndex = Math.floor(hour / 2) + 1;

    const result = calculateDivination(month, day, shichenIndex);
    showResult(result, '月-日-时起卦', [month, day, shichenIndex]);
});

// 时-刻-分起卦
document.getElementById('hour-ke-minute').addEventListener('click', () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    const T = getShichenNumber(hour);
    const K = getKeNumber(hour, minute);
    const M = getMinuteNumber(hour, minute);
    
    const result = calculateDivination(T, K, M);
    showResult(result, '时-刻-分起卦', [T, K, M]);
});

function getShichenNumber(hour) {
    const shichen = Math.floor(hour / 2) + 1;
    return shichen > 12 ? shichen - 12 : shichen;
}

function getKeNumber(hour, minute) {
    const totalMinutes = hour % 2 === 0 ? minute : minute + 60;
    if (totalMinutes < 15) return 1;
    const ke = Math.floor(totalMinutes / 15) + 1;
    return ke > 7 ? 7 : ke;
}

function getMinuteNumber(hour, minute) {
    if (hour % 2 === 1 && minute >= 0 && minute <= 14) {
        return minute === 0 ? 1 : minute;
    }
    const remainder = minute % 15;
    return remainder === 0 ? 1 : remainder;
}

// 随机数字起卦
document.getElementById('random-number').addEventListener('click', () => {
    const randomNumbers = [
        Math.floor(Math.random() * 100) + 1,
        Math.floor(Math.random() * 100) + 1,
        Math.floor(Math.random() * 100) + 1
    ];
    const result = calculateDivination(...randomNumbers);
    showResult(result, '随机数字起卦', randomNumbers);
});

// 自选数字起卦
document.getElementById('custom-number').addEventListener('click', () => {
    document.getElementById('custom-number-input').style.display = 'flex';
});

document.getElementById('custom-number-submit').addEventListener('click', () => {
    const inputs = document.querySelectorAll('.custom-input');
    const numbers = Array.from(inputs).map(input => parseInt(input.value));
    
    if (numbers.some(isNaN) || numbers.some(num => num < 1 || num > 100)) {
        alert('请确保所有输入都是1-100之间的有效数字');
        return;
    }
    
    const result = calculateDivination(...numbers);
    showResult(result, '自选数字起卦', numbers);
});

// 自选起卦
document.getElementById('custom-gong-submit').addEventListener('click', () => {
    const inputs = document.querySelectorAll('.custom-gong');
    const gongNames = Array.from(inputs).map(input => input.value);
    
    if (!gongNames.every(name => gongs.some(gong => gong.name === name))) {
        alert('输入错误，无法起卦。请确保输入的是"大安、留连、速喜、赤口、小吉、空亡"中的任意一个。');
        return;
    }
    
    const result = {
        tianGong: gongs.find(gong => gong.name === gongNames[0]),
        diGong: gongs.find(gong => gong.name === gongNames[1]),
        renGong: gongs.find(gong => gong.name === gongNames[2])
    };
    showResult(result, '自选起卦');
});

// 重新起卦
document.getElementById('restart').addEventListener('click', () => {
    document.getElementById('result').style.display = 'none';
    document.getElementById('gong-details').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    document.getElementById('time-divination-options').style.display = 'none';
    document.getElementById('number-input').style.display = 'none';
    document.getElementById('custom-number-input').style.display = 'none';
    document.getElementById('custom-gong-input').style.display = 'none';
});

// 显示六宫详细信息
const gongDetails = {
    '大安': '数字为1、7；4、5。干支方位归类为东方，以季节论属于春季，地支月份为寅卯辰月，天干为甲乙木。藏干为甲丁。十二宫为事业宫，同时也为命宫。事业宫主外为动态宫，命宫在内为静态宫。',
    '留连': '数字为2、8；7、8。干支方位归类为东南方，暗藏西南、东北、西北三角，以季节论为春夏，地支月份为辰巳月。藏干为丁己。田宅宫，同时也为奴仆宫。田宅宫表现在外，为置田购房，安家立业； 奴仆宫表现在内，为占有欲、支配欲，有阴暗、淫私之意。',
    '速喜': '数字为3、9；6、9。干支方位归类为南方，以季节论属于长夏，地支月份为巳午未月，天干为丙丁火。藏干为丙辛。感情宫，同时也为夫妻宫，或为婚姻宫。',
    '赤口': '数字为4、10；1、2。干支方位归类为西方，以季节论属于秋季，地支月份为申酉戍月，天干为庚辛金。藏干为庚癸。疾厄宫，同时也为兄弟宫。在这里，兄弟宫并不单指兄弟姐妹，同时还包括朋友和同事或合伙人，这些人与你为比劫关系，劫有伤害之意，对应疾厄宫之理，所以，疾厄宫暗藏兄弟宫，当然，兄弟宫并非完全只坏不好，只是在这里是指这些兄弟朋友给你带来的伤害。疾厄宫为动态宫，表示外在所影响或带来的疾病与灾祸；兄弟宫为静态宫，表示内在人际关系的处理。',
    '小吉': '数字为5、11；3、8。干支方位归类为北方，以季节论属于冬季，地支月份为亥子丑月，天干为壬癸水。藏干为壬甲。为驿马宫，同时也为子女宫。',
    '空亡': '数字为6、12；5、10。干支方位归类为中央，以季节论属于冬春，地支月份为丑寅月，天干为戊已土。藏干为戊乙。福德宫，同时也是父母宫。'
};

function showGongDetails(gongName) {
    const gongInfoDiv = document.getElementById('gong-info');
    gongInfoDiv.innerHTML = `<h4 style="color: ${gongs.find(gong => gong.name === gongName).color};">${gongName}</h4><p>${gongDetails[gongName]}</p>`;
    document.getElementById('gong-details').style.display = 'block';
}

// 为每个宫位添加点击事件
document.querySelectorAll('.gong').forEach(gong => {
    gong.addEventListener('click', (e) => {
        const gongName = e.target.textContent;
        showGongDetails(gongName);
    });
});

// 深色模式切换
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀' : '🌙';
});

// 初始化
function init() {
    updateTime();
    setInterval(updateTime, 1000); // 每秒更新时间
}

// 页面加载完成后初始化
function init() {
    updateTime();
    setInterval(updateTime, 1000); // 每秒更新时间
    hideAllInputs();
}

// 隐藏所有输入选项
function hideAllInputs() {
    document.getElementById('time-divination-options').style.display = 'none';
    document.getElementById('number-input').style.display = 'none';
    document.getElementById('custom-number-input').style.display = 'none';
    document.getElementById('custom-gong-input').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById('gong-details').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
}

// 页面加载完成后初始化
window.addEventListener('load', init);

// 为所有主要起卦方法按钮添加点击事件
document.querySelectorAll('.main-method').forEach(button => {
    button.addEventListener('click', () => {
        hideAllInputs();
        switch(button.id) {
            case 'time-divination':
                document.getElementById('time-divination-options').style.display = 'flex';
                break;
            case 'number-divination':
                document.getElementById('number-input').style.display = 'flex';
                break;
            case 'custom-divination':
                document.getElementById('custom-gong-input').style.display = 'flex';
                break;
        }
    });
});