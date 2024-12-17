// script.js
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const announcementBtn = document.getElementById('announcement-btn');
const announcementModal = document.getElementById('announcement-modal');
const learnBtn = document.getElementById('learn-btn');
const donateBtn = document.getElementById('donate-btn');
const closeBtn = document.querySelector('.close');

// 获取时间元素
const currentTimeDisplay = document.getElementById('current-time');
const lunarTimeDisplay = document.getElementById('lunar-time');

// 获取起卦方式按钮
const timeDivinationButton = document.getElementById('time-divination');
const numberDivinationButton = document.getElementById('number-divination');
const customDivinationButton = document.getElementById('custom-divination');

// 获取时间起卦选项
const timeDivinationOptions = document.getElementById('time-divination-options');
const monthDayHourButton = document.getElementById('month-day-hour');
const hourKeMinuteButton = document.getElementById('hour-ke-minute');

// 获取数字起卦选项
const numberInput = document.getElementById('number-input');
const randomNumberButton = document.getElementById('random-number');
const customNumberButton = document.getElementById('custom-number');

// 获取自选数字输入框
const customNumberInput = document.getElementById('custom-number-input');
const customNumberSubmit = document.getElementById('custom-number-submit');
const customNumberInputs = document.querySelectorAll('#custom-number-input input[type="number"]');

// 获取自选六神输入框
const customGongInput = document.getElementById('custom-gong-input');
const customGongSubmit = document.getElementById('custom-gong-submit');
const customGongInputs = document.querySelectorAll('#custom-gong-input input[type="text"]');

// 获取显示结果的元素
const resultDiv = document.getElementById('result');
const tianGongDisplay = document.getElementById('tian-gong');
const diGongDisplay = document.getElementById('di-gong');
const renGongDisplay = document.getElementById('ren-gong');
const shiChenDisplay = document.getElementById('shi-chen');
const relationsDisplay = document.getElementById('relations');
const fortuneDisplay = document.getElementById('fortune');
const divinationMethodDisplay = document.getElementById('divination-method');
const usedNumbersDisplay = document.getElementById('used-numbers');
const restartButton = document.getElementById('restart');

// 宫位详情
const gongDetailsDiv = document.getElementById('gong-details');
// 八卦具象
const baguaResultDiv = document.getElementById('bagua-result');
const baguaInfoDisplay = document.getElementById('bagua-info');
// 六神含义
const gongMeaningsDiv = document.getElementById('gong-meanings');
// 三宫具象
const sanGongJuXiangDiv = document.getElementById('san-gong-ju-xiang');
// 六神列表和颜色
const gongs = [
    { name: '大安', value: 1, element: '木', yinYang: '阳', color: 'green' },
    { name: '留连', value: 2, element: '土', yinYang: '阴', color: 'brown' },
    { name: '速喜', value: 3, element: '火', yinYang: '阳', color: 'red' },
    { name: '赤口', value: 4, element: '金', yinYang: '阴', color: 'gold' },
    { name: '小吉', value: 5, element: '水', yinYang: '阳', color: 'blue' },
    { name: '空亡', value: 6, element: '土', yinYang: '阴', color: 'brown' }
];
// 六神含义
const gongMeanings = {
    '大安': '数字为1、7；4、5。干支方位归类为东方，以季节论属于春季，地支月份为寅卯辰月，天干为甲乙木。藏干为甲丁。十二宫为事业宫，同时也为命宫。事业宫主外为动态宫，命宫在内为静态宫。',
    '留连': '数字为2、8；7、8。干支方位归类为东南方，暗藏西南、东北、西北三角，以季节论为春夏，地支月份为辰巳月。藏干为丁己。田宅宫，同时也为奴仆宫。田宅宫表现在外，为置田购房，安家立业； 奴仆宫表现在内，为占有欲、支配欲，有阴暗、淫私之意。',
    '速喜': '数字为3、9；6、9。干支方位归类为南方，以季节论属于长夏，地支月份为巳午未月，天干为丙丁火。藏干为丙辛。感情宫，同时也为夫妻宫，或为婚姻宫。',
    '赤口': '数字为4、10；1、2。干支方位归类为西方，以季节论属于秋季，地支月份为申酉戍月，天干为庚辛金。藏干为庚癸。疾厄宫，同时也为兄弟宫。在这里，兄弟宫并不单指兄弟姐妹，同时还包括朋友和同事或合伙人，这些人与你为比劫关系，劫有伤害之意，对应疾厄宫之理，所以，疾厄宫暗藏兄弟宫，当然，兄弟宫并非完全只坏不好，只是在这里是指这些兄弟朋友给你带来的伤害。疾厄宫为动态宫，表示外在所影响或带来的疾病与灾祸；兄弟宫为静态宫，表示内在人际关系的处理。',
    '小吉': '数字为5、11；3、8。干支方位归类为北方，以季节论属于冬季，地支月份为亥子丑月，天干为壬癸水。藏干为壬甲。为驿马宫，同时也为子女宫。',
    '空亡': '数字为6、12；5、10。干支方位归类为中央，以季节论属于冬春，地支月份为丑寅月，天干为戊已土。藏干为戊乙。福德宫，同时也是父母宫。'
};
// 五行生克关系
const wuxingRelations = {
    '金': { '木': '克出', '火': '被克', '土': '生出', '水': '生出', '金': '同'},
    '木': { '土': '克出', '金': '被克', '水': '生出', '火': '生出', '木': '同'},
    '水': { '火': '克出', '土': '被克', '金': '生出', '木': '生出', '水': '同'},
    '火': { '金': '克出', '水': '被克', '木': '生出', '土': '生出', '火': '同'},
    '土': { '水': '克出', '木': '被克', '火': '生出', '金': '生出', '土': '同'}
};
// 八卦信息
const bagua = {
  '阳阳阳': {symbol: '☰', name: '乾卦', element: '金', yinYang: '阳'},
  '阳阳阴': {symbol: '☱', name: '兑卦', element: '金', yinYang: '阴'},
  '阳阴阳': {symbol: '☲', name: '离卦', element: '火', yinYang: '阳'},
  '阳阴阴': {symbol: '☳', name: '震卦', element: '木', yinYang: '阳'},
  '阴阳阳': {symbol: '☴', name: '巽卦', element: '木', yinYang: '阳'},
  '阴阳阴': {symbol: '☵', name: '坎卦', element: '水', yinYang: '阳'},
  '阴阴阳': {symbol: '☶', name: '艮卦', element: '土', yinYang: '阴'},
  '阴阴阴': {symbol: '☷', name: '坤卦', element: '土', yinYang: '阳'}
}
// 时辰信息
const shichens = {
    '子': { value: 1, element: '水', yinYang: '阳', color: 'blue' },
    '丑': { value: 2, element: '土', yinYang: '阴', color: 'brown' },
    '寅': { value: 3, element: '木', yinYang: '阳', color: 'green' },
    '卯': { value: 4, element: '木', yinYang: '阴', color: 'green' },
    '辰': { value: 5, element: '土', yinYang: '阳', color: 'brown' },
    '巳': { value: 6, element: '火', yinYang: '阴', color: 'red' },
    '午': { value: 7, element: '火', yinYang: '阳', color: 'red' },
    '未': { value: 8, element: '土', yinYang: '阴', color: 'brown' },
    '申': { value: 9, element: '金', yinYang: '阳', color: 'gold' },
    '酉': { value: 10, element: '金', yinYang: '阴', color: 'gold' },
    '戌': { value: 11, element: '土', yinYang: '阳', color: 'brown' },
    '亥': { value: 12, element: '水', yinYang: '阴', color: 'blue' }
};


// 更新时间
function updateTime() {
    const  now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const lunarDate = solarToLunar(now.getFullYear(), now.getMonth() + 1, now.getDate());
     const shichen = getShichen(now.getHours());

    currentTimeDisplay.textContent = `北京时间: ${hours}:${minutes}:${seconds}`;
    lunarTimeDisplay.textContent = `农历: ${lunarDate.lYear}年${lunarDate.lMonthChinese}${lunarDate.lDayChinese}  ${shichen}时`;
}
// 初始化更新时间
updateTime();
setInterval(updateTime, 1000);

// 切换主题模式
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
     themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
// 公告弹窗逻辑
announcementBtn.addEventListener('click', () => {
    announcementModal.style.display = "block";
});

closeBtn.addEventListener('click', () => {
  announcementModal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target === announcementModal) {
        announcementModal.style.display = "none";
    }
});
// 学习和打赏跳转
learnBtn.addEventListener('click', () => {
   window.location.href = 'https://wangcy.cam/cd72ba646fea4e0fb3824581c88a023e'; // 替换为你的学习链接
});

donateBtn.addEventListener('click', () => {
    window.location.href = 'https://donate.wangcy.site/'; // 替换为你的打赏链接
});

// 起卦方式按钮事件监听器
timeDivinationButton.addEventListener('click', () => {
    hideAllOptions();
    timeDivinationOptions.style.display = 'flex';
});

numberDivinationButton.addEventListener('click', () => {
    hideAllOptions();
    numberInput.style.display = 'flex';
});
customDivinationButton.addEventListener('click', () => {
    hideAllOptions();
    customGongInput.style.display = 'flex';
});

// 时间起卦选项事件监听器
monthDayHourButton.addEventListener('click', () => {
    calculateDivination('month-day-hour');
});
hourKeMinuteButton.addEventListener('click', () => {
   calculateDivination('hour-ke-minute');
});

// 数字起卦选项事件监听器
randomNumberButton.addEventListener('click', () => {
    calculateDivination('random-number');
});
customNumberButton.addEventListener('click', () => {
    hideAllOptions();
    customNumberInput.style.display = 'flex';
});
customNumberSubmit.addEventListener('click', () => {
    calculateDivination('custom-number');
});
customGongSubmit.addEventListener('click', () => {
    calculateDivination('custom-gong');
});

// 重新起卦
restartButton.addEventListener('click', () => {
    hideAllOptions();
    resultDiv.style.display = 'none';
    restartButton.style.display = 'none';
    gongDetailsDiv.style.display = 'none';
     sanGongJuXiangDiv.style.display = 'none';
     baguaResultDiv.style.display = 'none';
      gongMeaningsDiv.style.display = 'none';
});
// 隐藏所有起卦选项
function hideAllOptions() {
    timeDivinationOptions.style.display = 'none';
    numberInput.style.display = 'none';
    customNumberInput.style.display = 'none';
     customGongInput.style.display = 'none';
}

// 根据起卦方式计算
function calculateDivination(method) {
    let tianGong, diGong, renGong, usedNumbers = [];
    let now = new Date(); // 获取当前时间
    let lunarInfo;
    switch (method) {
        case 'month-day-hour':
          lunarInfo = solarToLunar(now.getFullYear(), now.getMonth() + 1, now.getDate());
            let month = lunarInfo.lMonth;
            let day = lunarInfo.lDay;
            let hour = shichens[getShichen(now.getHours())].value;
             usedNumbers = [month, day, hour];
            tianGong = getGong(month);
            diGong = getGong(month-1+day);
            renGong = getGong(getGong(month-1+day).value -1 + hour);
            break;
        case 'hour-ke-minute':
           let hourValue = shichens[getShichen(now.getHours())].value;
            let minute = now.getMinutes();
            let ke = calculateKe(now);
             let fen = (minute % 15) === 0 ? 1 : (minute % 15);
            usedNumbers = [hourValue, ke, fen]
            tianGong = getGong(hourValue);
           diGong = getGong(hourValue - 1 + ke);
           renGong = getGong(getGong(hourValue - 1 + ke).value - 1 + fen);
           break;
       case 'random-number':
             let num1 = Math.floor(Math.random() * 100) + 1;
            let num2 = Math.floor(Math.random() * 100) + 1;
            let num3 = Math.floor(Math.random() * 100) + 1;
             usedNumbers = [num1, num2, num3];
            tianGong = getGong(num1);
            diGong = getGong(num1 - 1 + num2);
            renGong = getGong(getGong(num1 - 1 + num2).value - 1 + num3);
            break;
        case 'custom-number':
              let customNum1 = parseInt(customNumberInputs[0].value, 10) || 1;
                let customNum2 = parseInt(customNumberInputs[1].value, 10) || 1;
                let customNum3 = parseInt(customNumberInputs[2].value, 10) || 1;
            usedNumbers = [customNum1, customNum2, customNum3];
            tianGong = getGong(customNum1);
            diGong = getGong(customNum1 - 1 + customNum2);
            renGong = getGong(getGong(customNum1 - 1 + customNum2).value - 1 + customNum3);
            break;
          case 'custom-gong':
              const customTianGong = customGongInputs[0].value;
              const customDiGong = customGongInputs[1].value;
              const customRenGong = customGongInputs[2].value;

             const foundTianGong = gongs.find(gong => gong.name === customTianGong);
             const foundDiGong = gongs.find(gong => gong.name === customDiGong);
             const foundRenGong = gongs.find(gong => gong.name === customRenGong);
               if (!foundTianGong || !foundDiGong || !foundRenGong) {
                 alert('输入错误，无法起卦');
                    return;
               }
                tianGong = foundTianGong;
                diGong = foundDiGong;
                renGong = foundRenGong;
            break;
           default:
            return;
    }
   
    showResult(tianGong, diGong, renGong, method, usedNumbers, now);
}

// 获取对应的宫位
function getGong(number) {
    const index = (number > 6 ? (number % 6 === 0 ? 6 : number % 6) : number) - 1;
    return gongs[index];
}
// 计算刻数
function calculateKe(now) {
    let minute = now.getMinutes();
     let hour = now.getHours();
      if (hour % 2 === 0) {
        return Math.floor(minute / 15) === 0 ? 1 : Math.floor(minute / 15) + 4 ;
    } else {
          return  Math.floor(minute / 15)  === 0 ? 1 : Math.floor(minute / 15)
    }
}
// 显示结果
function showResult(tianGong, diGong, renGong, method, usedNumbers, now) {
   const shichen = getShichen(now.getHours());
   const shichenInfo = shichens[shichen];
   tianGongDisplay.textContent = tianGong.name;
    tianGongDisplay.style.backgroundColor = tianGong.color;
    tianGongDisplay.style.color = tianGong.color === 'gold' ? 'black' : 'white';

    diGongDisplay.textContent = diGong.name;
    diGongDisplay.style.backgroundColor = diGong.color;
    diGongDisplay.style.color = diGong.color === 'gold' ? 'black' : 'white';

    renGongDisplay.textContent = renGong.name;
    renGongDisplay.style.backgroundColor = renGong.color;
    renGongDisplay.style.color = renGong.color === 'gold' ? 'black' : 'white';

     shiChenDisplay.textContent = shichen;
    shiChenDisplay.style.color = shichenInfo.color;
    shiChenDisplay.style.backgroundColor = shichenInfo.color === 'gold' ? 'white' : 'transparent';

    let relationsText = generateRelationsText(tianGong, diGong, renGong, shichen);
    relationsDisplay.innerHTML = relationsText;

   fortuneDisplay.textContent = generateFortuneText(renGong);
    divinationMethodDisplay.textContent = `起卦方式: ${method}`;
     if (usedNumbers && usedNumbers.length > 0) {
        usedNumbersDisplay.textContent = `使用的数字: ${usedNumbers.join(', ')}`;
    } else {
         usedNumbersDisplay.textContent = '';
    }

     resultDiv.style.display = 'block';
    restartButton.style.display = 'block';
    
     showBaguaJuXiang(renGong, diGong, tianGong);
     showGongMeanings(tianGong, diGong, renGong);
      showSanGongJuXiang({tianGong, diGong, renGong});

      // 为每个宫位添加点击事件
    tianGongDisplay.addEventListener('click', () => showGongDetails(tianGong.name));
    diGongDisplay.addEventListener('click', () => showGongDetails(diGong.name));
    renGongDisplay.addEventListener('click', () => showGongDetails(renGong.name));

}
// 生成关系文本
function generateRelationsText(tianGong, diGong, renGong, shichen) {
    const tianDiRelation = getRelation(tianGong.element, diGong.element);
     const tianRenRelation = getRelation(tianGong.element, renGong.element);
    const diRenRelation = getRelation(diGong.element, renGong.element);
    const tiYongRelation = getTiYongRelation(renGong, shichens[shichen]);
    return `天地关系：${tianDiRelation}<br>
            天人关系：${tianRenRelation}<br>
            地人关系：${diRenRelation}<br>
            体用关系：${tiYongRelation}`;
}
// 获取五行关系
function getRelation(element1, element2) {
   if (element1 === element2) return '同';
    return wuxingRelations[element1][element2];
}
// 获取体用关系
function getTiYongRelation(renGong, shichenInfo) {
  if (renGong.element === shichenInfo.element){
     return  renGong.yinYang === shichenInfo.yinYang ? '比肩' : '比助'
  } else {
    const relation = getRelation(renGong.element, shichenInfo.element)
      if (relation === '生出') {
        return '生出'
      } else if (relation === '被生'){
        return '被生'
      } else if (relation === '克出'){
        return '克出'
      }else {
          return '被克'
      }
   }
}
// 生成吉凶文本
function generateFortuneText(renGong) {
    let fortune = '';
   switch (renGong.name) {
       case '大安':
            fortune = '单以人宫看吉凶：大吉';
            break;
        case '速喜':
           fortune = '单以人宫看吉凶：中吉';
            break;
        case '小吉':
            fortune = '单以人宫看吉凶：小吉';
           break;
       case '留连':
            fortune = '单以人宫看吉凶：小凶（如果是晚上测就是有变数）';
            break;
        case '赤口':
            fortune = '单以人宫看吉凶：中凶';
            break;
        case '空亡':
            fortune = '单以人宫看吉凶：大凶（也可能是什么事情都没有）';
            break;
        default:
           fortune = '';
    }
   return fortune;
}
function showGongDetails(gongName) {
    const gong = gongs.find(g => g.name === gongName);
        if (gong) {
        gongDetailsDiv.innerHTML = `<h3>${gong.name} 宫位详情</h3>
        <div>五行：${gong.element}</div>
        <div>阴阳：${gong.yinYang}</div>
    `;
            gongDetailsDiv.style.display = 'flex';
        } else {
            gongDetailsDiv.style.display = 'none';
        }
}
// 八卦具象
function showBaguaJuXiang(tianGong, diGong, renGong) {
  const yinYangPattern = [tianGong, diGong, renGong].map(gong => gong.yinYang).join('');
  const baguaInfo = bagua[yinYangPattern];

    baguaInfoDisplay.innerHTML = `
          <p style="color: ${getColorByElement(baguaInfo.element)};">${baguaInfo.symbol}：${baguaInfo.name}【${baguaInfo.yinYang}-${baguaInfo.element}】</p>
         <p>${getBaguaDescription(baguaInfo.symbol)}</p>
    `;
   baguaResultDiv.style.display = 'block';
}

// 根据五行获取颜色
function getColorByElement(element) {
    switch (element) {
        case '金': return 'gold';
        case '木': return 'green';
        case '水': return 'blue';
        case '火': return 'red';
        case '土': return 'brown';
        default: return '#333';
    }
}
// 八卦描述信息
function getBaguaDescription(symbol) {
    switch (symbol) {
        case '☰': return '五行属金，方位为西北，人物为老年男性或当官的。为46岁以上男性 天、父、老人、官贵、头、骨、马、金、宝珠、玉、木果、圆物、冠、镜、刚物、大赤色、水寒。';
        case '☱': return '五行属金，方位为西方，人物为小女儿或少女。为1-15岁女性 泽、少女、巫、舌、妾、肺、羊、毁抓之物、带口之器、属金者、 废缺之物、奴仆婢。';
        case '☲': return '五行属火，方位南方，人物为二女儿或中年女性。为16-30岁女性，也可以代表中层干部。 火、雉、日、目、电、霓、中女、甲胄、戈兵、文书、槁木、炉、鼍、龟、 蟹、蚌、凡有壳之物、 红赤紫色、花、文人、干燥物。';
        case '☳': return '五行属木，方位为东方，人物为大儿子、军警人员。为31-45岁男性 雷、长男、足、发、龙、百虫、蹄、竹、萑苇、马鸣、母足、颡、稼、乐器之类、草木、青碧绿色、 树、木核、柴、蛇。';
         case '☴': return '五行属木，方位东南，人物为大女儿或大儿媳妇。为31-45岁女性，在家中没有老年妇女的情况下也可以代表女主人。 风、长女、僧尼、鸡、股、百禽、百草、香气、臭、绳、眼、羽毛、帆、扇、枝叶之类、仙道、工 匠、直物、工巧之器。';
        case '☵': return '五行属水，方位北方，人物为二儿子或中年男性。为16-30岁男性，也可以代表中层干部。 水、雨雪、工、猪、中男、沟渎、弓轮、耳、血、月、盗、宫律、栋、丛棘、狐、蒺藜、桎梏、水 族、鱼、盐、酒醢、有核之物、黑色。';
       case '☶': return '五行属土，方位东北，人物为小儿子或少年男性。为1-15岁男性，也可以代表员工、小人。 山、土、少男、童子、狗、手、指、径路、门阙、菝阍、寺、鼠、虎、黔喙之属、木生之物、藤生 之瓜、鼻。';
        case '☷': return '五行属土，方位为西南，人物为老年妇女或女主人。为46岁以上的女性 地、母、老妇、土、牛、釜、布帛、文章、舆、方物、柄、黄色、瓦器、腹、裳、黑色、黍稷、书、 米、谷。';
        default: return '';
    }
}
function showGongMeanings(tianGong, diGong, renGong) {
        let tianGongMeaning = gongMeanings[tianGong.name];
          let diGongMeaning = gongMeanings[diGong.name];
          let renGongMeaning = gongMeanings[renGong.name];
           gongMeaningsDiv.innerHTML = `<h3>天宫含义：</h3><p>${tianGongMeaning}</p><h3>地宫含义：</h3><p>${diGongMeaning}</p><h3>人宫含义：</h3><p>${renGongMeaning}</p>`;
     gongMeaningsDiv.style.display = 'block';
}
