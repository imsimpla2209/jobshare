import { Http, instance } from './http'

export const createCategory = data => {
  return instance.post('categories', data)
}

export const getAllCategories = () => {
  return Http.get('categories')
}

export const updateCategory = (data, id: string) => {
  return instance.patch(`categories/${id}`, data)
}

export const deleteCategory = (id: string) => {
  return instance.delete(`categories/${id}`)
}
