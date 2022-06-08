import numpy as np

def save(array,file):
    arr_reshaped = array.reshape(array.shape[0], -1)
    np.savetxt(file, arr_reshaped, fmt='%i')
def load(file,z):
    loaded_arr = np.loadtxt(file)
    return loaded_arr.reshape(loaded_arr.shape[0], loaded_arr.shape[1] // z, z).T


