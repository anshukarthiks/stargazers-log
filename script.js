const repositoryList = document.querySelector("#repository-list");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  if (!Array.isArray(repositories) || repositories.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "status-message";
    emptyMessage.textContent = "No starred repositories to show yet.";
    repositoryList.append(emptyMessage);
    return;
  }

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository";

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = `https://github.com/${encodeURIComponent(repository.repository).replaceAll("%2F", "/")}`;
    link.textContent = repository.repository;
    heading.append(link);

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;

    const metadata = document.createElement("div");
    metadata.className = "repository-meta";

    const language = document.createElement("span");
    language.textContent = `Language: ${repository.language}`;

    const date = document.createElement("time");
    date.dateTime = repository.starred_at;
    date.textContent = `Starred ${new Date(`${repository.starred_at}T00:00:00`).toLocaleDateString()}`;

    metadata.append(language, date);
    item.append(heading, description, metadata);
    repositoryList.append(item);
  }
}

fetch("./events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }
    return response.json();
  })
  .then(renderRepositories)
  .catch((error) => {
    const message = document.createElement("li");
    message.className = "status-message";
    message.textContent = "Unable to load starred repositories. Please try again later.";
    repositoryList.replaceChildren(message);
    console.error(error);
  });
