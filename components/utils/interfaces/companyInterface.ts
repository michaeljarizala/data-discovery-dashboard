
export interface Company {
  id: number
  name: string
  shortnames?: string[]
  url: string
}

export interface INextPage {
  page: number
  totalPages: number
}

{/*
  The EP prefix stands for Endpoint
  which suggests that this interface
  is intended for the response taken
  from an API endpoint.
*/}
export interface EPCompany {
  data: Company[]
  page?: number
  size?: number
  totalItems?: number
  totalPages?: number
}