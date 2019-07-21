export const states = {
	data: {
		name: 'data',
		rules: [
			{ selector: '<', next: 'tag_open' },
			{ selector: '', actions: ['emit character'], next: 'data' }
		]
	},
	tag_open: {
		name: 'tag_open',
		rules: [
			{ selector: '/', actions: [{ create: 'end tag' }], next: 'end_tag_open' },
			{ 
				selector: /[a-zA-Z]/, 
				actions: [ { create: 'start tag' }, 'createName'], 
				next: 'tag_name',  
			}
		]
	},
	end_tag_open: {
		name: 'end_tag_open',
		rules: [
			{ selector: /[a-zA-Z]/, actions: ['createName'], next: 'tag_name' }
		]
	},
	tag_name: {
		name: 'tag_name',
		rules: [
			{ selector: ' ', next: 'before_attribute_name' },
			{ selector: '/', next: 'selfclosing_start_tag' },
			{ 
				selector: '>', 
				actions: ['emit'],
				next: 'data'
			},
			{ 
				selector: '',
				actions: ['updateName'],
				next: 'tag_name'
			}
		]
	},
	selfclosing_start_tag: {
		name: 'selfclosing_start_tag',
		rules: [
			{ selector: '>', actions: ['emit'], next: 'data' }
		]
	},
	before_attribute_name: {
		name: 'before_attribute_name',
		rules: [
			{ selector: '/', next: 'selfclosing_start_tag' },
			{ selector: '>', actions: ['emit'], next: 'data' },
			{ selector: /[a-zA-Z]/, actions: ['createAttribute'], next: 'attribute_name' }
		]
	},
	attribute_name: {
		name: 'attribute_name',
		rules: [
			{ selector: ' ', next: 'after_attribute_name' },
			{ selector: '/', next: 'selfclosing_start_tag' },
			{ selector: '>', actions: ['emit'], next: 'data' },
			{ selector: '=', next: 'before_attribute_value' },
			{ selector: '', actions: ['updateAttributeName'], next: 'attribute_name'}
		]
	},
	before_attribute_value: {
		name: 'before_attribute_value',
		rules: [
			{ selector: '"', next: 'attribute_value_double_quote' },
		]
	},
	attribute_value_double_quote: {
		name: 'attribute_value_double_quote',
		rules: [
			{ selector: '"', next: 'after_attribute_value' },
			{ selector: '', actions: ['updateAttributeValue'], next: 'attribute_value_double_quote' }
		]
	},
	after_attribute_value: {
		name: 'after_attribute_value',
		rules: [
			{ selector: ' ', next: 'before_attribute_name' },
			{ selector: '/', next: 'selfclosing_start_tag' },
			{ selector: '>', actions: ['emit'], next: 'data' }
		]
	}
};
