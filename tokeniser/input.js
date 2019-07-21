export class InputTokens extends HTMLElement {
	get hasNext() { return this.index < this.input.length; }

	constructor() {
		super();

		this.input = this.textContent.trim().split('');
		this.index = -1;

		this.attachShadow({ mode: 'open' });

		this.side = 80;

		/*html*/
		this.shadowRoot.innerHTML = `
			<style>
				* {
					box-sizing: border-box;
				}
				:host {
					display: flex;
					overflow: hidden;
					background: linear-gradient(to bottom, hsl(40, 30%, 70%), hsl(40, 20%, 80%));
					box-shadow: 
						inset 10px 0 8px 0 black,
						inset -10px 0 8px 0 black;
				}
				span {
					--side: ${this.side}px;
					border: 2px solid black;
					padding: 10px;
					flex-shrink: 0;
					width: var(--side);
					height: var(--side);
					display: flex;
					align-items: center;
					justify-content: center;
					font-family: "Special Elite", monospace;
					font-size: 2em;
					font-weight: bold;
					transition: transform .2s;
				}
				span:not(:last-child) {
					border-right: none;
				}
			<style>
		`;
		
		
		this.shadowRoot.innerHTML += this.input.map(i => `<span>${i}</span>`).join('');

		this.next();
	}

	get current() {
		return this.input[this.index];
	}

	next() {
		this.index++;
		this.shadowRoot.querySelectorAll('span').forEach(span => span.style.transform = `translateX(-${this.index * this.side}px)`);
	}

	back() {
		this.index--;
		this.shadowRoot.querySelectorAll('span').forEach(span => span.style.transform = `translateX(${-this.index * this.side}px)`);
	}	

}
