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

  return cleanWords

sharedWords = intersect(cleanWords(sinclairWords), cleanWords(kiplingWords))

def generateUniquesFile (text, title):

  punctuations = '''0123456789!()-[]{};:'"_\,<>./?@#$%^&*_~--'''
  superCleanWords = []

  for word in text:
    noPunct = ""
    for char in word:
      if char not in punctuations:
        noPunct = noPunct + char
    if noPunct is not "" and noPunct not in stopwords and noPunct not in sharedWords:
      superCleanWords.append(noPunct)

  superCleanWords = set(sorted(superCleanWords))

  outputFile = open('_' + title + "Sorted.csv", 'w')

  for word in superCleanWords:
    outputFile.write(word + ", ")

  outputFile.close()

generateUniquesFile(cleanWords(sinclairWords), 'sinclair')
generateUniquesFile(cleanWords(kiplingWords), 'kipling')
generateUniquesFile(sharedWords, 'shared')