import type { NextApiRequest, NextApiResponse } from "next";
import companies from "@/components/data/companies.json"
import { Company } from "@/components/utils/interfaces/companyInterface"

type Data = {
  page: number,
  size: number,
  totalItems: number,
  totalPages: number,
  data: Company[],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
    const { page = 1, size = 10 } = req.query

    const pN = parseInt(page as string, 10)
    const pS = parseInt(size as string, 10)

    const sIdx = (pN - 1) * pS
    const eIdx = sIdx + pS

    const pItms = companies.slice(sIdx, eIdx)

    res.status(200).json({
        page: pN,
        size: pS,
        totalItems: companies.length,
        totalPages: Math.ceil(companies.length / pS),
        data: pItms
    })
}
