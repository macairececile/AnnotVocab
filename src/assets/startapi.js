var express = require('express');
var natural = require('natural');
var fs = require('fs');
var Dichotomous = require('./dicho').Dichotomous;
var app = express();
var port = 30000;

// utility functions
var read = fileName => fs.readFileSync(fileName, 'utf8');
var json = fileName => JSON.parse(read(fileName));
var dicho = fileName => new Dichotomous(json(fileName));
var sendJson = (r, data) => r.send(JSON.stringify(data));
var has = (h, n) => h.hasOwnProperty(n) ? h[n] : undefined;
var define = (d, s) => (d.get(s) || '[missing definition]');
var size = o => Object.values(o).length;

var dirs = {
	wordnets: 'wordnets/',
	pictograms: 'pictograms/',
	sessions: 'sessions/',
	annotVocab: 'requestsAnnotVocab/',
};

// pictogram banks
var pictograms = (() => {
	let pictograms = {};
	let banks = fs.readdirSync(dirs.pictograms);
	console.log('banks',banks);
	for (let b in banks) {
		let bank = banks[b];
		let dir = dirs.pictograms + '/' + bank;
		if (!fs.lstatSync(dir).isDirectory()) continue;
		pictograms[bank] = {
			manifest: json(dir + '/manifest.json'),
			synsets: json(dir + '/synsets.json'),
			counts: json(dir + '/counts.json'),
			names: json(dir + '/names.json'),
		};
	}
	return pictograms;
})();

var toolboxes = (() => {
	let toolboxes = {};
	let wordnets = fs.readdirSync(dirs.wordnets);
	for (let w in wordnets) {
		let lang = wordnets[w];
		let dir = dirs.wordnets + lang;
		if (!fs.lstatSync(dir).isDirectory()) continue;
		let tokName = read(dir + '/tokenizer.txt').split('\n')[0];
		toolboxes[lang] = {
			tokenizer: new natural.WordTokenizer(),
			// a map taking a word and returning synsets (potential meanings)
			synsets: dicho(dir + '/synsets.json'),
			// a map taking a word and returning its canonical form
			variations: dicho(dir + '/variations.json'),
			// a map taking a synset and returning a definition
			definitions: dicho(dir + '/definitions.json'),
			stopList: json(dir + '/stop-list.json'),
		};
	}
	return toolboxes;
})();

var resultPicto = {};
var resultPictoNewFunction = {};
var tIdxSave;
var resultPictoTabBetter = [[],[]];

// SESSION FILES

var sessionId = Date.now().toString();
console.log('session', sessionId);
var sessionPath = dirs.sessions + sessionId;
fs.mkdirSync(sessionPath, { recursive: true });
fs.closeSync(fs.openSync(sessionPath + '/revoked.json', 'w'));
var session = {
	// these are not really JSON files:
	// it's one JSON-encoded object per line per file.
	storage: fs.openSync(sessionPath + '/storage.json', 'w'),
	issues: fs.openSync(sessionPath + '/issues.json', 'w'),
	updates: fs.openSync(sessionPath + '/updates.json', 'w')
};

var dataJs;

function getContribution(sessionId, file) {
	let content = [];
	let dir = dirs.sessions + sessionId + '/';
	let revoked = {};
	let revokedFileLines = read(dir + 'revoked.json').split('\n');
	for (let i in revokedFileLines) {
		let [contribFile, timestamp, user] = revokedFileLines[i].split('/');
		if (contribFile === file) {
			revoked[timestamp + user] = true;
		}
	}
	let path = dir + file + '.json';
	if (fs.existsSync(path)) {
		let lines = read(path).split('\n');
		for (let i in lines) {
			let line = lines[i];
			if (!line) continue;
			let contrib = JSON.parse(line);
			if (revoked[contrib.timestamp + contrib.user] === true) contrib.revoked = true;
			content.push(contrib);
		}
	}
	return content;
}

function revokeContribution(sessionId, timestamp, user, file) {
	let path = dirs.sessions + sessionId + '/revoked.json';
	let fd = fs.openSync(path, 'a');
	let line = file + '/' + timestamp + '/' + user;
	fs.writeSync(fd, line + '\n');
	fs.fsyncSync(fd); // flush
	fs.closeSync(fd);
}

// this function is used to reconvert the image URL
function replaceAllElem (text) {
  while (text.includes("_")){
    text = text.replace("_", "/");
  }
  return text;
}

function ArrayToList(tab){
  var list = {};
  var result = [];
  var text = "";
  for (let i = 0; i < tab.length / 3; i++){
    if(tab[tab.length*2/3+i] !== undefined){
      list = {surface_form: tab[i],synsets: tab[tab.length/3+i], URL: tab[tab.length*2/3+i]};
    }
    else{
      list = {surface_form: tab[i],synsets: tab[tab.length/3+i], URL: ''};
    }
    text = text + tab[i] + " ";
    result.push(list);
  }
  return [result, text];
}

// this function create a folder in the source code and create a file which contain request datas
function mkdirJS(value){
  value = replaceAllElem(value);
  value = value.split(',');
  var resultArrayToList = ArrayToList(value)
  var tabWordUrl = resultArrayToList[0];
  var text = resultArrayToList[1];

  var date = new Date();
  var dateNow = Date.now().toString();
  date = date.toLocaleDateString();
  var data = JSON.stringify(tabWordUrl);
  console.log('data : ', data);
  //document
  var doc = {document:{
	  name:'request'+dateNow+'.json',
		  date: date,
		  sentences:{
		  	text: text, words:tabWordUrl
      },
		  version: '10 février 2023'
    }};
  doc = JSON.stringify(doc);
  console.log('doc',doc);
  fs.mkdirSync('requests/', { recursive: true });
  fs.appendFile('requests/request'+dateNow+'.json', doc, function (err){
    if (err) throw err;
    console.log('Fichier créé !');
  });
}

function mkdirPostEdition(value){
	value = value.split(',');
}

function mkdirAnnotVocab(value){
	value = value.split(',');
	var text = value[0];
	var id = value[1];

	var date = new Date();
	var dateNow = Date.now().toString();
	date = date.toLocaleDateString();
	var doc = {
		name:'requestsAnnotVocab'+dateNow+'.json',
		date: date,
		text: text,
		picto: id,
		version: '10 février 2023'
	};
	doc = JSON.stringify(doc);
	console.log('doc',doc);
	fs.mkdirSync('requestsAnnotVocab/', { recursive: true });
	fs.appendFile('requestsAnnotVocab/requestsAnnotVocab'+dateNow+'.json', doc, function (err){
		if (err) throw err;
		console.log('Fichier créé !');
	});
}

function getAllAnnotVocabRequest(r){
	const listFiles = [];

	fs.readdir(dirs.annotVocab, function (err, files) {
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		files.forEach(function (file) {
			let rawData = fs.readFileSync(dirs.annotVocab + '/' + file);
			let data = JSON.parse(rawData);
			listFiles.push(data);
		});
		r.send(listFiles);
	});
}

// TOOL UPDATING

function setAdd(set, element) {
	if (set.indexOf(element) === -1) set.push(element);
}

function setRem(set, element) {
	let idx = set.indexOf(element);
	if (idx !== -1) set.splice(idx, 1);
}

// ADMIN FUNCTIONS

function processUpdate(u) {
	let a = u.action;
	let toolbox = u.lang ? has(toolboxes, u.lang) : undefined;
	// dichotomous associations
	/**/ if (a == 'set') toolbox[u.tool].set(u.key, u.value);
	else if (a == 'del') toolbox[u.tool].del(u.key);
	// arrays used as sets
	else if (a == 'add') setAdd(toolbox[u.tool], u.value);
	else if (a == 'rem') setRem(toolbox[u.tool], u.value);
}

function summary() {
	let state = {
		banks: {},
		toolboxes: {},
		sessions: [],
	};
	for (let b in pictograms) {
		let bank = pictograms[b];
		state.banks[b] = {
			manifest: bank.manifest,
			names: size(bank.names),
			synsets: size(bank.synsets),
			counts: size(bank.counts),
		};
	}
	for (let lang in toolboxes) {
		let toolbox = toolboxes[lang];
		state.toolboxes[lang] = {
			stopList: size(toolbox.stopList),
			variations: size(toolbox.variations.keys),
			synsets: size(toolbox.synsets.keys),
			definitions: size(toolbox.definitions.keys),
		};
	}
	state.sessions = fs.readdirSync(dirs.sessions).map(svc => parseInt(svc));
	return JSON.stringify(state);
}

// PUBLIC FUNCTIONS

function storeJson(fd, jsonStr, toConcat) {
	try {
		let obj = JSON.parse(jsonStr);
		Object.assign(obj, toConcat);
		fs.writeSync(fd, JSON.stringify(obj) + '\n');
		fs.fsyncSync(fd); // flush
		return 'OK';
	} catch (e) {
		console.error('storeJson', toConcat, e);
		return 'Invalid JSON data'
	}
}

function storeAndApplyUpdate(data) {
	let timestamp = Date.now();
	let json = JSON.stringify(data);
	let ok = storeJson(session.updates, json, { timestamp });
	if (ok === 'OK') processUpdate(data);
	return ok;
}

//check if the picto in the resultPictoTabBetter is at the good index to be add, if not we don't push in the final result
function checkAddPicto(currentIndexTarget){
  resultPictoTabBetter[1].forEach((Tab,index) => {
    if(Tab[1] <= currentIndexTarget){
      resultPicto[resultPictoTabBetter[0][index]] = resultPictoTabBetter[1][index];
    }
  });
  resultPictoTabBetter[1].forEach((Tab,index) => {
    if(Tab[1] <= currentIndexTarget){
      resultPictoTabBetter[0].splice(index,1);
      resultPictoTabBetter[1].splice(index,1);
    }
  });
}

// add remain picto in the final result
function addRemainingPicto(){
  console.log('remain picto', resultPictoTabBetter);
  resultPictoTabBetter[1].forEach((indexInTab,index) => {
    resultPicto[resultPictoTabBetter[0][index]] = resultPictoTabBetter[1][index];
  });
}

// search and return all pictograms from synsets
function synsetsToPictogram(synsetsStr) {
	let synsets = synsetsStr.split('+');
	console.log('synsets : ',synsets);
	// let results = {};
	for (let b in pictograms) {
	  console.log('bank : ', b);
    let bank = pictograms[b];
    for (let s in synsets) {
      let sIdx = parseInt(s);
      let corresponding = bank.synsets[synsets[sIdx]];
      console.log('corresponding', corresponding);
      // if any images are found, bind manually these images
      if (corresponding === undefined && synsets[s] !== 'undefined'){
        // test avec "passe" y a des petits soucis éclatés regarde le terminal
        if(b === 'arasaac'){
          corresponding = [10056];
        }
        /*
        if(b === 'mulberry'){
          corresponding = [1029]
        }
         */
      }
      for (let c in corresponding) {
        let i = corresponding[c];
        let p = 'p/' + b + '/' + i.toString();
        if (p in resultPicto) {
          checkAddPicto(sIdx);
          if (resultPicto[p][1] !== sIdx) {
            resultPicto[p].push(sIdx);
          }
        } else {
          let count = bank.counts[i];
          checkAddPicto(sIdx);
          resultPicto[p] = [count, sIdx];
        }
      }
    }
  }
	addRemainingPicto();
	return JSON.stringify(resultPicto);
}

// search with dichotomous method
// it fail because the array is not sort for javascript, if we sort this array, the index of picto will not changed so we will have the wrong index
function dichotomousInArray(array,name) {
  console.log('search world petit , at the index 8711 : ',array[8711]);
  array.sort();
  console.log(array);
  let start = 0;
  let end = array.length - 1;
  while(start < end){
    const mid = Math.ceil((start + end) / 2);
    console.log('mid',mid);
    console.log('word : ',array[mid]);
    if(array[mid] === name){
      return mid;
    } else if (array[mid] < name){
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
}

// if picto are the same for different words, it reformat datas to match with the structure of data used
function checkDoublonInResultPictoTabBetter(){
  resultPictoTabBetter[0].forEach((url,index) => {
    for(let i = index + 1; i < resultPictoTabBetter[0].length; i++){
      if(url === resultPictoTabBetter[0][i]){
        resultPictoTabBetter[1][index].push(resultPictoTabBetter[1][i][1]);
      }
    }
  });
  resultPictoTabBetter[0].forEach((url,index) => {
    for(let i = index + 1; i < resultPictoTabBetter[0].length; i++){
      if(url === resultPictoTabBetter[0][i]){
        resultPictoTabBetter[0].splice(i,1);
        resultPictoTabBetter[1].splice(i,1);
      }
    }
  });
}

// search if the name of every word is in the library, take the index in this library and put it in the URL
function sentenceToPictogram(toolbox,text, index){
  let tokenized = toolbox.tokenizer.tokenize(text);
  let resultFound = false;
  for (let b in pictograms) {
    let bank = pictograms[b];
    for (let t in tokenized) {
      let tIdx = index;
      // if nothing is found save the tIdx
      tIdxSave = tIdx;
      // let indexToken = dichotomousInArray(bank.names,tokenized[t]);
      let indexToken = bank.names.findIndex(name => tokenized[t] === name);
      if(indexToken !== -1){
        resultFound = true;
      }
      console.log('indexToken : ',indexToken);
      let corresponding = bank.names[indexToken];
      if (corresponding === undefined) continue;
      let p = 'p/' + b + '/' + indexToken.toString();
      if (p in resultPictoNewFunction) {
        resultPictoNewFunction[p].push(tIdx);
        resultPictoTabBetter[0].push(p);
        resultPictoTabBetter[1].push([1,tIdx]);
      }else{
        resultPictoNewFunction[p] = [1,tIdx];
        resultPictoTabBetter[0].push(p);
        resultPictoTabBetter[1].push([1,tIdx]);
      }
    }
  }
  if(!resultFound){
    resultPictoNewFunction['p/arasaac/10056'] = [1,tIdxSave];
    resultPictoTabBetter[0].push('p/arasaac/10056');
    resultPictoTabBetter[1].push([1,tIdxSave]);
  }
  checkDoublonInResultPictoTabBetter();
  console.log('resultPictoTabBetter', resultPictoTabBetter);
  return JSON.stringify({});
}

// this function search synsets in the toolbox from the text wrote by the user
function sentenceToSynsets(toolbox, text) {
	let tokenized = toolbox.tokenizer.tokenize(text);
	console.log('tokenized : ',tokenized);
	let tokens = [];
	let definitions = {};
	let stop = 0;
	for (let t in tokenized) {
		let token = tokenized[t];
		let index = parseInt(t);
		console.log('index : ',index);
		let i = text.slice(stop).indexOf(token);
		if (i == -1) console.error('A token was not found in original input:', text, token);
		let start = stop + i;
		stop = start + token.length;
		token = token.toLowerCase();
		let synsets = toolbox.synsets.get(token);
    if(synsets === undefined){
      sentenceToPictogram(toolbox,token,index);
      synsets = '';
    }
		tokens.push({ start, stop, synsets });
		for (let s in synsets) {
			let synset = synsets[s];
			definitions[synset] = define(toolbox.definitions, synset);
		}
	}
	console.log('tokens : ',tokens);
	return JSON.stringify({ tokens, definitions });
}

function feedTranslationToStorage(user, data) {
	let timestamp = Date.now();
	return storeJson(session.storage, data, { user, timestamp });
}

function storeIssue(user, data) {
	let timestamp = Date.now();
	return storeJson(session.issues, data, { user, timestamp });
}

function getPictogram(b, fileNumber) {
	let path = dirs.pictograms + '/' + b + '/pictograms/' + fileNumber;
	try {
		return fs.readFileSync(path);
	} catch (e) {
		return undefined;
	}
}

// reset variables before searching for pictograms
function resetResultPictogram(){
  resultPicto = {};
  resultPictoNewFunction = {};
  resultPictoTabBetter = [[],[]];
}

// PUBLIC ENDPOINTS

// synsets to pictogram
// example: /s2p/02207206v+07679356n
app.get('/s2p/:synsets', (q, r) => {
	r.send(synsetsToPictogram(q.params.synsets));
});

app.get('/reset', (q, r) => {
  r.send(resetResultPictogram());
});

app.get('/mkdirJS', (q, r) => {
  r.send(mkdirJS());
});

app.get('/mkdirPostEdition', (q, r) => {
	r.send(mkdirPostEdition());
});

app.get('/mkdirAnnotVocab', (q, r) => {
	r.send(mkdirAnnotVocab());
});

function appGetToolbox(path, then) {
	app.get(path, (q, r) => {
		let toolbox = has(toolboxes, q.params.lang);
		if (toolbox === undefined) r.status(400).send('Unknown language');
		else then(q, r, toolbox);
	});
}

// sentence to synsets
// example: /t2s/eng/Brian%20is%20in%20the%20kitchen
appGetToolbox('/t2s/:lang/:text', (q, r, t) => r.send(sentenceToSynsets(t, q.params.text)));

// sentence to pictograms
// example: /t2p/eng/Brian%20is%20in%20the%20kitchen
appGetToolbox('/t2p/:lang/:text', (q, r, t) => r.send(sentenceToPictogram(t, q.params.text)));

// get a pictogram
// example: /p/arasaac/35
app.get('/p/:bank/:file', (q, r) => {
	let b = q.params.bank;
	let f = q.params.file;
	let bank = pictograms[b];
	if (bank === undefined) {
		r.status(400).send('Unknown pictogram bank');
	} else {
		let pictogram = getPictogram(b, f);
		if (pictogram === undefined) {
			r.status(400).send('Unknown pictogram');
		} else {
			r.append('Content-Type', bank.manifest.mime);
			r.send(pictogram);
		}
	}
});

app.get('/mkdirJS/:data', (q, r) => {
  let data = q.params.data;
  r.send(mkdirJS(data));
});

app.get('/mkdirPostEdition', (q, r) => {
	let data = q.params.data;
	r.send(mkdirPostEdition(data));
});

app.get('/mkdirAnnotVocab/:data', (q, r) => {
	let data = q.params.data;
	r.send(mkdirAnnotVocab(data));
});

app.get('/getAllAnnotVocabRequest', (q, r) => {
	getAllAnnotVocabRequest(r);
});

// DIRECT DATA ACCESS

function appGetToolFind(endpoint, tool) {
	appGetToolbox(endpoint + '/:lang/:text', (q, r, t) => {
		return sendJson(r, t[tool].find(q.params.text));
	});
}

function appGetToolGet(endpoint, tool) {
	appGetToolbox(endpoint + '/:lang/:start/:length', (q, r, t) => {
		let start = parseInt(q.params.start);
		let length = parseInt(q.params.length);
		return sendJson(r, t[tool].getRange(start, length));
	});
}

// find something
// ex: /find-word-variation/fra/pom
appGetToolFind('/find-word-variation', 'variations');
appGetToolFind('/find-word-meanings', 'synsets');
appGetToolFind('/find-meaning-definition', 'definitions');

// get a slice of a tool's data
// ex: /words-meanings/fra/580/20
appGetToolGet('/words-variations', 'variations');
appGetToolGet('/words-meanings', 'synsets');
appGetToolGet('/meanings-definitions', 'definitions');

// get stop list
// example: /stop-list/eng
appGetToolbox('/stop-list/:lang', (q, r, t) => sendJson(r, t.stopList));

// AUTHENTICATED ENDPOINTS

function appGetAuth(endpoint, thenStore) {
	app.get(endpoint + '/:key/:data', (q, r) => {
		let user = 'anonymous'; //has(users, q.params.key);
		if (user === undefined) r.status(400).send('Unknown API key');
		else r.send(thenStore(user, q.params.data));
	});
}

// feeding a translation to storage
// example: /feed/execute-order-66/[json data]
appGetAuth('/feed', feedTranslationToStorage);

// report an issue
// example: /issue/execute-order-66/[json data]
appGetAuth('/issue', storeIssue);

// ADMIN ENDPOINTS

function adminGet(path, then) {
	app.get(path, (q, r) => {
		let isAdmin = true;
		if (isAdmin) then(q, r);
		else r.status(403).send('Forbidden');
	});
}

// get a state summary
// example: /summary
adminGet('/summary', (q, r) => r.send(summary()));

adminGet('/updates/:svc', (q, r) => sendJson(r, getContribution(q.params.svc, 'updates')));
adminGet('/issues/:svc', (q, r) => sendJson(r, getContribution(q.params.svc, 'issues')));
adminGet('/storage/:svc', (q, r) => sendJson(r, getContribution(q.params.svc, 'storage')));

function adminRevoker(contrib, file) {
	adminGet('/revoke-' + contrib + '/:svc/:ts/:u', (q, r) => {
		return sendJson(r, revokeContribution(q.params.svc, q.params.ts, q.params.u, file));
	});
}

adminRevoker('update', 'updates');
adminRevoker('issue','issues');
adminRevoker('storage', 'storage');

// get current sessionId
adminGet('/current-session-id', (q, r) => r.send(JSON.stringify(sessionId)));

function adminGetToolbox(path, then) {
	adminGet(path, (q, r) => {
		let toolbox = has(toolboxes, q.params.lang);
		if (toolbox === undefined) r.status(400).send('Unknown language');
		else then(q, r, toolbox);
	});
}

function adminDichoSetter(endpoint, tool, parseValue) {
	adminGetToolbox(endpoint + '/:lang/:key/:value', (q, r, toolbox) => {
		return r.send(storeAndApplyUpdate({
			lang: q.params.lang,
			action: 'set',
			tool,
			key: q.params.key,
			value: parseValue ? q.params.value.split('+') : q.params.value,
			user: 'admin'
		}));
	});
}

adminDichoSetter('/set-word-variation', 'variations', false);
adminDichoSetter('/set-word-synsets', 'synsets', true);
adminDichoSetter('/set-synset-definition', 'definitions', false);

function adminDichoDeleter(endpoint, tool) {
	adminGetToolbox(endpoint + '/:lang/:key', (q, r, toolbox) => {
		return r.send(storeAndApplyUpdate({
			lang: q.params.lang,
			action: 'del',
			tool,
			key: q.params.key,
			user: 'admin'
		}));
	});
}

adminDichoDeleter('/del-word-variation', 'variations');
adminDichoDeleter('/del-word-synsets', 'synsets');
adminDichoDeleter('/del-synset-definition', 'definitions');

adminGetToolbox('/add-stop-word/:lang/:value', (q, r, toolbox) => {
	return r.send(storeAndApplyUpdate({
		lang: q.params.lang,
		action: 'add',
		tool: 'stopList',
		value: q.params.value,
		user: 'admin'
	}));
});

adminGetToolbox('/rem-stop-word/:lang/:value', (q, r, toolbox) => {
	return r.send(storeAndApplyUpdate({
		lang: q.params.lang,
		action: 'rem',
		tool: 'stopList',
		value: q.params.value,
		user: 'admin'
	}));
});

// STATIC ENDPOINT

app.use('', express.static('static'));

// SESSION FILES CREATION

function updatesOpened(err, fd) {
	if (err) throw err;
	session.updates = fd;
	fs.open(session.storage, 'w', storageOpened);
}

function storageOpened(err, fd) {
	if (err) throw err;
	session.storage = fd;
	fs.open(session.issues, 'w', issuesOpened);
}

function issuesOpened(err, fd) {
	if (err) throw err;
	session.issues = fd;
	startServer();
}

// IGNITION

/* load stored updates: */ {
	let sessionDirs = fs.readdirSync(dirs.sessions);
	for (let u in sessionDirs) {
		let sessionUpdates = getContribution(sessionDirs[u], 'updates');
		for (let u in sessionUpdates) {
			let update = sessionUpdates[u];
			if (!update.canceled) processUpdate(update);
		}
	}
}

app.listen(port, () => console.log(`picto-api listening at http://localhost:${port}`));
