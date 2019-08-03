import { InputTokens } from './input.js';
import { State } from './state.js';

customElements.define('input-tokens', InputTokens);
customElements.define('parser-state', State);

export class StateMachine extends HTMLElement {
	get hasNext() { return this.inputStream.hasNext; }

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });

		/*html*/
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: grid;
					grid-template-columns: 1fr 400px;
					grid-gap: 50px 10px;
					width: 100%;
				}
				input-tokens {
					grid-column: 1 / -1;
					max-width: 100%;
				}
				.states {
					display: grid;
					grid-template-columns: repeat(auto-fill, 180px);
					grid-gap: 10px;
				}
				.token {
					--hue: 200;
					text-align: right;
				}
			</style>
			<input-tokens>
				&lt;label for="name"&gt;Name&lt;/label&gt;&lt;input id="name" /&gt;	
			</input-tokens>
			<div class="states"></div>	
			<div class="token"></div>	
		`;

		this.inputStream = this.shadowRoot.querySelector('input-tokens');
		this.statesContainer = this.shadowRoot.querySelector('.states');
		this.tokenContainer = this.shadowRoot.querySelector('.token');
	}

	set states(states) {
		this.statesList = Object.values(states);

		this.statesList.forEach((state) => {
			state.element = document.createElement('parser-state');
			state.element.state = state;
			this.statesContainer.append(state.element);
		});

		this.current = states.data;
	}

	get current() {
		return this.statesList.find(state => state.element.isCurrent);
	}
	set current(current) {
		this.statesList.forEach(state => state.element.isCurrent = (state === current));
	}

	next() {
		this.previous = this.current;

		const rule = this.current.rules.find(rule => this.inputStream.current.match(rule.selector));

		this.current = this.statesList.find(state => state.name === rule.next);

		rule.actions && rule.actions.forEach(action => this.doAction(action));

		this.inputStream.next();
	}

	back() {
		this.current = this.previous;
		this.inputStream.back();
	}

	doAction(action) {
		if (action.create) {
			this.tokenContainer.innerHTML = `<output-token type="${action.create}"></output-token>`;
			this.token = this.shadowRoot.querySelector('output-token');
		} else if (typeof this.token[action] === 'function') {
			this.token[action](this.inputStream.current);
		} else if (action === 'emit character') {
			this.dispatchEvent(new CustomEvent('token', {
				bubbles: true,
				composed: true,
				detail: {
					type: 'CHAR',
					value: this.inputStream.current
				}
			}));
		}
	}
}

