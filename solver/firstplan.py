import numpy as np

from print3d import print3d


def firstplan(A, B, C, CC):
    _A = np.array(A)
    _B = np.array(B)
    _C = np.array(C)
    _CC = np.array(CC)
    i = 0
    j = 0
    k = 0
    Tx = np.empty(_CC.shape)
    Tx.fill(-np.inf)
    while (i < Tx.shape[0] and j < Tx.shape[1] and k < Tx.shape[2]):
        Q = np.array([_A[i], _B[j], _C[k]])
        Qi = np.argmin(Q)
        # print3d(Tx)
        # print(Q)
        # print(Qi)
        d = Q[Qi]
        # print(d)
        # print('\n')
        Tx[i, j, k] = d
        _A[i] -= d
        _B[j] -= d
        _C[k] -= d
        if Qi == 0:
            i += 1
        elif Qi == 1:
            j += 1
        else:
            k += 1
    # print3d(Tx)
    
    return Tx
