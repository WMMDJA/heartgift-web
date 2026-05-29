const isEnglish = document.documentElement.lang?.toLowerCase().startsWith("en");
const STORAGE_KEY = isEnglish ? "heartgift-web-relationships-en" : "heartgift-web-relationships";

const copy = isEnglish
  ? {
      sample: [
        {
          id: "mom",
          name: "Mom",
          role: "Mother",
          budget: "Mid-range",
          likes: "flowers, skincare, practical gifts, walks",
          avoid: "too sweet, bulky items",
        },
        {
          id: "partner",
          name: "Partner",
          role: "Partner",
          budget: "Mid-range",
          likes: "scent, photos, handwritten notes, weekend dates",
          avoid: "last-minute gifts, generic picks",
        },
        {
          id: "dad",
          name: "Dad",
          role: "Father",
          budget: "Low budget",
          likes: "tea, massage, useful tools, wellness",
          avoid: "flashy items, decorations he will not use",
        },
      ],
      budget: {
        low: "Low budget",
        mid: "Mid-range",
        high: "Premium",
      },
      upcoming: "Upcoming",
      daysAway: (days) => `${days} ${days === 1 ? "day" : "days"} away`,
      eventTitle: (name) => `${name}'s birthday is coming up`,
      eventNote: (person) =>
        `Plan a ${person.budget.toLowerCase()} gift: avoid ${person.avoid || "uncertain choices"} and focus on what they truly care about.`,
      ideasLabel: "Based on interests",
      copied: "Copied",
      copy: "Copy",
      defaultLikes: "practical, quality time, comfort",
      defaultAvoid: "gifts that feel rushed",
    }
  : {
      sample: [
        {
          id: "mom",
          name: "妈妈",
          role: "母亲",
          budget: "中等预算",
          likes: "鲜花、护肤品、实用礼物、散步",
          avoid: "太甜、太占地方",
        },
        {
          id: "girlfriend",
          name: "女朋友",
          role: "恋人",
          budget: "中等预算",
          likes: "香氛、拍照、手写卡片、周末约会",
          avoid: "敷衍、临时购买",
        },
        {
          id: "dad",
          name: "爸爸",
          role: "父亲",
          budget: "低预算",
          likes: "茶、按摩、实用工具、健康",
          avoid: "花哨、用不上的摆件",
        },
      ],
      budget: {
        low: "低预算",
        mid: "中等预算",
        high: "高预算",
      },
      upcoming: "即将到来",
      daysAway: (days) => `${days}天后`,
      eventTitle: (name) => `${name}的生日快到了`,
      eventNote: (person) =>
        `准备一份${person.budget}：避开${person.avoid || "不确定的选择"}，把心意放在对方真的在意的地方。`,
      ideasLabel: "按喜好",
      copied: "已复制",
      copy: "复制",
      defaultLikes: "实用、陪伴、舒适",
      defaultAvoid: "临时感太强的礼物",
    };

const sampleRelationships = copy.sample.map((person, index) => ({
  ...person,
  date: nextDate([5, 14, 21][index]),
}));

let relationships = loadRelationships();
let selectedId = relationships[0]?.id;
let filter = "upcoming";
let ideaOffset = 0;

const listEl = document.querySelector("#relationshipList");
const formEl = document.querySelector("#relationshipForm");
const eventTitleEl = document.querySelector("#eventTitle");
const eventMetaEl = document.querySelector("#eventMeta");
const eventNoteEl = document.querySelector("#eventNote");
const ideaGridEl = document.querySelector("#ideaGrid");
const blessingEl = document.querySelector("#blessingText");

function nextDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function loadRelationships() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : sampleRelationships;
  } catch {
    return sampleRelationships;
  }
}

function saveRelationships() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(relationships));
}

function daysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(`${dateString}T00:00:00`);
  const thisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());
  if (thisYear < today) {
    thisYear.setFullYear(thisYear.getFullYear() + 1);
  }
  return Math.round((thisYear - today) / 86400000);
}

function formatMonthDay(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (isEnglish) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function sortedRelationships() {
  return [...relationships].sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
}

function selectedRelationship() {
  return relationships.find((item) => item.id === selectedId) || sortedRelationships()[0];
}

function giftIdeasFor(person) {
  const likes = person.likes.split(/[、,，]/).map((item) => item.trim()).filter(Boolean);
  const base = isEnglish
    ? [
        { title: "Handwritten card + time together", reason: "Low cost, high emotional value.", price: "$0-30", tags: ["warm", "time"] },
        { title: "Flowers and a small dessert", reason: "A reliable way to create birthday ritual.", price: "$25-80", tags: ["classic", "same day"] },
        { title: "Wellness care set", reason: "Practical for family members and thoughtful enough to feel personal.", price: "$40-120", tags: ["useful", "wellness"] },
        { title: "Weekend experience", reason: "Shared memories often last longer than objects.", price: "$30-180", tags: ["experience", "bond"] },
        { title: "Everyday upgrade", reason: "Choose something they already use, but nicer.", price: "$20-150", tags: ["practical", "quality"] },
      ]
    : [
        { title: "手写卡片 + 当天陪伴", reason: "预算不高，但情绪价值很足。", price: "¥0-99", tags: ["温暖", "陪伴"] },
        { title: "鲜花与小蛋糕组合", reason: "适合生日当天制造仪式感。", price: "¥99-299", tags: ["浪漫", "即时"] },
        { title: "健康护理小套装", reason: "适合长辈，也显得认真体贴。", price: "¥199-499", tags: ["实用", "健康"] },
        { title: "周末体验安排", reason: "比物品更容易留下共同记忆。", price: "¥100-600", tags: ["体验", "关系"] },
        { title: "常用物升级款", reason: "把对方每天会用的东西换成更舒服的版本。", price: "¥80-500", tags: ["实用", "品质"] },
      ];
  const fromLikes = likes.slice(0, 3).map((like) => ({
    title: isEnglish ? `A gift tied to ${like}` : `${like}相关的小礼物`,
    reason: isEnglish ? `Starting from "${like}" feels more personal than picking a random bestseller.` : `从“${like}”出发，比盲选爆款更像真的了解对方。`,
    price: person.budget === copy.budget.high ? (isEnglish ? "$80-250" : "¥300-1000") : person.budget === copy.budget.low ? (isEnglish ? "$10-45" : "¥30-150") : isEnglish ? "$25-150" : "¥100-500",
    tags: [copy.ideasLabel, person.budget],
  }));
  return [...fromLikes, ...base];
}

function blessingFor(person) {
  if (isEnglish) {
    const relationTone = person.role.toLowerCase().includes("partner")
      ? "I feel lucky for the days we have shared and the small rituals we keep building."
      : "Thank you for the care, patience, and warmth you bring into my life.";
    return `Happy birthday, ${person.name}! ${relationTone} I hope this year brings you good health, easy days, and many moments that make you feel truly appreciated.`;
  }
  const relationTone = person.role.includes("恋") ? "想到我们一起走过的这些日子，还是觉得很幸运。" : "谢谢你一直以来的爱和照顾。";
  return `${person.name}，生日快乐！${relationTone} 愿你身体健康、每天开心，也愿我能把这份惦记认真地放在每一个重要日子里。`;
}

function render() {
  const sorted = sortedRelationships();
  const visible = filter === "upcoming" ? sorted.filter((item) => daysUntil(item.date) <= 90) : sorted;
  const person = selectedRelationship() || sorted[0];

  listEl.innerHTML = visible.map((item) => {
    const active = item.id === person?.id ? " active" : "";
    return `
      <button class="person-row${active}" type="button" data-id="${item.id}">
        <span class="avatar">${item.name.slice(0, 1)}</span>
        <span><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.role)} · ${formatMonthDay(item.date)}</span></span>
        <span class="pill">${copy.daysAway(daysUntil(item.date))}</span>
      </button>
    `;
  }).join("");

  if (!person) return;

  const days = daysUntil(person.date);
  eventTitleEl.textContent = copy.eventTitle(person.name);
  eventMetaEl.textContent = `${copy.daysAway(days)} · ${formatMonthDay(person.date)}`;
  eventNoteEl.textContent = copy.eventNote(person);

  const ideas = giftIdeasFor(person);
  const shifted = ideas.slice(ideaOffset).concat(ideas.slice(0, ideaOffset)).slice(0, 3);
  ideaGridEl.innerHTML = shifted.map((idea) => `
    <article class="idea-card">
      <strong>${escapeHtml(idea.title)}</strong>
      <span>${escapeHtml(idea.reason)}</span>
      <div class="tag-row">${idea.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <span class="price">${idea.price}</span>
    </article>
  `).join("");

  blessingEl.textContent = blessingFor(person);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

listEl.addEventListener("click", (event) => {
  const row = event.target.closest("[data-id]");
  if (!row) return;
  selectedId = row.dataset.id;
  ideaOffset = 0;
  render();
});

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(formEl);
  const relationship = {
    id: crypto.randomUUID(),
    name: data.get("name").trim(),
    role: data.get("role").trim(),
    date: data.get("date"),
    budget: data.get("budget"),
    likes: data.get("likes").trim() || copy.defaultLikes,
    avoid: data.get("avoid").trim() || copy.defaultAvoid,
  };
  relationships = [...relationships, relationship];
  selectedId = relationship.id;
  formEl.reset();
  saveRelationships();
  render();
});

document.querySelector("#sampleReset").addEventListener("click", () => {
  relationships = sampleRelationships.map((person) => ({ ...person }));
  selectedId = relationships[0].id;
  saveRelationships();
  render();
});

document.querySelector("#shuffleIdeas").addEventListener("click", () => {
  const person = selectedRelationship();
  ideaOffset = person ? (ideaOffset + 1) % giftIdeasFor(person).length : 0;
  render();
});

document.querySelector("#copyBlessing").addEventListener("click", async () => {
  await navigator.clipboard.writeText(blessingEl.textContent);
  const button = document.querySelector("#copyBlessing");
  button.textContent = copy.copied;
  setTimeout(() => {
    button.textContent = copy.copy;
  }, 1200);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

render();
