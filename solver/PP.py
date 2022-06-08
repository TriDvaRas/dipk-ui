
import numpy as np


def getPP(shape):
    PP = np.zeros((shape[0], shape[1], shape[2], np.sum(shape)))
    for i in range(shape[0]):
        for j in range(shape[1]):
            for k in range(shape[2]):
                for a in range(shape[0]):
                    if a == i:
                        PP[i, j, k, a] = 1
                for b in range(shape[1]):
                    if b == j:
                        PP[i, j, k, b+shape[0]] = 1
                for c in range(shape[2]):
                    if c == k:
                        PP[i, j, k, c+shape[0]+shape[1]] = 1
    return PP


def PPtoPs(PP, Tx):
    indices = np.indices(PP.shape[0:3]).reshape(3, -1).T
    R = np.array(list(filter(lambda i: Tx[(i[0], i[1], i[2])] >= 0, indices)))
    return R, np.array([PP[i, j, k] for i, j, k in R]).T
