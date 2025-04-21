async function fetchAndParseUnfix() {
  const url = "https://unfix.com/all-pattern-sets";
  const output = document.getElementById('output');

  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    const html = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove elementos que você não quer: header, footer, nav, aside
    const selectorsToRemove = ['header', 'footer', 'nav', 'aside', '.site-header', '.site-footer', '.menu', '.navigation'];
    selectorsToRemove.forEach(selector => {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Remove todos os links <a>, mas mantém o texto interno
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
      const span = document.createElement('span');
      span.innerHTML = link.innerHTML; // preserva o texto interno
      link.parentNode.replaceChild(span, link);
    });

    // Agora, pega só o corpo do conteúdo principal
    const mainContent = doc.querySelector('main') || doc.body; // fallback para <body> se não tiver <main>
    const textContent = mainContent.innerText.trim();

    // Cria o JSON final
    const jsonOutput = {
      source: url,
      extractedAt: new Date().toISOString(),
      content: textContent
    };

    output.textContent = JSON.stringify(jsonOutput, null, 2);

  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    output.textContent = 'Erro ao buscar conteúdo.';
  }
}
