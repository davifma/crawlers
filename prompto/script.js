async function fetchGitHubFiles(owner, repo, path = '') {
  const listUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const listResponse = await fetch(listUrl);
  const files = await listResponse.json();

  const results = [];

  for (const file of files) {
    if (file.type === 'file') {
      const ext = file.name.split('.').pop().toLowerCase();

      // Ignorar arquivos de imagem
      const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'yml'];
      if (imageExtensions.includes(ext)) {
        continue; // pula para o próximo
      }

      const contentResponse = await fetch(file.download_url);
      const contentText = await contentResponse.text();

      results.push({
        filename: file.name,
        path: file.path,
        content: contentText
      });
    } else if (file.type === 'dir') {
      // Se for diretório, chama a função recursivamente
      const subdirResults = await fetchGitHubFiles(owner, repo, file.path);
      results.push(...subdirResults);
    }
  }

  return results;
}

async function startCrawler() {
  const owner = 'davifma';   // <<-- Trocar aqui
  const repo = 'prompto';     // <<-- Trocar aqui

  const results = await fetchGitHubFiles(owner, repo);

  const finalJson = {
    repository: `${owner}/${repo}`,
    extractedAt: new Date().toISOString(),
    files: results
  };

  // Exibe JSON na página
  document.body.innerText = JSON.stringify(finalJson, null, 2);
}

startCrawler();
