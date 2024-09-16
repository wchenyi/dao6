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
    '金': { '木': '克出', '火': '被克', '水': '被生', '土': '生出', '金': '同' },
    '木': { '火': '生出', '土': '克出', '金': '被克', '水': '被生', '木': '同' },
    '水': { '木': '生出', '火': '克出', '土': '被克', '金': '生出', '水': '同' },
    '火': { '土': '生出', '金': '克出', '木': '被生', '水': '被克', '火': '同' },
    '土': { '金': '生出', '水': '克出', '火': '被生', '木': '被克', '土': '同' }
};

// 八卦定义
const bagua = {
    '阳阳阳': { symbol: '☰', name: '乾卦', element: '金', yinYang: '阳' },
    '阴阳阳': { symbol: '☱', name: '兑卦', element: '金', yinYang: '阴' },
    '阳阴阳': { symbol: '☲', name: '离卦', element: '火', yinYang: '阳' },
    '阴阴阳': { symbol: '☳', name: '震卦', element: '木', yinYang: '阳' },
    '阳阳阴': { symbol: '☴', name: '巽卦', element: '木', yinYang: '阳' },
    '阴阳阴': { symbol: '☵', name: '坎卦', element: '水', yinYang: '阳' },
    '阳阴阴': { symbol: '☶', name: '艮卦', element: '土', yinYang: '阴' },
    '阴阴阴': { symbol: '☷', name: '坤卦', element: '土', yinYang: '阳' }
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

    // 清空之前的宫位详情和八卦具象
    document.getElementById('gong-details').innerHTML = '';
    const existingBaguaInfo = document.querySelector('.bagua-info');
    if (existingBaguaInfo) {
        existingBaguaInfo.remove();
    }

    // 显示宫位详情
    showGongDetails(result.tianGong.name);
    showGongDetails(result.diGong.name);
    showGongDetails(result.renGong.name);

    // 生成并显示新的八卦信息
    const baguaResult = generateBagua(result);
    showBaguaInfo(baguaResult, result);

    // 显示三宫具象
    showSanGongJuXiang(result);

    document.getElementById('result').style.display = 'block';
    document.getElementById('gong-details').style.display = 'block';
    document.getElementById('restart').style.display = 'block';
    document.getElementById('san-gong-ju-xiang').style.display = 'block';
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
        return body.yinYang === use.yinYang ? '比劫' : '比助';
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

// 根据起卦结果生成八卦
function generateBagua(result) {
    const yinYangMap = {
        '大安': '阳', '速喜': '阳', '小吉': '阳',
        '留连': '阴', '赤口': '阴', '空亡': '阴'
    };
    
    const yinYangPattern = [
        yinYangMap[result.tianGong.name],
        yinYangMap[result.diGong.name],
        yinYangMap[result.renGong.name]
    ];
    
    const baguaSymbol = bagua[yinYangPattern.join('')].symbol;
    
    return {
        yinYangPattern: yinYangPattern,
        baguaSymbol: baguaSymbol
    };
}

// 显示八卦信息
function showBaguaInfo(baguaResult, result) {
    const baguaInfo = bagua[baguaResult.yinYangPattern.join('')];
    const baguaDiv = document.createElement('div');
    baguaDiv.className = 'bagua-info';
    baguaDiv.innerHTML = `
        <h3>八卦具象</h3>
        <div class="bagua-lines">
            ${baguaResult.yinYangPattern.map((line, index) => 
                `<div class="bagua-line ${line}">
                    ${line === '阳' ? '—' : '--'} 
                    <span class="gong-name">${index === 0 ? '天宫' : index === 1 ? '地宫' : '人宫'}: 
                    ${[result.tianGong.name, result.diGong.name, result.renGong.name][index]}</span>
                </div>`
            ).join('')}
        </div>
        <p class="bagua-symbol" style="color: ${baguaInfo.element === '金' ? 'gold' : baguaInfo.element === '木' ? 'green' : baguaInfo.element === '水' ? 'blue' : baguaInfo.element === '火' ? 'red' : 'brown'};">
            ${baguaInfo.symbol}：${baguaInfo.name}【${baguaInfo.yinYang}-${baguaInfo.element}】
        </p>
        <p class="bagua-meaning">${getBaguaMeaning(baguaInfo.name)}</p>
    `;
    document.getElementById('result').appendChild(baguaDiv);
}

// 获取八卦含义
function getBaguaMeaning(baguaName) {
    const baguaMeanings = {
        '乾卦': '五行属金，方位为西北，人物为老年男性或当官的。为46岁以上男性 天、父、老人、官贵、头、骨、马、金、宝珠、玉、木果、圆物、冠、镜、刚物、大赤色、水寒。',
        '兑卦': '五行属金，方位为西方，人物为小女儿或少女。为1-15岁女性 泽、少女、巫、舌、妾、肺、羊、毁抓之物、带口之器、属金者、 废缺之物、奴仆婢。',
        '离卦': '五行属火，方位南方，人物为二女儿或中年女性。为16-30岁女性，也可以代表中层干部。 火、雉、日、目、电、霓、中女、甲胄、戈兵、文书、槁木、炉、鼍、龟、 蟹、蚌、凡有壳之物、 红赤紫色、花、文人、干燥物。',
        '震卦': '五行属木，方位为东方，人物为大儿子、军警人员。为31-45岁男性 雷、长男、足、发、龙、百虫、蹄、竹、萑苇、马鸣、母足、颡、稼、乐器之类、草木、青碧绿色、树、木核、柴、蛇。',
        '巽卦': '五行属木，方位东南，人物为大女儿或大儿媳妇。为31-45岁女性，在家中没有老年妇女的情况下也可以代表女主人。 风、长女、僧尼、鸡、股、百禽、百草、香气、臭、绳、眼、羽毛、帆、扇、枝叶之类、仙道、工匠、直物、工巧之器。',
        '坎卦': '五行属水，方位北方，人物为二儿子或中年男性。为16-30岁男性，也可以代表中层干部。 水、雨雪、工、猪、中男、沟渎、弓轮、耳、血、月、盗、宫律、栋、丛棘、狐、蒺藜、桎梏、水族、鱼、盐、酒醢、有核之物、黑色。',
        '艮卦': '五行属土，方位东北，人物为小儿子或少年男性。为1-15岁男性，也可以代表员工、小人。 山、土、少男、童子、狗、手、指、径路、门阙、菝阍、寺、鼠、虎、黔喙之属、木生之物、藤生之瓜、鼻。',
        '坤卦': '五行属土，方位为西南，人物为老年妇女或女主人。为46岁以上的女性 地、母、老妇、土、牛、釜、布帛、文章、舆、方物、柄、黄色、瓦器、腹、裳、黑色、黍稷、书、米、谷。'
};
    return baguaMeanings[baguaName] || '未知含义';
}

// 显示宫位详情
function showGongDetails(gongName) {
    const gongDetailsDiv = document.getElementById('gong-details');
    const gongInfoDiv = document.createElement('div');
    gongInfoDiv.innerHTML = `<h4 style="color: ${gongs.find(gong => gong.name === gongName).color};">${gongName}</h4><p>${gongDetails[gongName]}</p>`;
    gongInfoDiv.scrollIntoView({ behavior: 'smooth' });
    
    document.getElementById('gong-details').appendChild(gongInfoDiv);
}

// 六宫详细信息
const gongDetails = {
    '大安': '数字为1、7；4、5。干支方位归类为东方，以季节论属于春季，地支月份为寅卯辰月，天干为甲乙木。藏干为甲丁。十二宫为事业宫，同时也为命宫。事业宫主外为动态宫，命宫在内为静态宫。',
    '留连': '数字为2、8；7、8。干支方位归类为东南方，暗藏西南、东北、西北三角，以季节论为春夏，地支月份为辰巳月。藏干为丁己。田宅宫，同时也为奴仆宫。田宅宫表现在外，为置田购房，安家立业； 奴仆宫表现在内，为占有欲、支配欲，有阴暗、淫私之意。',
    '速喜': '数字为3、9；6、9。干支方位归类为南方，以季节论属于长夏，地支月份为巳午未月，天干为丙丁火。藏干为丙辛。感情宫，同时也为夫妻宫，或为婚姻宫。',
    '赤口': '数字为4、10；1、2。干支方位归类为西方，以季节论属于秋季，地支月份为申酉戍月，天干为庚辛金。藏干为庚癸。疾厄宫，同时也为兄弟宫。在这里，兄弟宫并不单指兄弟姐妹，同时还包括朋友和同事或合伙人，这些人与你为比劫关系，劫有伤害之意，对应疾厄宫之理，所以，疾厄宫暗藏兄弟宫，当然，兄弟宫并非完全只坏不好，只是在这里是指这些兄弟朋友给你带来的伤害。疾厄宫为动态宫，表示外在所影响或带来的疾病与灾祸；兄弟宫为静态宫，表示内在人际关系的处理。',
    '小吉': '数字为5、11；3、8。干支方位归类为北方，以季节论属于冬季，地支月份为亥子丑月，天干为壬癸水。藏干为壬甲。为驿马宫，同时也为子女宫。',
    '空亡': '数字为6、12；5、10。干支方位归类为中央，以季节论属于冬春，地支月份为丑寅月，天干为戊已土。藏干为戊乙。福德宫，同时也是父母宫。'
};

// 三宫具象计算函数
function calculateSanGongJuXiang(result) {
    const reordered = [result.tianGong, result.diGong, result.renGong];
    const yinYangPattern = reordered.map(gong => gong.yinYang).join('');
    const baguaInfo = bagua[yinYangPattern];

    const tianGongRelation = wuxingRelations[baguaInfo.element][result.tianGong.element];
    
    const tianPan = [
        calculateGong(result.tianGong, tianGongRelation),
        calculateGong(result.diGong, tianGongRelation),
        calculateGong(result.renGong, tianGongRelation)
    ];

    // 计算地盘
    const diPanBaguaInfo = calculateBagua([result.tianGong, result.diGong, result.renGong]);
    const diGongRelation = wuxingRelations[diPanBaguaInfo.element][result.diGong.element];
    const diPan = [
        calculateGong(result.tianGong, diGongRelation),
        calculateGong(result.diGong, diGongRelation),
        calculateGong(result.renGong, diGongRelation)
    ];

    // 计算人盘
    const renPanBaguaInfo = calculateBagua([result.tianGong, result.renGong, result.diGong]);
    const renGongRelation = wuxingRelations[renPanBaguaInfo.element][result.renGong.element];
    const renPan = [
        calculateGong(result.tianGong, renGongRelation),
        calculateGong(result.renGong, renGongRelation),
        calculateGong(result.diGong, renGongRelation)
    ];

    return {tianPan, diPan, renPan, baguaInfo, tianGongRelation, diGongRelation, renGongRelation};
}

function calculateBagua(gongs) {
    const yinYangPattern = gongs.map(gong => gong.yinYang).join('');
    return bagua[yinYangPattern];
}

function calculateGong(originalGong, relation) {
    const relationMap = {
        '被克': '克出',
        '克出': '被克',
        '被生': '生出',
        '生出': '被生',
        '同': '同'
    };

    const targetRelation = relationMap[relation];
    const targetGongs = gongs.filter(gong => 
        wuxingRelations[originalGong.element][gong.element] === targetRelation
    );

    if (targetGongs.length === 1) {
        return targetGongs[0];
    } else {
        return targetGongs;
    }
}

function showSanGongJuXiang(result) {
    const {tianPan, diPan, renPan, baguaInfo, tianGongRelation, diGongRelation, renGongRelation} = calculateSanGongJuXiang(result);
    const container = document.getElementById('san-gong-ju-xiang');
    container.style.display = 'block';

    showPan('tian-pan', tianPan, '天盘', baguaInfo, tianGongRelation);
    showPan('di-pan', diPan, '地盘', calculateBagua([result.tianGong, result.diGong, result.renGong]), diGongRelation);
    showPan('ren-pan', renPan, '人盘', calculateBagua([result.tianGong, result.renGong, result.diGong]), renGongRelation);
}

function showPan(elementId, pan, panName, baguaInfo, relation) {
    const panElement = document.getElementById(elementId);
    panElement.innerHTML = '';
    pan.forEach((gong, index) => {
        const gongElement = document.createElement('div');
        gongElement.className = 'ju-xiang-gong';
        if (Array.isArray(gong)) {
            gongElement.textContent = gong.map(g => g.name).join('/');
            gongElement.style.backgroundColor = gong[0].color;
        } else {
            gongElement.textContent = gong.name;
            gongElement.style.backgroundColor = gong.color;
        }
        gongElement.style.color = gong.color === 'gold' ? 'black' : 'white';
        gongElement.addEventListener('click', () => showGongDetails(Array.isArray(gong) ? gong[0].name : gong.name));
        panElement.appendChild(gongElement);
    });

    const baguaInfoElement = document.createElement('div');
    baguaInfoElement.innerHTML = `<p>${panName}八卦：${baguaInfo.symbol} ${baguaInfo.name}（${baguaInfo.element}）</p>
                             <p>与${panName === '天盘' ? '天' : panName === '地盘' ? '地' : '人'}宫关系：${relation}</p>`;
    panElement.appendChild(baguaInfoElement);
}

// 事件监听器和初始化函数

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
    if (hour % 2 === 1 && minute >= // ... (接上一部分)

    0 && minute <= 14) {
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
    document.getElementById('san-gong-ju-xiang').style.display = 'none';
});

// 深色模式切换
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// 初始化
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
    document.getElementById('san-gong-ju-xiang').style.display = 'none';
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

// 新增：处理导航按钮点击事件
document.getElementById('announcement-btn').addEventListener('click', function() {
    document.getElementById('announcement-modal').style.display = 'block';
});

document.getElementById('learn-btn').addEventListener('click', function() {
    // 在新标签页打开学习页面
    window.open('https://wangcy.cam/cd72ba646fea4e0fb3824581c88a023e', '_blank');
});

document.getElementById('donate-btn').addEventListener('click', function() {
    // 在新标签页打开打赏页面
    window.open('https://donate.wangcy.site/', '_blank');
});

// 新增：处理模态框关闭
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('announcement-modal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('announcement-modal')) {
        document.getElementById('announcement-modal').style.display = 'none';
    }
});
