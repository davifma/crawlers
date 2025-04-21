async function readGitHubRepo() {
  const owner = 'davifma'; // aqui você coloca o dono
  const repo = 'prompto'; // e o repositório

  const listUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

  const listResponse = await fetch(listUrl);
  const files = await listResponse.json();

  const results = [];

  for (const file of files) {
    if (file.type === 'file') {
      const contentResponse = await fetch(file.download_url);
      const contentText = await contentResponse.text();

      results.push({
        filename: file.name,
        path: file.path,
        content: contentText
      });
    }
  }

  const finalJson = {
    repository: `${owner}/${repo}`,
    extractedAt: new Date().toISOString(),
    files: results
  };

  document.body.innerText = JSON.stringify(finalJson, null, 2);
}

readGitHubRepo();
