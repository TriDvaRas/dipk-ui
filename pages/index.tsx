import axios from 'axios';
import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { isNumber, genCC } from '../util/numbers'
const Home: NextPage = () => {
    const [aSize, setASize] = useState(2)
    const [bSize, setBSize] = useState(3)
    const [cSize, setCSize] = useState(2)

    const [a, setA] = useState([1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [b, setB] = useState([3, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [c, setC] = useState([2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    const [CC, setCC] = useState([
        [
            [5, 4],
            [12, 21],
            [11, 13],
        ],
        [
            [32, 9],
            [10, 5],
            [0, 8],
        ]
    ])
    const [ans, setAns] = useState<{
        X: number[][][]
        L: number
        a: number[]
        b: number[]
        c: number[]
        CC: number[][][]
    } | undefined>()
    const [error, setError] = useState<string | undefined>()
    const [isSolving, setIsSolving] = useState(false)

    function setSize(value: string, ogr: 'a' | 'b' | 'c') {
        if (isNumber(+value) && +value >= 0)
            switch (ogr) {
                case 'a':
                    setASize(Math.min(+value, 12))
                    setCC(Array.from(genCC(Math.min(+value, 12), bSize, cSize, CC)))
                    break
                case 'b':
                    setBSize(Math.min(+value, 12))
                    setCC(Array.from(genCC(aSize, Math.min(+value, 12), cSize, CC)))
                    break
                case 'c':
                    setCSize(Math.min(+value, 12))
                    setCC(Array.from(genCC(aSize, bSize, Math.min(+value, 12), CC)))
                    break
            }

    }
    function setOgr(value: string, ogr: 'a' | 'b' | 'c', at: number) {
        if (isNumber(+value) && +value >= 0)
            switch (ogr) {
                case 'a':
                    let arr = Array.from(a)
                    arr[at] = +value
                    setA(arr)
                    break
                case 'b':
                    let brr = Array.from(b)
                    brr[at] = +value
                    setB(brr)
                    break
                case 'c':
                    let crr = Array.from(c)
                    crr[at] = +value
                    setC(crr)
                    break
            }
    }
    function _setCC(value: string, i: number, j: number, k: number) {
        if (isNumber(+value) && +value >= 0) {
            let _CC = Array.from(CC)
            _CC[i][j][k] = +value
            setCC(_CC)
        }
    }
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSolving(true)
        axios.post('/api/solve', {
            a: a.slice(0, aSize),
            b: b.slice(0, bSize),
            c: c.slice(0, cSize),
            CC
        }).then(res => {
            setAns(res.data)
            setError(undefined)
            setIsSolving(false)
        }).catch(err => {
            setAns(undefined)
            setError(err.response.data.error)
            setIsSolving(false)
        })
    }
    return <Container className='p-3'>
        <Card >
            <Card.Header className='fs-3'>
                Трипланарная задача?
            </Card.Header>
            <Card.Body>
                <Form onSubmit={submit}>
                    <Form.Group className="mb-3">
                        <Row>
                            <Col>
                                {/* A */}
                                <Form.Label>Пункты потребления?</Form.Label>
                                <Form.Control value={aSize} onChange={e => setSize(e.target.value, 'a')} />
                            </Col>
                            <Col>
                                {/* B */}
                                <Form.Label>Пункты производства?</Form.Label>
                                <Form.Control value={bSize} onChange={e => setSize(e.target.value, 'b')} />
                            </Col>
                            <Col>
                                {/* C */}
                                <Form.Label>Виды транспорта</Form.Label>
                                <Form.Control value={cSize} onChange={e => setSize(e.target.value, 'c')} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <hr />
                    <Form.Group className="mb-3">
                        <Form.Label>Ограничения A</Form.Label>
                        <Row className='mb-1'>
                            {
                                a.slice(0, aSize).map((x, i) => <Col key={i}><Form.Control value={x} onChange={e => setOgr(e.target.value, 'a', i)} /></Col>)
                            }
                        </Row>
                        <Form.Label>Ограничения B</Form.Label>
                        <Row className='mb-1'>
                            {
                                b.slice(0, bSize).map((x, i) => <Col key={i}><Form.Control value={x} onChange={e => setOgr(e.target.value, 'b', i)} /></Col>)
                            }
                        </Row>
                        <Form.Label>Ограничения C</Form.Label>
                        <Row className='mb-1'>
                            {
                                c.slice(0, cSize).map((x, i) => <Col key={i}><Form.Control value={x} onChange={e => setOgr(e.target.value, 'c', i)} /></Col>)
                            }
                        </Row>
                    </Form.Group>
                    <hr />
                    <Form.Group className="mb-3">
                        <Form.Label>Цены</Form.Label>
                        {
                            CC.map((CCc, i) => <div key={i}>
                                <Form.Label>Транспорт {i + 1}</Form.Label>
                                {
                                    CCc.map((CCb, j) => <Row key={j} className='mb-1'>
                                        {
                                            CCb.map((CCa, k) => <Col key={k}><Form.Control value={CCa} onChange={e => _setCC(e.target.value, i, j, k)} /></Col>)
                                        }
                                    </Row>)
                                }
                            </div>)
                        }
                    </Form.Group>
                    <Button type='submit' disabled={isSolving}>{isSolving ? <Spinner animation='border' /> : `Решить`}</Button>
                    {error && <Form.Text className="text-danger">
                        {error}
                    </Form.Text>}
                </Form>

            </Card.Body>
        </Card>
        {
            ans && <Card>
                <Card.Header className='fs-3'>Решение</Card.Header>
                <Card.Body>
                    <Card.Title>L</Card.Title>
                    <Card.Text>{ans.L}</Card.Text>
                    <Card.Title>X</Card.Title>
                    {
                        ans.X.map((Xc, i) => <div key={i}>
                            <Form.Label>Транспорт {i + 1}</Form.Label>
                            {
                                Xc.map((Xb, j) => <Row key={j} className='mb-1'>
                                    {
                                        Xb.map((Xa, k) => <Col key={k}><Form.Control readOnly value={Xa} /></Col>)
                                    }
                                </Row>)
                            }
                        </div>)
                    }
                </Card.Body>
            </Card>
        }
    </Container >
}

export default Home
