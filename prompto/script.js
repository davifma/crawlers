async function fetchGitHubFiles(owner, repo, path = '') {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Erro ao buscar ${apiUrl}: ${response.statusText}`);
  }

  const items = await response.json();
  const files = [];

  for (const item of items) {
    if (item.type === 'file') {
      const extension = item.name.split('.').pop().toLowerCase();

      const ignoredExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'yml', 'yaml'];
      if (ignoredExtensions.includes(extension)) {
        continue; // Ignorar imagens e arquivos yml
      }

      try {
        const contentResponse = await fetch(item.download_url);
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          files.push({
            filename: item.name,
            path: item.path,
            content: content
          });
        }
      } catch (error) {
        console.error(`Erro ao baixar arquivo ${item.path}:`, error);
      }

    } else if (item.type === 'dir') {
      // Recursivamente buscar subdiretórios
      const subFiles = await fetchGitHubFiles(owner, repo, item.path);
      files.push(...subFiles);
    }
  }

  return files;
}

async function startCrawler() {
  const owner = 'davifma';    // Trocar aqui pelo dono do repositório
  const repo = 'prompto';      // Trocar aqui pelo nome do repositório

  try {
    const files = await fetchGitHubFiles(owner, repo);

    const finalJson = {
      repository: `${owner}/${repo}`,
      extractedAt: new Date().toISOString(),
      files: files
    };

    // Exibe o JSON completo na página
    document.body.innerText = JSON.stringify(finalJson, null, 2);
  } catch (error) {
    console.error('Erro geral:', error);
    document.body.innerText = `Erro: ${error.message}`;
  }
}

startCrawler();
