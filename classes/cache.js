import fs from 'fs';

export default class Cache {
	async load(_name) {
		this._name = _name;
		if(!(fs.existsSync(_name))) await fs.writeFileSync(_name, '{}');
	    this.data = JSON.parse(await fs.readFileSync(_name));
	}

	async save() {
		await fs.writeFileSync(this._name, JSON.stringify(this.data));
	}

	isAddressCached(_address) {
		if(!this.data.addresses) this.data.addresses = {}
		if(!this.data.addresses?.[_address]) return false;
		return this.data.addresses[_address];
	}

	setAddressArtifacts(_address, _decimals, _symbol) {
		if(!this.isAddressCached(_address)) this.createAddress(_address);
		this.data.addresses[_address].decimals = _decimals;
		this.data.addresses[_address].symbol = _symbol;
	}

	setAddressBalance(_address, _balance) {
		if(!this.isAddressCached(_address)) this.createAddress(_address);
		this.data.addresses[_address].balance = _balance;
	}

	createAddress(_address) {
		this.data.addresses[_address] = {};
		return this.data.addresses[_address];
	}

	createList() {
		if(!this.data.length) this.data = [];
		return this.data;
	}
}
