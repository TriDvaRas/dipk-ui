import json
import numpy as np
from io3d import save
import sys

# -heigth -> +width -> -depth  
CC = np.array(json.loads(sys.argv[1]))
save(CC,'solver/CC.txt')