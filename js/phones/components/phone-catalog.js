import Component from '../../component.js';

export default class PhoneCatalog extends Component {
  constructor({
    element,
    phones = [],
    onPhoneSelected = () => {},
    onBuy = () => {}
  }) {
    super({ element });
    this._element = element;
    this._phones = phones;
    this._onPhoneSelected = onPhoneSelected;
    this._onBuy = onBuy;

    this._render();

    this._element.addEventListener('click', (event) => {
      let phoneElement = event.target.closest('[data-element="phone"]');

      if (!phoneElement) {
        return;
      }
      if (event.target.closest('.thumb') || event.target.matches('[data-phone-header]')) {
        this._onPhoneSelected(phoneElement.dataset.phoneId);
      } else if (event.target.closest('[data-cart-add]') ) {
        this._onBuy(phoneElement.dataset.phoneId);
      }
    });
  }

  _render() {
    this._element.innerHTML = `
      <ul class="phones">
        ${ this._phones.map(phone => `
        
          <li class="thumbnail" data-element="phone" data-phone-id="${ phone.id }">
            <a href="#!/phones/${ phone.id }" class="thumb">
              <img alt="${ phone.name }" src="${ phone.imageUrl }">
            </a>
  
            <div data-cart-add class="phones__btn-buy-wrapper">
              <a class="btn btn-success">
                Add
              </a>
            </div>
  
            <a data-phone-header href="#!/phones/${ phone.id }">${ phone.name }</a>
            <p>${ phone.snippet }</p>
          </li>
        
        
        `).join('') }
      </ul>
    `;
  }
}
