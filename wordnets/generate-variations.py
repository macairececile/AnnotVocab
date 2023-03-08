import json

# using files from http://kaiko.getalp.org/about-dbnary/download/

def_name = "fr.ttl"
mor_name = "fr_dbnary_morpho.ttl"
output_file = "fr.json"

def_name = "en.ttl"
mor_name = "en_dbnary_morpho.ttl"
output_file = "en.json"

morpho_reg = {}
output = {}

def process_decl(line, morpho):
	line = " ".join(line.replace(" .", "").split())
	parts = line.split(" ; ")
	header = parts[0].split(" a ")
	if len(header) != 2: return
	var_name = header[0]
	_type = header[1]

	fields = {}
	for field in parts[1:]:
		field_parts = field.split(' ')
		name = field_parts[0]
		value = ' '.join(field_parts[1:])
		if _type == "ontolex:Form" and name == "ontolex:writtenRep":
			nice_value = value.split('"')[1]
			if morpho:
				orig_name = '_'.join(var_name.split('_')[4:])
				if orig_name in morpho_reg:
					output[nice_value.lower()] = morpho_reg[orig_name].lower()
				else:
					print('unknown: ' + orig_name)
			else:
				orig_name = var_name.split("__cf_")[1]
				morpho_reg[orig_name] = nice_value
			break

file = open(def_name)
decl = ""
for line in file:
	if line.startswith('@'): continue
	line = line.replace('\r', '').replace('\n', '')
	decl += ' ' + line
	if line.endswith(" ."):
		process_decl(decl, False)
		decl = ""
file.close()

print("been there done that")

file = open(mor_name)
decl = ""
for line in file:
	if line.startswith('@'): continue
	line = line.replace('\r', '').replace('\n', '')
	decl += ' ' + line
	if line.endswith(" ."):
		process_decl(decl, True)
		decl = ""
file.close()

json_file = open(output_file, 'w')
json.dump(output, json_file)
json_file.close()