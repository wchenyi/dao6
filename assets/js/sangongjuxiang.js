// 三宫具象计算函数
function calculateSanGongJuXiang(result) {
    const tianPan = calculateTianPan(result);
    const diPan = calculateDiPan(result);
    const renPan = calculateRenPan(result);

    return { tianPan, diPan, renPan };
}

function calculateTianPan(result) {
    const reordered = [result.renGong, result.tianGong, result.diGong];
    const yinYangPattern = reordered.map(gong => gong.yinYang).join('');
    const baguaInfo = bagua[yinYangPattern];

    const relationWithTianGong = getRelation(baguaInfo.element, result.tianGong.element);
    
    const pan = [
        calculateGong(result.tianGong, relationWithTianGong),
        calculateGong(result.diGong, relationWithTianGong),
        calculateGong(result.renGong, relationWithTianGong)
    ];

    return { pan, baguaInfo, relationWithTianGong };
}

function calculateDiPan(result) {
    const yinYangPattern = [result.tianGong, result.diGong, result.renGong].map(gong => gong.yinYang).join('');
    const baguaInfo = bagua[yinYangPattern];

    const relationWithDiGong = getRelation(baguaInfo.element, result.diGong.element);
    
    const pan = [
        calculateGongWithYinYang(result.tianGong, relationWithDiGong, baguaInfo.yinYang !== result.tianGong.yinYang),
        result.diGong,
        calculateGongWithYinYang(result.renGong, relationWithDiGong, baguaInfo.yinYang !== result.renGong.yinYang)
    ];

    return { pan, baguaInfo, relationWithDiGong };
}

function calculateRenPan(result) {
    const yinYangPattern = [result.tianGong, result.renGong, result.diGong].map(gong => gong.yinYang).join('');
    const baguaInfo = bagua[yinYangPattern];

    const relationWithRenGong = getRelation(baguaInfo.element, result.renGong.element);
    
    const pan = [
        calculateGongWithYinYang(result.tianGong, relationWithRenGong, baguaInfo.yinYang !== result.tianGong.yinYang),
        calculateGongWithYinYang(result.diGong, relationWithRenGong, baguaInfo.yinYang !== result.diGong.yinYang),
        result.renGong
    ];

    return { pan, baguaInfo, relationWithRenGong };
}

function calculateGong(originalGong, relation) {
    const targetGongs = gongs.filter(gong => 
        getRelation(gong.element, originalGong.element) === relation
    );

    return targetGongs.length === 1 ? targetGongs[0] : targetGongs;
}

function calculateGongWithYinYang(originalGong, relation, shouldChangeYinYang) {
    const targetGongs = gongs.filter(gong => 
        getRelation(gong.element, originalGong.element) === relation &&
        (shouldChangeYinYang ? gong.yinYang !== originalGong.yinYang : gong.yinYang === originalGong.yinYang)
    );

    return targetGongs.length === 1 ? targetGongs[0] : targetGongs;
}

function getRelation(element1, element2) {
    if (element1 === element2) return '同';
    return wuxingRelations[element1][element2];
}

function showSanGongJuXiang(result) {
    const { tianPan, diPan, renPan } = calculateSanGongJuXiang(result);
    const container = document.getElementById('san-gong-ju-xiang');
    container.style.display = 'block';
    container.innerHTML = ''; // Clear previous content

    const panNames = ['天盘', '地盘', '人盘'];
    const pans = [tianPan, diPan, renPan];

    pans.forEach((pan, index) => {
        const panElement = document.createElement('div');
        panElement.className = 'ju-xiang-pan';
        
        const panNameElement = document.createElement('div');
        panNameElement.className = 'ju-xiang-pan-name';
        panNameElement.textContent = panNames[index];
        panElement.appendChild(panNameElement);

        const gongContainer = document.createElement('div');
        gongContainer.className = 'ju-xiang-gong-container';

        pan.pan.forEach((gong, gongIndex) => {
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
            gongContainer.appendChild(gongElement);
        });

        panElement.appendChild(gongContainer);

        const baguaInfoElement = document.createElement('div');
        baguaInfoElement.className = 'ju-xiang-bagua-info';
        baguaInfoElement.innerHTML = `
            <p>八卦：${pan.baguaInfo.symbol} ${pan.baguaInfo.name}（${pan.baguaInfo.element}）</p>
            <p>关系：${pan.relationWithTianGong || pan.relationWithDiGong || pan.relationWithRenGong}</p>
        `;
        panElement.appendChild(baguaInfoElement);

        container.appendChild(panElement);
    });
}