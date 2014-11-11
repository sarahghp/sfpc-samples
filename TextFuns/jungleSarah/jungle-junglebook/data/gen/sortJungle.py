with open ('jungle.txt', 'r') as sinclairJungle:
  sinclairWords = sinclairJungle.read()

with open ('jungleBook.txt', 'r') as kiplingJungle:
  kiplingWords = kiplingJungle.read()

with open ('stopwords.txt', 'r') as stop:
  stopwords = stop.read()

def intersect(a, b):
  return list(set(a) & set(b))

def cleanWords (toClean):
  words = toClean.split()
  words = set(words)
  
  cleanWords = []

  for word in words:
    word = word.strip()
    word = word.lower()
    cleanWords.append(word)

  punctuations = '''0123456789!()-[]{};:'"_\,<>./?@#$%^&*_~--'''
  superCleanWords = []

  for word in cleanWords:
    noPunct = ""
    for char in word:
      if char not in punctuations:
        noPunct = noPunct + char
    if noPunct is not "" and noPunct not in stopwords:
      superCleanWords.append(noPunct)

  return superCleanWords

sinclairWords = cleanWords(sinclairWords)
kiplingWords = cleanWords(kiplingWords)
sharedWords = intersect(sinclairWords, kiplingWords)

def generateUniquesFile (text, title):

  finalWords = []

  if title is not 'shared':
    for word in text:
      if word not in sharedWords:
        finalWords.append(word)
  else:
    finalWords = text

  finalWords = set(sorted(finalWords))

  outputFile = open('_' + title + "Sorted.csv", 'w')

  for word in finalWords:
    outputFile.write(word + ", ")

  outputFile.close()

generateUniquesFile(sinclairWords, 'sinclair')
generateUniquesFile(kiplingWords, 'kipling')
generateUniquesFile(sharedWords, 'shared')