import Component from '../../component.js';

export default class PhoneCatalog extends Component {
  constructor({ element }) {
    super({ element });

    this._phones = [];

    this._render();

    this.on('click', 'details-link', (event) => {
      const phoneElement = event.target.closest('[data-element="phone"]');

      this.emit('phone-selected', phoneElement.dataset.phoneId);
    });

    this.on('click', 'add-button', (event) => {
      const phoneElement = event.target.closest('[data-element="phone"]');

      this.emit('phone-added', phoneElement.dataset.phoneId);
    });
  }

  show(phones) {
    this._phones = phones;

    super.show();

    this._render();
  }

  _render() {
    this._element.innerHTML = `
      <ul class="phones">
        ${ this._phones.map(phone => `
        
          <li
            data-element="phone"
            data-phone-id="${ phone.id }"
            class="thumbnail"
          >
            <a
              data-element="details-link"
              href="#!/phones/${ phone.id }"
              class="thumb"
            >
              <img
                alt="${ phone.name }"
                src="${ phone.imageUrl }"
              >
            </a>
  
            <div class="phones__btn-buy-wrapper">
              <button class="btn btn-success" data-element="add-button">
                Add
              </button>
            </div>
  
            <a
              data-element="details-link"
              href="#!/phones/motorola-xoom-with-wi-fi"
            >
              ${ phone.name }
            </a>
            
            <p>${ phone.snippet }</p>
          </li>
        
        
        `).join('') }
      </ul>
    `;
  }
}
