import json
import tabfile

# using files from http://compling.hss.ntu.edu.sg/omw/summx.html

def callback(output, parts):
	if len(parts) != 3: return
	synset, word = parts[0].replace('-', ''), parts[2]
	if word in output: output[word].append(synset)
	else: output[word] = [synset]

def conv(lang, path):
	output = {}
	tabfile.parse(path, callback, output)

	json_file = open('synsets.json', 'w')
	json.dump(output, json_file)
	json_file.close()

conv('fra', 'wikt.tab')
