import Component from '../../component.js';

export default class PhoneViewer extends Component{
  constructor({
    element,
    onBack = () => {},
    onBuy = () => {}
  }) {
    super({ element });
    this._onBack = onBack;
    this._onBuy = onBuy;


    this._element.addEventListener('click', (event) => {
      if (event.target === this._btnBack) {
        this._onBack();
      } else if (event.target === this._btnAddToCart) {
        this._onBuy(this._phoneDetails.id);
      } else if (event.target.matches('[data-thumb]')) {
        this._largeImg.src = event.target.closest('img').src;
      } else {
        return;
      }


    });
  }

  show(phoneDetails) {
    super.show();
    this._phoneDetails = phoneDetails;
    this._render();
    this._btnBack = this._element.querySelector('[data-element="back"]');
    this._btnAddToCart = this._element.querySelector('[data-element="add-to-cart"]');
    this._largeImg = this._element.querySelector('.phone');
  }

  _render() {
    const phone = this._phoneDetails;

    this._element.innerHTML = `
      <img class="phone" src="${ phone.images[0] }">

      <button data-element="back">Back</button>
      <button data-element="add-to-cart">Add to cart</button>
  
  
      <h1>${ phone.name }</h1>
  
      <p>${ phone.description }</p>
  
      <ul class="phone-thumbs">
      ${
  phone.images.map(img => 
    `
          <li>
            <img data-thumb src="${img}">
          </li>        
        `
  ).join('')
}

      </ul>
    `;
  }
}
