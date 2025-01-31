class FastNavigationCard extends HTMLElement {
 static get properties() {
   return {
     hass: {},
     config: {},
   };
 }
 constructor() {
   super();
   this.attachShadow({ mode: 'open' });
 }
 setConfig(config) {
   if (!config.card) {
     throw new Error('Please define a card configuration');
   }
   this.position = config.position || 'top';
   this.background_style = config.background_style || 'solid';
   this.config = config;
   this.render();
 }
 set hass(hass) {
   this._hass = hass;
   if (this.card) {
     this.card.hass = hass;
   }
 }
 _createCard(cardConfig) {
   const cardElement = cardConfig.type.startsWith("custom:") 
     ? document.createElement(cardConfig.type.substr(7))
     : document.createElement(`hui-${cardConfig.type}-card`);
   
   cardElement.setConfig(cardConfig);
   if (this._hass) {
     cardElement.hass = this._hass;
   }
   return cardElement;
 }
 connectedCallback() {
   if (!this.observer) {
     this.observer = new ResizeObserver(() => this.updatePosition());
     this.observer.observe(document.body);
   }
   this.updatePosition();
 }
 disconnectedCallback() {
   if (this.observer) {
     this.observer.disconnect();
     this.observer = null;
   }
 }
 updatePosition() {
   if (this.position === 'sidebar') {
     return;
   }
   
   const mainContent = document.querySelector('home-assistant').shadowRoot
     .querySelector('home-assistant-main').shadowRoot
     .querySelector('ha-drawer').shadowRoot
     .querySelector('.content');
   
   if (mainContent) {
     const rect = mainContent.getBoundingClientRect();
     this.style.left = `${rect.left}px`;
   }
 }
 render() {
   // Hintergrund-Style basierend auf der Konfiguration
   const getBackgroundStyle = () => {
     switch(this.background_style) {
       case 'blur':
         return `
           background: rgba(var(--card-background-color, 255, 255, 255), 0.5);
           backdrop-filter: blur(10px);
           -webkit-backdrop-filter: blur(10px);
         `;
       case 'transparent':
         return `
           background: transparent;
           backdrop-filter: none;
           -webkit-backdrop-filter: none;
         `;
       default: // 'solid'
         return `
           background: var(--ha-card-background, var(--card-background-color, white));
         `;
     }
   };

   // Z-Index basierend auf Position
   const getZIndex = () => {
     switch(this.position) {
       case 'sidebar':
         return 999;  // Sidebar unter Popups
       case 'bottom':
         return 998;  // Bottom Navigation noch darunter
       case 'top':
         return 997;  // Top Navigation ganz unten
       default:
         return 997;
     }
   };

   this.shadowRoot.innerHTML = `
     <style>
       :host {
         display: block;
         position: fixed;
         z-index: ${getZIndex()};
         ${getBackgroundStyle()}
         width: 500px;
         padding: 0px;
         border-radius: 0px;
         box-shadow: none;
         transition: left 0.2s ease-in-out;
         ${this.position === 'top' ? 'top: 0;' : ''}
         ${this.position === 'bottom' ? `
           position: fixed;
           bottom: 0;
           margin: 0;
           padding-bottom: 0;` : ''}
         ${this.position === 'sidebar' ? `
           top: 50%;
           transform: translateY(-50%);
           width: 100px;
           right: 20px;
           left: auto !important;
         ` : ''}
       }
       #card {
         width: 100%;
         height: auto;
         ${this.position === 'bottom' ? `
           margin-bottom: 0 !important;
           padding-bottom: 0 !important;` : ''}
       }
       ${this.position === 'sidebar' ? `
         :host ::part(grid) {
           grid-template-columns: 1fr !important;
           gap: 8px !important;
         }
         :host ha-card {
           margin: 0 !important;
         }
       ` : ''}
       @media screen and (max-width: 510px) {
         :host {
           width: ${this.position === 'sidebar' ? '100px' : '500px'};
         }
       }
       @media screen and (max-width: 509px) {
         :host {
           width: ${this.position === 'sidebar' ? '100px' : '97%'};
           ${this.position === 'sidebar' ? 'display: none;' : ''}
         }        
     </style>
     <div id="card"></div>
   `;
   this.card = this._createCard(this.config.card);
   this.shadowRoot.querySelector('#card').appendChild(this.card);
 }
}

customElements.define('fast-navigation-card', FastNavigationCard);

window.customCards = window.customCards || [];
window.customCards.push({
 type: "fast-navigation-card",
 name: "Fast Navigation Card",
 preview: true,
 description: "A card for fast navigation with flexible positioning and background styles"
});
