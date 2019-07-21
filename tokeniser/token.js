export class Token extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.type = this.attributes.type.value;

		/*html*/
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					--hue: 200;
					--background-colour-top: hsl(var(--hue), var(--saturation, 30%), 70%);
					--background-colour-bottom: hsl(var(--hue), var(--saturation, 20%), 80%);
					--notch-width: 50%;
					background-image:
    				radial-gradient(circle at left, transparent var(--notch-width), var(--background-colour-top) var(--notch-width)),
						radial-gradient(circle at right, transparent var(--notch-width), var(--background-colour-bottom) var(--notch-width)),
						linear-gradient(to right, var(--background-colour-top), var(--background-colour-bottom));
  				background-position: 0 0, 100% 0, 50% 0;
  				background-repeat: repeat-y, repeat-y, no-repeat;
  				background-size: 5% 20%, 5% 20%, 90% 100%;
					color: #333;
					height: 5em;
					display: block;
					text-align: center;
					padding: .5em 1em;
					font-family: sans-serif;
					font-size: 2em;
				}
				.content {
					border: 4px solid hsl(var(--hue), var(--saturation, 80%), 20%);
					border-radius: 10px;
					width: 100%;
					height: 100%;
					box-sizing: border-box;
					padding: .2em;
				}
			</style>
			<div class="content">
				<div class="type">${this.type}</div>
				<slot></slot>
			</div>
		`;

		this.content = this.shadowRoot.querySelector('.content');
	}

	createName(char) {
		this.name = char;
		this.nameElement = document.createElement('div');
		this.content.append(this.nameElement);

		this.repaintName();
	}
	updateName(char) {
		this.name += char;
		this.repaintName();
	}
	repaintName() {
		this.nameElement.innerText = `name=${this.name}`;
	}

	createAttribute(char) {
		this.attribute = { name: char, value: '' };
		this.attributeElement = document.createElement('div');
		this.content.append(this.attributeElement);

		this.repaintAttribute();
	}
	updateAttributeName(char) {
		this.attribute.name += char;
		this.repaintAttribute();
	}
	updateAttributeValue(char) {
		this.attribute.value += char;
		this.repaintAttribute();
	}
	repaintAttribute() {
		this.attributeElement.innerText = `${this.attribute.name}=${this.attribute.value}`;
	}

	createValue(char) {
		this.type += `=${char}`;
		this.content.querySelector('.type').textContent = this.type;
	}

	emit() {
		this.dispatchEvent(new CustomEvent('token', { 
			bubbles: true,
			composed: true,
			detail: this
		}));
		this.parentElement.removeChild(this);
	}

	static rehydrate(details) {
		
	}


	constructor_(type, input) {
		this.input = input;

		if (type === 'character') {
			const element = document.createElement('div');
			element.innerText = `${input.current}`;
			this.element.append(element);
			this.emit();
		}
	}
}