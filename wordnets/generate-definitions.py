import json
import xml.sax

output = {}

# https://wordnetcode.princeton.edu/glosstag.shtml

class XMLHandler( xml.sax.ContentHandler ):
	def __init__(self):
		self.synset = None
		self.in_gloss = False
		self.gloss = ""
	def startElement(self, tag, attributes):
		if tag == 'synset':
			self.synset = attributes["ofs"] + attributes["pos"]
		elif tag == 'orig':
			self.in_gloss = True
	def endElement(self, tag):
		if tag == 'synset':
			self.synset = None
		elif tag == 'orig':
			self.in_gloss = False
			output[self.synset] = self.gloss
	def characters(self, content):
		if self.in_gloss:
			self.gloss = content

parser = xml.sax.make_parser()
parser.setFeature(xml.sax.handler.feature_namespaces, 0)
parser.setContentHandler( XMLHandler() )
parser.parse("adj.xml")
parser.parse("adv.xml")
parser.parse("noun.xml")
parser.parse("verb.xml")

json_file = open('defs.json', 'w')
json.dump(output, json_file)
json_file.close()