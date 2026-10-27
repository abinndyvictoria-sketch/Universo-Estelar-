(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const KEYS = { progress: "magicchoice-progress-v1", favorites: "magicchoice-favorites-v1", created: "magicchoice-created-v1", settings: "magicchoice-settings-v1" };
  const state = { stories: [], view: "home", activeStory: null, activeEpisode: null, sceneId: null, flags: {}, history: [], exploreFilter: "Todos", libraryFilter: "recent", search: "" };
  const safeRead = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast("Não foi possível salvar. Exporte seus dados ou libere espaço no navegador."); return false; } };
  const favorites = () => safeRead(KEYS.favorites, []);
  const progressData = () => safeRead(KEYS.progress, {});
  const createdStories = () => safeRead(KEYS.created, []);
  let toastTimer;
  function toast(message) { const node = $("#toast"); node.textContent = message; node.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove("show"), 2600); }
  function escapeHTML(value = "") { return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])); }
  function allStories() { return [...state.stories, ...createdStories()]; }
  function getStory(id) { return allStories().find(story => story.id === id); }
  function getEpisode(story, episodeId) { return story?.episodes?.find(episode => episode.id === episodeId) || story?.episodes?.[0]; }
  function getScene(story, episode, id) { return episode?.scenes?.find(scene => scene.id === id); }
  function currentScene() { return getScene(state.activeStory, state.activeEpisode, state.sceneId); }
  function symbolFor(genre) { return ({ Fantasia: "✧", Romance: "♡", Mistério: "⌕", Suspense: "☾", Aventura: "⚔", Drama: "❋" })[genre] || "✦"; }
  function setView(view) { state.view = view; $$(".view").forEach(el => el.classList.toggle("active", el.id === view + "-view")); $$(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.view === view)); window.scrollTo({ top: 0, behavior: "smooth" }); if (view === "home") renderHome(); if (view === "explore") renderExplore(); if (view === "library") renderLibrary(); }
  function storyCard(story) {
    const isFav = favorites().includes(story.id);
    const progress = progressData()[story.id];
    const episodeNumber = progress?.episodeNumber || 1;
    const cover = story.coverSymbol || symbolFor(story.genre);
    return `<article class="story-card"><div class="story-cover"><span class="cover-orbit"></span><span class="cover-symbol">${escapeHTML(cover)}</span><span class="cover-tag">${escapeHTML(story.genre || "Fantasia")}</span><button class="favorite-button ${isFav ? "is-favorite" : ""}" data-favorite="${escapeHTML(story.id)}" aria-label="${isFav ? "Remover dos" : "Adicionar aos"} favoritos">${isFav ? "♥" : "♡"}</button></div><div class="story-info"><h3>${escapeHTML(story.title)}</h3><p>${escapeHTML(story.description || "Uma nova aventura espera por você.")}</p><div class="story-meta"><span>✦ ${(story.episodes || []).length} episódio(s)</span><span>${progress ? "Em andamento · Ep. " + episodeNumber : "História interativa"}</span></div><button class="primary-button" data-open-story="${escapeHTML(story.id)}">${progress ? "Continuar lendo →" : "Começar história →"}</button></div></article>`;
  }
  function bindStoryButtons(root = document) {
    $$("[data-open-story]", root).forEach(button => button.addEventListener("click", () => openStory(button.dataset.openStory)));
    $$("[data-favorite]", root).forEach(button => button.addEventListener("click", () => toggleFavorite(button.dataset.favorite)));
  }
  function renderHome() {
    const stories = allStories();
    $("#featured-list").innerHTML = stories.map(storyCard).join("");
    const created = createdStories();
    $("#created-list").innerHTML = created.map(storyCard).join("");
    $("#created-empty").classList.toggle("hidden", created.length > 0);
    const saved = Object.entries(progressData()).filter(([id]) => getStory(id));
    const last = saved.length ? saved[saved.length - 1] : null;
    $("#continue-section").classList.toggle("hidden", !last);
    if (last) {
      const story = getStory(last[0]);
      $("#continue-card").innerHTML = `<div class="continue-card"><div class="continue-symbol">${escapeHTML(story.coverSymbol || symbolFor(story.genre))}</div><div class="continue-copy"><p class="eyebrow">VOCÊ ESTAVA LENDO</p><h3>${escapeHTML(story.title)}</h3><p>Episódio ${last[1].episodeNumber || 1} · Continue de onde parou</p><button class="primary-button" data-open-story="${escapeHTML(story.id)}">Continuar →</button></div></div>`;
    }
    bindStoryButtons();
  }
  function renderExplore() {
    const query = state.search.trim().toLocaleLowerCase("pt-BR");
    let stories = allStories().filter(story => {
      const genreMatch = state.exploreFilter === "Todos" || (state.exploreFilter === "Favoritos" ? favorites().includes(story.id) : story.genre === state.exploreFilter);
      const searchMatch = !query || (story.title + " " + story.genre + " " + story.description).toLocaleLowerCase("pt-BR").includes(query);
      return genreMatch && searchMatch;
    });
    $("#explore-list").innerHTML = stories.map(storyCard).join("");
    $("#explore-empty").classList.toggle("hidden", stories.length > 0);
    $$("#filter-row [data-filter]").forEach(button => button.classList.toggle("selected", button.dataset.filter === state.exploreFilter));
    bindStoryButtons($("#explore-list"));
  }
  function renderLibrary() {
    let stories = allStories();
    if (state.libraryFilter === "recent") stories = stories.filter(story => progressData()[story.id]);
    if (state.libraryFilter === "favorites") stories = stories.filter(story => favorites().includes(story.id));
    if (state.libraryFilter === "created") stories = createdStories();
    $("#library-list").innerHTML = stories.map(storyCard).join("");
    $("#library-empty").classList.toggle("hidden", stories.length > 0);
    $$("[data-library-filter]").forEach(button => button.classList.toggle("selected", button.dataset.libraryFilter === state.libraryFilter));
    bindStoryButtons($("#library-list"));
  }
  function toggleFavorite(id) {
    const next = favorites();
    const index = next.indexOf(id);
    if (index >= 0) next.splice(index, 1); else next.push(id);
    safeWrite(KEYS.favorites, next);
    renderHome(); if (state.view === "explore") renderExplore(); if (state.view === "library") renderLibrary();
    if (state.activeStory?.id === id) updateReaderFavorite();
    toast(index >= 0 ? "Removido dos favoritos." : "Adicionado aos favoritos ♥");
  }
  function updateReaderFavorite() { $("#reader-favorite").textContent = favorites().includes(state.activeStory?.id) ? "♥" : "♡"; $("#reader-favorite").style.color = favorites().includes(state.activeStory?.id) ? "#ffb5ed" : ""; }
  function openStory(id) {
    const story = getStory(id);
    if (!story || !story.episodes?.length) return toast("Não foi possível abrir essa história.");
    state.activeStory = story;
    const saved = progressData()[id];
    state.activeEpisode = getEpisode(story, saved?.episodeId);
    state.sceneId = getScene(story, state.activeEpisode, saved?.sceneId) ? saved.sceneId : state.activeEpisode.startSceneId;
    state.flags = saved?.flags || {};
    state.history = saved?.history || [];
    $("#reader-title").textContent = story.title;
    updateReaderFavorite();
    setView("reader");
    renderReaderScene();
  }
  function saveProgress() {
    if (!state.activeStory || !state.activeEpisode || !state.sceneId) return;
    const all = progressData();
    all[state.activeStory.id] = { episodeId: state.activeEpisode.id, episodeNumber: state.activeEpisode.number || 1, sceneId: state.sceneId, flags: state.flags, history: state.history.slice(-40), updatedAt: new Date().toISOString() };
    safeWrite(KEYS.progress, all);
  }
  function renderReaderScene() {
    const scene = currentScene();
    if (!scene) { toast("Esta cena não existe no episódio."); return; }
    $("#reader-episode-label").textContent = "EPISÓDIO " + (state.activeEpisode.number || 1);
    $("#reader-location").textContent = scene.location || state.activeEpisode.title || "UMA NOVA CENA";
    $("#reader-title").textContent = scene.title || state.activeStory.title;
    $("#reader-text").textContent = scene.text || "";
    $("#reader-progress").textContent = state.activeEpisode.title || ("Episódio " + (state.activeEpisode.number || 1));
    $("#reader-scene").style.background = scene.backgroundColor || "";
    const choices = scene.choices || [];
    $("#reader-choices").innerHTML = choices.map((choice, index) => `<button class="choice-button" data-choice="${escapeHTML(choice.id)}"><span class="choice-number">${index + 1}</span><span>${escapeHTML(choice.text)}</span></button>`).join("");
    $$("#reader-choices [data-choice]").forEach(button => button.addEventListener("click", () => choose(button.dataset.choice)));
    $("#reader-continue").classList.toggle("hidden", !scene.ending);
    $("#reader-continue").textContent = scene.ending?.text || "Continuar →";
    $("#reader-continue").onclick = () => {
      if (scene.ending?.nextEpisodeId) {
        const nextEpisode = getEpisode(state.activeStory, scene.ending.nextEpisodeId);
        if (nextEpisode) { state.activeEpisode = nextEpisode; state.sceneId = nextEpisode.startSceneId; state.history = []; renderReaderScene(); saveProgress(); return; }
      }
      toast(scene.ending?.text || "Fim desta parte da história.");
      saveProgress();
    };
    saveProgress();
  }
  function choose(choiceId) {
    const scene = currentScene();
    const choice = scene?.choices?.find(item => item.id === choiceId);
    if (!choice) return;
    if (choice.condition && !Object.entries(choice.condition).every(([key, value]) => state.flags[key] === value)) return toast("Essa escolha ainda está bloqueada.");
    state.history.push(state.sceneId);
    Object.entries(choice.effects || {}).forEach(([key, value]) => {
      if (typeof value === "number") state.flags[key] = (Number(state.flags[key]) || 0) + value;
      else state.flags[key] = value;
    });
    const next = getScene(state.activeStory, state.activeEpisode, choice.nextSceneId);
    if (!next) return toast("O destino desta escolha ainda não foi criado.");
    state.sceneId = next.id;
    renderReaderScene();
  }
  function restartEpisode() {
    if (!state.activeStory || !state.activeEpisode) return;
    state.sceneId = state.activeEpisode.startSceneId; state.flags = {}; state.history = [];
    renderReaderScene(); toast("Episódio reiniciado.");
  }
  function validStory(story) {
    if (!story || typeof story.title !== "string" || !story.title.trim() || !Array.isArray(story.episodes) || !story.episodes.length) return false;
    return story.episodes.every(ep => ep.id && ep.startSceneId && Array.isArray(ep.scenes) && ep.scenes.some(scene => scene.id === ep.startSceneId) && ep.scenes.every(scene => scene.id && typeof scene.text === "string" && Array.isArray(scene.choices) && scene.choices.every(choice => choice.id && choice.text && choice.nextSceneId && ep.scenes.some(target => target.id === choice.nextSceneId))));
  }
  function createStory(event) {
    event.preventDefault();
    const title = $("#story-title").value.trim();
    const genre = $("#story-genre").value;
    const description = $("#story-description").value.trim() || "Uma aventura criada pela comunidade MagicChoice.";
    const text = $("#scene-text").value.trim();
    const choiceOne = $("#choice-one").value.trim();
    const choiceTwo = $("#choice-two").value.trim();
    if (!title || !text || !choiceOne || !choiceTwo) return toast("Preencha o título, a cena e as duas escolhas.");
    const slug = title.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "historia";
    const id = slug + "-" + Date.now().toString(36);
    const story = { schemaVersion: 1, id, title, genre, description, coverSymbol: symbolFor(genre), author: "Você", status: "complete", episodes: [{ id: id + "-ep1", number: 1, title: "O começo", startSceneId: "inicio", scenes: [{ id: "inicio", title, location: "CENA INICIAL", text, choices: [{ id: "escolha-1", text: choiceOne, nextSceneId: "caminho-1", effects: { primeiraEscolha: choiceOne } }, { id: "escolha-2", text: choiceTwo, nextSceneId: "caminho-2", effects: { segundaEscolha: choiceTwo } }] }, { id: "caminho-1", title: "O caminho escolhido", location: "SUA HISTÓRIA", text: "Você decidiu: " + choiceOne + ". O mundo reage à sua decisão, e uma nova possibilidade começa a surgir.", choices: [], ending: { id: "fim-1", type: "ending", text: "Fim deste caminho — você pode recomeçar e escolher diferente." } }, { id: "caminho-2", title: "O caminho alternativo", location: "SUA HISTÓRIA", text: "Você decidiu: " + choiceTwo + ". A situação toma outro rumo, e nada parece exatamente como antes.", choices: [], ending: { id: "fim-2", type: "ending", text: "Fim deste caminho — você pode recomeçar e escolher diferente." } }] }] };
    const list = createdStories(); list.unshift(story);
    if (!safeWrite(KEYS.created, list)) return;
    $("#story-form").reset(); renderHome(); toast("História criada! Ela já está na sua biblioteca.");
    openStory(id);
  }
  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  function importStoryFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const stories = Array.isArray(data) ? data : [data];
        if (!stories.length || !stories.every(validStory)) throw new Error("Formato inválido");
        const existing = createdStories();
        const known = new Set(existing.map(story => story.id));
        stories.forEach(story => { if (!known.has(story.id)) existing.push(story); });
        if (!safeWrite(KEYS.created, existing)) return;
        renderHome(); toast(stories.length === 1 ? "História importada com sucesso!" : "Histórias importadas com sucesso!");
      } catch { toast("Esse arquivo não parece ser uma história JSON válida do MagicChoice."); }
      $("#import-file").value = "";
    };
    reader.readAsText(file);
  }
  function exportBackup() { downloadJSON("magicchoice-backup.json", { app: "MagicChoice", version: 1, exportedAt: new Date().toISOString(), createdStories: createdStories(), favorites: favorites(), progress: progressData(), settings: safeRead(KEYS.settings, {}) }); toast("Backup preparado para salvar."); }
  function applySettings() {
    const settings = safeRead(KEYS.settings, { fontScale: 1 });
    const scale = Math.max(.85, Math.min(1.3, Number(settings.fontScale) || 1));
    document.documentElement.style.setProperty("--reader-scale", scale);
    $("#font-size-label").textContent = Math.round(scale * 100) + "%";
  }
  function changeFont(amount) {
    const settings = safeRead(KEYS.settings, { fontScale: 1 });
    settings.fontScale = Math.max(.85, Math.min(1.3, (Number(settings.fontScale) || 1) + amount));
    safeWrite(KEYS.settings, settings); applySettings();
  }
  function setupEvents() {
    $$("[data-view]").forEach(button => button.addEventListener("click", event => { event.preventDefault(); setView(button.dataset.view); }));
    $$("[data-genre]").forEach(button => button.addEventListener("click", () => { state.exploreFilter = button.dataset.genre; setView("explore"); renderExplore(); }));
    $$("#filter-row [data-filter]").forEach(button => button.addEventListener("click", () => { state.exploreFilter = button.dataset.filter; renderExplore(); }));
    $$("[data-library-filter]").forEach(button => button.addEventListener("click", () => { state.libraryFilter = button.dataset.libraryFilter; renderLibrary(); }));
    $("#search-toggle").addEventListener("click", () => { setView("explore"); const form = $("#explore-search-form"); form.classList.remove("hidden"); $("#explore-search-input").focus(); });
    $("#search-close").addEventListener("click", () => { $("#search-form").classList.add("hidden"); $("#search-input").value = ""; state.search = ""; renderHome(); });
    $("#search-form").addEventListener("submit", event => event.preventDefault());
    $("#search-input").addEventListener("input", event => { state.search = event.target.value; renderExplore(); });
    $("#explore-search-close").addEventListener("click", () => { $("#explore-search-form").classList.add("hidden"); $("#explore-search-input").value = ""; state.search = ""; renderExplore(); });
    $("#explore-search-form").addEventListener("submit", event => event.preventDefault());
    $("#explore-search-input").addEventListener("input", event => { state.search = event.target.value; renderExplore(); });
    $("#story-form").addEventListener("submit", createStory);
    $("#import-file").addEventListener("change", event => importStoryFile(event.target.files?.[0]));
    $("#reader-back").addEventListener("click", () => setView("library"));
    $("#reader-favorite").addEventListener("click", () => state.activeStory && toggleFavorite(state.activeStory.id));
    $("#reader-restart").addEventListener("click", restartEpisode);
    $("#font-down").addEventListener("click", () => changeFont(-.05));
    $("#font-up").addEventListener("click", () => changeFont(.05));
    $("#backup-export").addEventListener("click", exportBackup);
  }
  async function init() {
    setupEvents(); applySettings();
    if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(error => console.warn("Service worker indisponível:", error));
    try {
      const response = await fetch("data/perdidos.json");
      if (!response.ok) throw new Error("Não foi possível carregar os dados");
      const story = await response.json();
      if (validStory(story)) state.stories = [story]; else throw new Error("Estrutura da história inválida");
    } catch (error) {
      console.error(error);
      state.stories = [{ id: "perdidos", title: "Perdidos", genre: "Fantasia", description: "Uma porta misteriosa espera por você na floresta.", coverSymbol: "✧", episodes: [{ id: "perdidos-ep1", number: 1, title: "A Porta", startSceneId: "floresta", scenes: [{ id: "floresta", title: "A Porta", location: "A FLORESTA", text: "Você encontra uma porta antiga no meio da floresta. Símbolos brilham na madeira, embora não exista parede alguma ao redor.", choices: [{ id: "abrir", text: "Abrir a porta", nextSceneId: "portal" }, { id: "investigar", text: "Investigar a floresta", nextSceneId: "trilha" }] }, { id: "portal", title: "Do outro lado", location: "O PORTAL", text: "A porta se abre para um céu que você nunca viu. Uma estrela desaparece e uma voz sussurra seu nome.", choices: [], ending: { text: "Continua no próximo episódio..." } }, { id: "trilha", title: "As marcas", location: "ENTRE AS ÁRVORES", text: "Você encontra cinco marcas no chão e um bilhete: NÃO DEIXE A ESTRELA DESAPARECER.", choices: [], ending: { text: "Continua no próximo episódio..." } }] }] }];
    }
    renderHome();
  }
  init();
})();