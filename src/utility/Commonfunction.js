export const SpecialCharactersFieldValidion = (value) => {
  const regex = /^[a-zA-Z0-9()_\s]+$/
  return regex.test(value) || 'Special characters and symbols are not allowed'
}
