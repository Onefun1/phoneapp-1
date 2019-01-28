import Component from '../../component.js';

export default class PhonesCart extends Component{
  constructor({
    element,
    phonesToBuy,
    phoneService
  }) {
    super({ element });

    this._phonesToBuy = phonesToBuy;
    this._phoneService = phoneService;

    this.addToCart = this.addToCart.bind(this);
    this._delFromCart = this._delFromCart.bind(this);

    this._render();


    this._element.addEventListener('click', (event) => {
      let phoneElement = event.target.closest('[data-element="phone"]');

      if (!phoneElement) {
        return;
      }

      if (event.target.closest('[data-cart-del]')) {
        this._delFromCart(phoneElement);
      } else {
        return;
      }


    });
  }

  addToCart(phoneId) {
    if (this._phonesToBuy.has(phoneId)) {
      this._phonesToBuy.get(phoneId).amount += 1;
    } else {
      const phoneDetails = this._phoneService.getById(phoneId);
      this._phonesToBuy.set(phoneId, {name: phoneDetails.name, amount: 1} );
    }
    this._render();
  }

  _delFromCart(phoneElement) {
    this._phonesToBuy.delete(phoneElement.dataset.phoneId);
    phoneElement.remove();
  }

  _render() {
    this._element.innerHTML = `
      <ul class="phones-in-cart">
        ${ Array.from(this._phonesToBuy).map(phone => `
        
          <li class="inCart" data-element="phone" data-phone-id="${ phone[0] }">
            <span class="cart-thumb">
              ${ phone[1].name }
            </span>
            <span class="cart-amnt">
              ${ phone[1].amount } 
            </span>
            <span data-cart-del class="phones__btn-buy-wrapper">
              <a class="btn btn-danger">
                Del
              </a>
            </span>

          </li>
        
        
        `).join('') }
      </ul>
    `;
  }
}
