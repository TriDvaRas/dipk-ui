import numpy as np

from print3d import print3d


def checkOptimal(Tx, CC):
    a = np.zeros((np.sum(Tx.shape), np.sum(Tx.shape)))
    b = np.zeros((np.sum(Tx.shape)))
    l = 0
    for i in range(Tx.shape[0]):
        for j in range(Tx.shape[1]):
            for k in range(Tx.shape[2]):
                if Tx[i, j, k] >= 0:
                    # print(np.array((i,j,k))+1)
                    a[l, i] = 1
                    a[l, j+Tx.shape[0]] = 1
                    a[l, k+Tx.shape[0]+Tx.shape[1]] = 1
                    b[l] = CC[i, j, k]
                    l += 1

    a[l, Tx.shape[0]] = 1
    a[l+1, Tx.shape[0]+Tx.shape[1]] = 1
    # print(a)
    # print(b)
    # print(np.linalg.det(a))
    uvw = np.linalg.solve(a, b)
    # print(uvw)
    c = np.empty(Tx.shape)
    for i in range(Tx.shape[0]):
        for j in range(Tx.shape[1]):
            for k in range(Tx.shape[2]):
                c[i, j, k] = CC[i, j, k] - (uvw[i]+uvw[j+Tx.shape[0]] +
                                   uvw[k+Tx.shape[0]+Tx.shape[1]])

    return c
