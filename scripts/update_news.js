const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'data', 'companies.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newItems = [
  {
    companyId: 'googl',
    entry: {
      title: '谷歌搜索全面切换至 Gemini 3.5 Flash，终结"蓝色链接"25 年历史',
      date: '2026-07-10',
      category: '产品',
      summary: '谷歌将 Search 全面切换至 Gemini 3.5 Flash 驱动，以 AI 生成摘要和智能体交互取代传统"十条蓝色链接"；对话式 AI Mode 月活用户突破 10 亿，查询量连续多季翻倍，为 Search 25 年来最大变革。',
      url: 'https://tech.yahoo.com/ai/gemini/articles/google-ends-10-blue-links-112000624.html',
    },
  },
  {
    companyId: 'samsung',
    entry: {
      title: '三星李在镕赴美拟月底会见黄仁勋，深化英伟达 AI 芯片供应链合作',
      date: '2026-07-09',
      category: '业务',
      summary: '据报道，三星集团会长李在镕计划赴美硅谷，与英伟达 CEO 黄仁勋会面，讨论 HBM4 认证进展及 AI 芯片供应链扩大合作；消息带动三星股价单日涨逾 5%。',
      url: 'https://www.investing.com/news/stock-market-news/samsungs-lee-seeks-to-meet-nvidias-huang-by-endjuly-report-4785205',
    },
  },
];

let changed = false;

for (const { companyId, entry } of newItems) {
  const company = data[companyId];
  if (!company) { console.error('Company not found:', companyId); continue; }

  const titleKey = entry.title.replace(/\s+/g, '');
  const isDuplicate = (company.news || []).some(n => {
    const existingKey = n.title.replace(/\s+/g, '');
    return existingKey === titleKey;
  });

  if (isDuplicate) {
    console.log(`SKIP (duplicate): [${companyId}] ${entry.title}`);
    continue;
  }

  company.news = [entry, ...(company.news || [])];
  company.news.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
  company.news = company.news.slice(0, 4);
  changed = true;
  console.log(`ADDED: [${companyId}] ${entry.title}`);
}

if (changed) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Written successfully.');
} else {
  console.log('No changes made.');
}
