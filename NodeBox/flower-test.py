size(1500, 1500)

data = [200, 440, 707, 90, 91, 402, 560]

translate(750,750)

count = 0;
for i in data:
    line(0, count*5, i, count*5)
    count++
 