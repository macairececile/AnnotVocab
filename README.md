# InterAACtionPicto
Website allowing you to transform your sentence or word into a pictogram.

# Using with ARASAAC / Mulberry
For use this project, you need at least to have one of the two image banks.

## ARASAAC
ARASAAC has around 13000 pictograms in PNG format, weighting around 630MB.<br>
For get this image bank, use this in the terminal at the root of the project :
```sh
git clone https://github.com/InteraactionGroup/olpapi-arasaac/ pictograms/arasaac
```

## Mulberry
Mulberry has around 3500 pictograms in SVG format, weighting around 15MB.<br>
For get this image bank, use this in the terminal at the root of the project :
```sh
git clone https://github.com/InteraactionGroup/olpapi-mulberry/ pictograms/mulberry
```

# Setup InterAACtionPicto
The first time you get the project, do a ```npm install```.<br>
This is necessary in order to install the "Concurrency" package.<br>
It will allow to launch the server + the API in parallel.

# Run InterAACtionPicto
To run the project, do ```ng start```.<br>
This command :
- Launch the Angualer server on the port 4200
- Then in parallel, launch the Api for communicate with images banks on the port 30000

# How work the Api
From the website, we do requête on the Api and this returns us pictograms.<br>
We convert the urls before sending them to the api, then on the api side, we reverse the conversion (it doesn't like the "/" in the urls)

# Folders and their functions
Src/assets :
  - javascript code for communication with the api
  - manage the language of the site
  - Contains all images for website display

Src/app -> typescript code for the website<br>
Wordnet -> python code for synsete

# How work json
The jsons contain the sentence written by the user and the chosen pictograms associated with his sentence.<br>
The jsons are created only if it accepts that we save this data (By default it is yes).<br>
Locally, a folder is created in the project and will contain all the jsons.

## Put InterAACtionPicto on a server
To put InterAACtion Picto on a server do in the terminal ```ng build --prod```.
