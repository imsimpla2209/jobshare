import { Http, instance } from './http'

export const createSkill = data => {
  return instance.post('skills', data)
}

export const getAllSkills = () => {
  return Http.get('skills/all')
}

export const getSkillById = (id: string) => {
  return instance.get(`skills/${id}`)
}

export const updateSkill = (data, id: string) => {
  return instance.patch(`skills/${id}`, data)
}

export const deleteSkill = (id: string) => {
  return instance.delete(`skills/${id}`)
}
