export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatVolunteerStatus = (status: string): string => {
  return {
    pending: 'Application Under Review',
    active: 'Active Volunteer',
    inactive: 'Inactive',
  }[status] || status
}
