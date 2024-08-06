// lunarCalendar.js

// 农历1900-2100的润大小信息表
const lunarInfo = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
    0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
    0x0d520
];

// 天干
const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 月份
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
// 日期
const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                   '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                   '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

// 将公历日期转换为农历日期
function solarToLunar(year, month, day) {
    if (year < 1900 || year > 2100) {
        return { error: "年份超出范围（1900-2100）" };
    }

    const baseDate = new Date(1900, 0, 31);
    const objDate = new Date(year, month - 1, day);
    let offset = Math.floor((objDate - baseDate) / 86400000);

    let i, leap = 0, temp = 0;
    for (i = 1900; i < 2101 && offset > 0; i++) {
        temp = lYearDays(i);
        offset -= temp;
    }

    if (offset < 0) {
        offset += temp;
        i--;
    }

    const lunarYear = i;
    leap = leapMonth(i);
    let isLeap = false;

    for (i = 1; i < 13 && offset > 0; i++) {
        if (leap > 0 && i === (leap + 1) && isLeap === false) {
            --i;
            isLeap = true;
            temp = leapDays(lunarYear);
        } else {
            temp = monthDays(lunarYear, i);
        }

        if (isLeap === true && i === (leap + 1)) isLeap = false;
        offset -= temp;
    }

    if (offset === 0 && leap > 0 && i === leap + 1) {
        if (isLeap) {
            isLeap = false;
        } else {
            isLeap = true;
            --i;
        }
    }

    if (offset < 0) {
        offset += temp;
        --i;
    }

    const lunarMonth = i;
    const lunarDay = offset + 1;

    // 确保年份正确，特别是在农历年交接的时候
    const adjustedLunarYear = (month === 1 && day < 20) ? lunarYear - 1 : lunarYear;
    
    const ganZhiYear = getGanZhiYear(adjustedLunarYear);
    const ganZhiMonth = getGanZhiMonth(adjustedLunarYear, lunarMonth);
    const ganZhiDay = getGanZhiDay(year, month, day);

    return {
        lYear: adjustedLunarYear,
        lMonth: lunarMonth,
        lDay: lunarDay,
        animal: getAnimal(adjustedLunarYear),
        yearGanZhi: ganZhiYear,
        monthGanZhi: ganZhiMonth,
        dayGanZhi: ganZhiDay,
        isLeap: isLeap,
        lMonthChinese: (isLeap ? "闰" : "") + lunarMonths[lunarMonth - 1] + "月",
        lDayChinese: lunarDays[lunarDay - 1]
    };
}

// 计算农历年天数
function lYearDays(year) {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
    return (sum + leapDays(year));
}

// 计算农历年闰月天数
function leapDays(year) {
    if (leapMonth(year)) return ((lunarInfo[year - 1900] & 0x10000) ? 30 : 29);
    else return (0);
}

// 计算农历年闰哪个月 1-12 , 没闰返回 0
function leapMonth(year) {
    return (lunarInfo[year - 1900] & 0xf);
}

// 计算农历年月天数
function monthDays(year, month) {
    return ((lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29);
}

// 获取生肖
function getAnimal(year) {
    return animals[(year - 4) % 12];
}

// 获取天干地支年
function getGanZhiYear(year) {
    const gan = (year - 4) % 10;
    const zhi = (year - 4) % 12;
    return tianGan[gan] + diZhi[zhi];
}

// 获取天干地支月
function getGanZhiMonth(year, month) {
    const gan = (year * 2 - 1900 + month) % 10;
    const zhi = (month + 1) % 12;
    return tianGan[gan] + diZhi[zhi];
}

// 获取天干地支日
function getGanZhiDay(year, month, day) {
    const baseDate = new Date(1900, 0, 31);
    const objDate = new Date(year, month - 1, day);
    let offset = Math.floor((objDate - baseDate) / 86400000);
    return tianGan[offset % 10] + diZhi[offset % 12];
}

// 获取时辰
function getShichen(hour) {
    const shichens = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return shichens[Math.floor((hour + 1) % 24 / 2)];
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solarToLunar: solarToLunar,
        getShichen: getShichen
    };
}