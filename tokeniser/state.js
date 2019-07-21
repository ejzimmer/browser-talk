export class State extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
	}

	get isCurrent() {
		return this.element.classList.contains('current');
	}
	set isCurrent(current) {
		this.element.classList[current ? 'add' : 'remove']('current');
	}

	connectedCallback() {
		/*html*/
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					position: relative;
				}
				.state {
					--diameter: 120px;
					border: 2px solid currentColor;
					border-radius: 50%;
					width: var(--diameter);
					height: var(--diameter);
					overflow: hidden;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--default-colour);
					box-sizing: border-box;
					text-align: center;
					font-weight: bold;
					padding: 2px;
				}

				.current {
					color: hsl(100, 90%, 50%);
					border-width: 4px;
				}

				.rules {
					display: none;
					position: absolute;
					top: 0;
					left: calc(100% + 20px);
					z-index: 1;
					width: max-content;
					padding: 2em;
					list-style-type: none;
					background: linear-gradient(to bottom, hsl(40, 30%, 70%), hsl(40, 20%, 80%));
					border: 4px solid #555;
				}

				.rules li {
					margin: 1em 0;
				}

				.current:hover + .rules {
					display: block;
				}

			</style>
			<div class="state">${this.state.name.split('_').join(' ')}</div>
			<ul class="rules"></ul>
		`;

		this.element = this.shadowRoot.querySelector('.state');
		this.rules = this.shadowRoot.querySelector('.rules');

		this.state.rules.forEach(rule => {
			const element = document.createElement('li');

			const selector = rule.selector === ' ' ? '[space]' : (rule.selector || 'default');
			element.textContent = `${selector}: `;

			if (rule.actions) {
				element.textContent += rule.actions.map((action) => {
					if (action.create) {
						return `create ${action.create} token`;
					} else if (action === 'emit') {
						return 'emit token';
					} else {
						return action.replace(/[A-Z]/g, ($1) => ` ${$1.toLowerCase()}`);
					}
				}).join(', ') + ', ';

			}

			element.textContent += `go to ${rule.next}`;

			this.rules.append(element);
		});
	}
}