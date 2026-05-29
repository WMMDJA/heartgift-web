const STORAGE_KEY = "heartgift-web-relationships";

const sampleRelationships = [
  {
    id: "mom",
    name: "妈妈",
    role: "母亲",
    date: nextDate(5),
    budget: "中等预算",
    likes: "鲜花、护肤品、实用礼物、散步",
    avoid: "太甜、太占地方",
  },
  {
    id: "girlfriend",
    name: "女朋友",
    role: "恋人",
    date: nextDate(14),
    budget: "中等预算",
    likes: "香氛、拍照、手写卡片、周末约会",
    avoid: "敷衍、临时购买",
  },
  {
    id: "dad",
    name: "爸爸",
    role: "父亲",
    date: nextDate(21),
    budget: "低预算",
    likes: "茶、按摩、实用工具、健康",
    avoid: "花哨、用不上的摆件",
  },
];

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
  const base = [
    { title: "手写卡片 + 当天陪伴", reason: "预算不高，但情绪价值很足。", price: "¥0-99", tags: ["温暖", "陪伴"] },
    { title: "鲜花与小蛋糕组合", reason: "适合生日当天制造仪式感。", price: "¥99-299", tags: ["浪漫", "即时"] },
    { title: "健康护理小套装", reason: "适合长辈，也显得认真体贴。", price: "¥199-499", tags: ["实用", "健康"] },
    { title: "周末体验安排", reason: "比物品更容易留下共同记忆。", price: "¥100-600", tags: ["体验", "关系"] },
    { title: "常用物升级款", reason: "把对方每天会用的东西换成更舒服的版本。", price: "¥80-500", tags: ["实用", "品质"] },
  ];
  const fromLikes = likes.slice(0, 3).map((like) => ({
    title: `${like}相关的小礼物`,
    reason: `从“${like}”出发，比盲选爆款更像真的了解对方。`,
    price: person.budget === "高预算" ? "¥300-1000" : person.budget === "低预算" ? "¥30-150" : "¥100-500",
    tags: ["按喜好", person.budget],
  }));
  return [...fromLikes, ...base];
}

function blessingFor(person) {
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
        <span class="pill">${daysUntil(item.date)}天后</span>
      </button>
    `;
  }).join("");

  if (!person) return;

  const days = daysUntil(person.date);
  eventTitleEl.textContent = `${person.name}的生日快到了`;
  eventMetaEl.textContent = `${days}天后 · ${formatMonthDay(person.date)}`;
  eventNoteEl.textContent = `准备一份${person.budget}：避开${person.avoid || "不确定的选择"}，把心意放在对方真的在意的地方。`;

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
    likes: data.get("likes").trim() || "实用、陪伴、舒适",
    avoid: data.get("avoid").trim() || "临时感太强的礼物",
  };
  relationships = [...relationships, relationship];
  selectedId = relationship.id;
  formEl.reset();
  saveRelationships();
  render();
});

document.querySelector("#sampleReset").addEventListener("click", () => {
  relationships = sampleRelationships;
  selectedId = relationships[0].id;
  saveRelationships();
  render();
});

document.querySelector("#shuffleIdeas").addEventListener("click", () => {
  ideaOffset = (ideaOffset + 1) % 5;
  render();
});

document.querySelector("#copyBlessing").addEventListener("click", async () => {
  await navigator.clipboard.writeText(blessingEl.textContent);
  const button = document.querySelector("#copyBlessing");
  button.textContent = "已复制";
  setTimeout(() => {
    button.textContent = "复制";
  }, 1200);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

render();
