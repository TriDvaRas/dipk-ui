import numpy as np
from PP import PPtoPs, getPP

import io3d
from firstplan import firstplan
from opt import checkOptimal
from print3d import print3d



def main(CC, A, B, C):
    Tx = firstplan(A, B, C, CC)
    Tx = np.array([[[ Tx[i, j, k] if Tx[i, j, k] > 0 else -np.inf
                    for k in range(Tx.shape[2])]
                    for j in range(Tx.shape[1])]
                for i in range(Tx.shape[0])])
    # записываются индексы масива Tx, нужно при вычислении чтобы итерировать по нему
    indices = np.indices(Tx.shape).reshape(3, -1).T
    # indices -  метод который возвращает матрицу индексов  


    # print('Tx:')
    # print3d(Tx)
    c = checkOptimal(Tx, CC)
    # print('Opt:')
    # print3d(c)
    PP = getPP(Tx.shape)
    itr = 1
    while np.any(c < 0):
        # print(f"\n\nIter {itr}")
        ijkmin = np.unravel_index(c.argmin(), c.shape)
    #!!!!!
        Rqm1, PPa = PPtoPs(PP, Tx)
        Pb = -PP[ijkmin]
        # print(ijkmin)
        # print(Pb)
    # ?
        _t = None
        fks = 0
        while _t is None:
            if fks>200:
                raise Exception('MaxFks')
            _PPa = np.array(PPa)
            _Pb = np.array(Pb)
            while _PPa.shape[0] > _PPa.shape[1]:
                r = np.random.randint(0, _PPa.shape[0])
                _PPa = np.delete(_PPa, r, 0)
                _Pb = np.delete(_Pb, r, 0)
            try:
                _t = np.linalg.solve(_PPa, _Pb)
            except:
                fks += 1
                pass
    # ?/
    # # print(Rqm1.T)
    # # print(_t)
    # # print(f"Fks={fks}")
        teta = np.empty(Tx.shape)
        teta.fill(np.inf)
        for ijk, t in zip(Rqm1, _t):
            teta[ijk[0], ijk[1], ijk[2]] = t
        R_ = [(i, j, k) for i, j, k in indices if teta[i, j, k] < 0]
    # # print(R0_)
        teta0 = np.max([Tx[i, j, k]/teta[i, j, k] for i, j, k in R_])
    # # print(teta0)
        dteta = np.zeros(Tx.shape)
        dteta[ijkmin[0], ijkmin[1], ijkmin[2]] = 1
        for i, j, k in Rqm1:
            dteta[i, j, k] = teta[i, j, k]
        newAdded = False
        for i, j, k in indices:
            if Tx[i, j, k] == -np.inf and dteta[i, j, k] != 0:
                Tx[i, j, k] = -teta0*dteta[i, j, k]
            elif Tx[i, j, k] == teta0*dteta[i, j, k] and not newAdded:
                Tx[i, j, k] = -np.inf
                newAdded = True
            else:
                Tx[i, j, k] -= teta0*dteta[i, j, k]
        c = checkOptimal(Tx, CC)
        # print('Opt:')
        # print3d(c)
        X = np.zeros(Tx.shape)
        for i, j, k in indices:
            if Tx[i, j, k] > 0:
                X[i, j, k] = Tx[i, j, k]
        # print('X:')
        # print3d(X)
        # print('L:')
        # print(np.sum(X*CC))
        itr += 1
        if itr>250:
            raise Exception('MaxIter')
            

    X = np.zeros(Tx.shape)
    for i, j, k in indices:
        if Tx[i, j, k] > 0:
            X[i, j, k] = Tx[i, j, k]
    # print('X Opt:')
    # print3d(X)
    L = np.sum(X*CC)
    # print('L:')
    # print(L)
    return X, L

if __name__=='__main__':
    A = np.loadtxt("solver/A.txt")
    B = np.loadtxt("solver/B.txt")
    C = np.loadtxt("solver/C.txt")
    CC = io3d.load("solver/CC.txt", C.size)
    print(main(CC, A, B, C))

