/**
 * Lifecycle methods can be used:
 * -connectedCallback
 * -disconnectedCallback
 * -attributeChangedCallback
 */

//It is needed in imported HTML's scripts to allow them access to the DOM of the imported HTML
const currentDocument = document.currentScript.ownerDocument;

class UserCard extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', e => {
      this.toggleCard();
    });
  }

  // Called when element is inserted in DOM
  connectedCallback() {

    // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
    // Current document needs to be defined to get DOM access to imported HTML
    const shadowRoot = this.attachShadow({mode: 'open'});
    const template = currentDocument.querySelector('#user-card-template');
    const instance = template.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    // Extract the attribute user-id from our element. 
    // Note that we are going to specify our cards like: 
    // <user-card user-id="1"></user-card>
    const userId = this.getAttribute('user-id');

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.text())
      .then((responseText) => {
        this.render(JSON.parse(responseText));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render(userData) {
    this.shadowRoot.querySelector('.card__full-name').innerHTML = userData.name;
    this.shadowRoot.querySelector('.card__user-name').innerHTML = userData.username;
    this.shadowRoot.querySelector('.card__website').innerHTML = userData.website;
    this.shadowRoot.querySelector('.card__address').innerHTML = `<h4>Address</h4>
      ${userData.address.suite}, <br />
      ${userData.address.street}, <br />
      ${userData.address.city}, <br />
      Zipcode: ${userData.address.zipcode}`;
  }

  toggleCard() {
    let elem = this.shadowRoot.querySelector('.card__hidden-content');
    let btn = this.shadowRoot.querySelector('.card__details-btn');

    btn.innerHTML = elem.style.display == 'none' ? 'Less Details' : 'More Details';
    elem.style.display = elem.style.display == 'none' ? 'block' : 'none';
  }
}

//call tells the DOM that we have created a new custom element called user-card
customElements.define('user-card', UserCard);