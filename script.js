
// Basic i18n
const dict = {
  ru: {
    title: "Преобразуйте архив Genially в portable EXE",
    subtitle: "Загрузите ZIP, запустите сборку и скачайте готовый .exe бесплатно — с публикацией в GitHub Releases.",
    chooseZip: "Выберите архив Genially (.zip)",
    openUploads: "Открыть папку uploads в GitHub",
    startBuild: "Запустить сборку",
    hint: "1) Нажмите «Открыть папку uploads» → перетащите сюда свой ZIP → Commit.<br/>2) Затем нажмите «Запустить сборку» — GitHub Actions соберёт EXE и опубликует в Releases.",
    done: "Готово! Файл собран и опубликован в Releases.",
    download: "Скачать EXE",
  },
  en: {
    title: "Convert a Genially archive to a portable EXE",
    subtitle: "Upload the ZIP, start the build and download the .exe for free — published to GitHub Releases.",
    chooseZip: "Choose Genially archive (.zip)",
    openUploads: "Open uploads folder on GitHub",
    startBuild: "Start build",
    hint: "1) Click “Open uploads” → drag & drop your ZIP → Commit.<br/>2) Then click “Start build” — GitHub Actions will build EXE and publish it to Releases.",
    done: "Done! The file is built and published to Releases.",
    download: "Download EXE",
  }
};

const username = "AndreiPabiarzhyn";
const repo = "genially-builder-online";
const uploadsUrl = `https://github.com/${username}/${repo}/upload/main/uploads`;
const actionsUrl = `https://github.com/${username}/${repo}/actions/workflows/build.yml`;
const releasesApi = `https://api.github.com/repos/${username}/${repo}/releases/latest`;

const zipInput = document.getElementById("zipInput");
const fileName = document.getElementById("fileName");
const openUploads = document.getElementById("openUploads");
const startBuild = document.getElementById("startBuild");
const barFill = document.getElementById("barFill");
const progressText = document.getElementById("progressText");
const resultBox = document.getElementById("resultBox");
const downloadLink = document.getElementById("downloadLink");

const yearSpan = document.getElementById("year");
yearSpan.textContent = new Date().getFullYear();

// initial links
openUploads.href = uploadsUrl;

zipInput.addEventListener("change", () => {
  const f = zipInput.files?.[0];
  fileName.textContent = f ? f.name : "";
});

// language switching
function setLang(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    el.innerHTML = dict[lang][k] || el.innerHTML;
  });
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add("active");
}
document.querySelectorAll(".lang-btn").forEach(b => {
  b.addEventListener("click", () => setLang(b.dataset.lang));
});
setLang("ru");

// pseudo-progress & open workflow page
startBuild.addEventListener("click", () => {
  // Step 1: open Actions workflow page (user clicks "Run workflow")
  window.open(actionsUrl, "_blank");

  // Step 2: animate local progress while user triggers the workflow
  let p = 0;
  const steps = [
    "⏳ Подготовка… / Preparing…",
    "📦 Проверка архива… / Checking ZIP…",
    "⚙️ Сборка EXE… / Building EXE…",
    "🧰 Публикация Releases… / Publishing to Releases…"
  ];
  const id = setInterval(() => {
    p = Math.min(p + Math.random() * 17, 95);
    barFill.style.width = p.toFixed(0) + "%";
    progressText.textContent = steps[Math.min(Math.floor(p / 25), steps.length - 1)];
  }, 600);

  // Step 3: poll latest release, show download when appears
  const poll = setInterval(async () => {
    try {
      const r = await fetch(releasesApi, { headers: { "Accept":"application/vnd.github+json" }});
      if (r.ok) {
        const j = await r.json();
        const asset = (j.assets || []).find(a => /\.exe$/i.test(a.name));
        if (asset) {
          clearInterval(id);
          clearInterval(poll);
          barFill.style.width = "100%";
          progressText.textContent = "✅ Done!";
          resultBox.classList.remove("hidden");
          downloadLink.href = asset.browser_download_url;
        }
      }
    } catch (e) {}
  }, 5000);
});

// Animated neon blobs background
const c = document.getElementById("bg");
const ctx = c.getContext("2d");
let w, h, t=0;
function resize(){ w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
window.addEventListener("resize", resize); resize();
function loop(){
  t += 0.01;
  ctx.clearRect(0,0,w,h);
  for(let i=0;i<5;i++){
    const x = (Math.sin(t+i)*0.4+0.5)*w;
    const y = (Math.cos(t*1.3+i)*0.4+0.5)*h;
    const r = Math.max(w,h)*0.25*(0.6+0.4*Math.sin(t*1.7+i));
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0, i%2? "rgba(163,107,255,0.20)" : "rgba(107,140,255,0.20)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(loop);
}
loop();
