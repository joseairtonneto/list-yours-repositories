import api from './api';

class App {
  constructor() {
    this.repositories = '';

    this.formElement = document.getElementById('searchUser');
    this.inputElement = document.getElementById('userName');
    this.userElement = document.getElementById('userData');
    this.listElement = document.getElementById('repositories-list');

    this.registerHandlers();
  }

  registerHandlers() {
    this.formElement.onsubmit = event => this.addUser(event);
  }

  setLoading(loading = true)  {
    if(loading === true)  {
      this.userElement.innerHTML = '';
      this.listElement.innerHTML = '';

      let loadingElement = document.createElement('span');
      loadingElement.appendChild(document.createTextNode('Carregando...'));
      loadingElement.setAttribute('id', 'loading');

      this.formElement.appendChild(loadingElement);
    } else {
      document.getElementById('loading').remove();
    }
  }

  async addUser(event) {
    event.preventDefault();

    const username = this.inputElement.value;

    if(username.length === 0) return;

    this.setLoading();

    try {
      const repositoriesResponse = await api(`/users/${username}/repos`);

      const userResponse = await api(`/users/${username}`);

      const { name, avatar_url, html_url, bio } = userResponse.data;

      this.renderUser(name, avatar_url, html_url, bio);

      this.repositories = repositoriesResponse.data;

      this.renderRepositories();

      this.inputElement.value = '';
    } catch(err) {
      alert('Usuário não existe!');

      this.inputElement.value = '';
    }

    this.setLoading(false);
  }

  renderUser(name, avatar, html, bio ) {
    let imgElement = document.createElement('img');
    imgElement.setAttribute('src', avatar);

    let titleElement = document.createElement('h1');
    titleElement.appendChild(document.createTextNode(name));

    let bioElement = document.createElement('p');
    bioElement.appendChild(document.createTextNode(bio));

    let linkElement = document.createElement('a');
    linkElement.setAttribute('target', '_blank');
    linkElement.setAttribute('href', html);
    linkElement.appendChild(document.createTextNode('Acessar Perfil'));

    this.userElement.appendChild(imgElement);
    this.userElement.appendChild(titleElement);
    this.userElement.appendChild(bioElement);
    this.userElement.appendChild(linkElement);
  }

  renderRepositories() {
    this.repositories.forEach(repository => {
      let titleElement = document.createElement('strong');
      titleElement.appendChild(document.createTextNode(repository.name));

      let descriptionElement = document.createElement('p');
      descriptionElement.appendChild(document.createTextNode(repository.description));

      let linkElement = document.createElement('a');
      linkElement.setAttribute('target', '_blank');
      linkElement.setAttribute('href', repository.html_url);
      linkElement.appendChild(document.createTextNode('Acessar Repositório'));

      let listItemElement = document.createElement('li');
      listItemElement.appendChild(titleElement);
      listItemElement.appendChild(descriptionElement);
      listItemElement.appendChild(linkElement);

      this.listElement.appendChild(listItemElement);
    });
  }
}

new App();
