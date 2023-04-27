import sys
import fr_core_news_sm

nlp = fr_core_news_sm.load(exclude=["ner"])
nlp.get_pipe("lemmatizer").lookups.get_table("lemma_rules")["verb"] += [['e', 'er'], ['ent', 'er']
nlp.get_pipe("lemmatizer").cache = {}
doc = nlp(sys.argv[1])
textLemma = []
lemmaTags = {"VERB"}

for token in doc:
    if token.tag_ in lemmaTags:
        textLemma.append(token.lemma_)
    else:
        textLemma.append(token.text)

print(textLemma)
