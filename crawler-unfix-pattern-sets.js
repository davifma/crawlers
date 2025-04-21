const pages = [
  "https://unfix.com/decision-patterns",
  "https://unfix.com/goal-setting-patterns",
  "https://unfix.com/process-and-growth-patterns",
  "https://unfix.com/structural-pattern",
  "https://unfix.com/teaming-patterns"
];

// Proxy para driblar CORS
const proxy = "https://api.allorigins.win/get?url=";

async function fetchMainContent(url) {
  const response = await fetch(proxy + encodeURIComponent(url));
  const data = await response.json();
  const html = data.contents;

  const parser = new DOMParser();
  const doc = new DOMParser().parseFromString(html, "text/html");

  const main = doc.querySelector('main');
  const content = main ? main.innerText.trim() : "Conteúdo principal não encontrado.";

  return { url, content };
}

async function generateJSON() {
  const results = [];

  for (const page of pages) {
    const data = await fetchMainContent(page);
    results.push(data);
  }

  const finalJson = {
    extractedAt: new Date().toISOString(),
    pages: results
  };

  console.log(JSON.stringify(finalJson, null, 2));
}

generateJSON();
