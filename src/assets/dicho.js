class Dichotomous {
	constructor(obj) {
		if (obj !== undefined) {
			this.keys = Object.keys(obj);
			this.keys.sort();
			this.values = new Array(this.keys.length);
			for (let i in this.keys) {
				let key = this.keys[i];
				this.values[i] = obj[key];
			}
		} else {
			this.keys = [];
			this.values = [];
		}
	}
	_dichotomy(key) {
		let start = 0;
		let end = this.keys.length;
		if (end != 0) {
			while (true) {
				let length = end - start;
				let idx = start + (length >> 1);
				let k = this.keys[idx];
				/**/ if (k < key) start = idx;
				else if (k > key) end = idx;
				else return [true, idx];
				if (length == 1) break;
			}
		}
		return [false, start];
	}
	set(key, value) {
		let [found, idx] = this._dichotomy(key);
		while (idx < this.keys.length && this.keys[idx] < key) idx++;
		let delCount = found ? 1 : 0;
		this.keys.splice(idx, delCount, key);
		this.values.splice(idx, delCount, value);
	}
	del(key) {
		let [found, idx] = this._dichotomy(key);
		let delCount = found ? 1 : 0;
		this.keys.splice(idx, delCount);
		this.values.splice(idx, delCount);
	}
	get(key) {
		let [found, idx] = this._dichotomy(key);
		return found ? this.values[idx] : undefined;
	}
	getRange(start, length) {
		return {
			keys: this.keys.slice(start, start + length),
			values: this.values.slice(start, start + length),
		};
	}
	find(key) {
		return this._dichotomy(key)[1];
	}
}

module.exports = { Dichotomous };
