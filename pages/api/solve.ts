// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { writeFileSync } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as child_process from 'child_process';

type Data = {
  success: true
  a: number[]
  b: number[]
  c: number[]
  CC: number[][][]
  X: number[][][]
  L: number
} | {
  success: false
  error: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method == 'POST') {
    try {
      const { a, b, c, CC } = req.body as { a: number[], b: number[], c: number[], CC: number[][][] }
      writeFileSync('./solver/A.txt', a.join('\n'))
      writeFileSync('./solver/B.txt', b.join('\n'))
      writeFileSync('./solver/C.txt', c.join('\n'))
      const ccres = child_process.spawnSync(`python`, ['./solver/inputCC.py', JSON.stringify(CC)])
      if (ccres.status != 0)
        return res.status(400).json({
          success: false,
          error: `Invalid CC: ${ccres.stderr.toString()}`
        })
      const solveres = child_process.spawnSync(`python`, ['./solver/main.py'])

      if (solveres.status != 0)
        return res.status(400).json({
          success: false,
          error: `Solve failed: Singular Matrix`
          // error: `Solve failed: ${solveres.stderr.toString()}`
        })

      const ans = solveres.stdout.toString().replace(/[\n\r]/g, '').match(/\(array\((\[\[\[.+\]\]\])\), ([\d.]+)\)/)
      if (!ans)
        return res.status(400).json({
          success: false,
          error: `Solve failed: Invalid solver response`
        })
      res.status(200).json({
        success: true,
        X: JSON.parse(ans[1].replace(/\.([^0-9])/g, `$1`)),
        L: +ans[2],
        a, b, c, CC
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
  else
    res.status(404).send({
      success: false,
      error: '404'
    })
}
