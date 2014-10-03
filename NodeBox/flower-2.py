size(1500, 1500)
speed(300)
percent = 0;
data = [200, 440, 707, 90, 91, 402, 560]

def setup():
    global frame
    frame = 1
    

def draw():
    
    global frame
    frame += 1
    
   # print frame
    percent = frame / (500.0 / len(data))
    percent = min(1, percent)
    
    
    transform(CORNER)
    translate(max(data), max(data))

    for (i, datum) in enumerate(data):
        percent = (percent - i * .03)
        
        if percent > 0:
            stroke(0.1, 0.1, 0.1)
        else:
            stroke(0, 0, 0, 0)    
        
        line(0, 0, (datum * percent), 0)
        rotate(36)
