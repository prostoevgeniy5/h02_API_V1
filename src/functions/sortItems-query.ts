export type SortBy<T> = {
  
  fieldName: keyof T
  direction: 'asc' | 'desc' 
}

export const sortQueryItems  = <T>(arr: T[], sortBy: SortBy<T>[]) => {

  return [...arr].sort((u1, u2) => {
    for(let sortConfig of sortBy) {
      if(u1[sortConfig.fieldName] < u2[sortConfig.fieldName]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if(u1[sortConfig.fieldName] > u2[sortConfig.fieldName]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
    }
    return 0
  })
}