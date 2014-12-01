with open ('anne.txt', 'r') as montgomery:
  montgomeryWords = montgomery.read()

with open ('etiquette.txt', 'r') as hartley:
  hartleyWords = hartley.read()

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

montgomeryWords = cleanWords(montgomeryWords)
hartleyWords = cleanWords(hartleyWords)
sharedWords = intersect(montgomeryWords, hartleyWords)

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

generateUniquesFile(montgomeryWords, 'montgomery')
generateUniquesFile(hartleyWords, 'hartley')
generateUniquesFile(sharedWords, 'shared')